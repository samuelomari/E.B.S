/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {HttpsError, onCall, onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

const paypalClientId = defineSecret("PAYPAL_CLIENT_ID");
const paypalClientSecret = defineSecret("PAYPAL_CLIENT_SECRET");
const paypalBaseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
const paypalCurrency = process.env.PAYPAL_CURRENCY || "USD";
const mpesaConsumerKey = defineSecret("MPESA_CONSUMER_KEY");
const mpesaConsumerSecret = defineSecret("MPESA_CONSUMER_SECRET");
const mpesaPasskey = defineSecret("MPESA_PASSKEY");
const mpesaShortcode = defineSecret("MPESA_SHORTCODE");

const requireAuth = (request: {auth?: {uid?: string}}) => {
	if (!request.auth?.uid) throw new HttpsError("unauthenticated", "Sign in before starting a payment");
};

const paypalToken = async () => {
	const credentials = Buffer.from(`${paypalClientId.value()}:${paypalClientSecret.value()}`).toString("base64");
	const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
		method: "POST",
		headers: {Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded"},
		body: "grant_type=client_credentials",
	});
	if (!response.ok) throw new Error(`PayPal authentication returned ${response.status}`);
	const data = await response.json() as {access_token: string};
	return data.access_token;
};

export const createPaypalOrder = onCall({secrets: [paypalClientId, paypalClientSecret]}, async (request) => {
	requireAuth(request);
	const amount = Number(request.data?.amount);
	if (!Number.isFinite(amount) || amount <= 0) throw new HttpsError("invalid-argument", "A positive payment amount is required");
	try {
		const token = await paypalToken();
		const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
			method: "POST",
			headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
			body: JSON.stringify({intent: "CAPTURE", purchase_units: [{amount: {currency_code: paypalCurrency, value: amount.toFixed(2)}}]}),
		});
		if (!response.ok) throw new Error(`PayPal order returned ${response.status}`);
		const data = await response.json() as {id: string};
		return {orderId: data.id};
	} catch (error) {
		console.error("PayPal order creation failed", error);
		throw new HttpsError("failed-precondition", "PayPal is not configured or is temporarily unavailable");
	}
});

export const capturePaypalOrder = onCall({secrets: [paypalClientId, paypalClientSecret]}, async (request) => {
	requireAuth(request);
	const orderId = String(request.data?.orderId || "");
	if (!orderId) throw new HttpsError("invalid-argument", "A PayPal order is required");
	try {
		const token = await paypalToken();
		const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
			method: "POST",
			headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
		});
		if (!response.ok) throw new Error(`PayPal capture returned ${response.status}`);
		const data = await response.json() as {status: string; id: string};
		return {success: data.status === "COMPLETED", transactionId: data.id, status: data.status};
	} catch (error) {
		console.error("PayPal capture failed", error);
		throw new HttpsError("failed-precondition", "PayPal could not confirm this payment");
	}
});

export const initiateMpesaStkPush = onCall({secrets: [mpesaConsumerKey, mpesaConsumerSecret, mpesaPasskey, mpesaShortcode]}, async (request) => {
	requireAuth(request);
	const phone = String(request.data?.phone || "").replace(/^\+/, "");
	const amount = Math.round(Number(request.data?.amount));
	if (!/^2547\d{8}$/.test(phone) || !Number.isFinite(amount) || amount < 1) {
		throw new HttpsError("invalid-argument", "Enter a valid Kenyan M-Pesa number and amount");
	}
	try {
		const basic = Buffer.from(`${mpesaConsumerKey.value()}:${mpesaConsumerSecret.value()}`).toString("base64");
		const tokenResponse = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {headers: {Authorization: `Basic ${basic}`}});
		if (!tokenResponse.ok) throw new Error(`M-Pesa token returned ${tokenResponse.status}`);
		const tokenData = await tokenResponse.json() as {access_token: string};
		const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
		const password = Buffer.from(`${mpesaShortcode.value()}${mpesaPasskey.value()}${timestamp}`).toString("base64");
		const response = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
			method: "POST",
			headers: {Authorization: `Bearer ${tokenData.access_token}`, "Content-Type": "application/json"},
			body: JSON.stringify({BusinessShortCode: mpesaShortcode.value(), Password: password, Timestamp: timestamp, TransactionType: "CustomerPayBillOnline", Amount: amount, PartyA: phone, PartyB: mpesaShortcode.value(), PhoneNumber: phone, CallBackURL: process.env.MPESA_CALLBACK_URL, AccountReference: String(request.data?.reference || "EVENT"), TransactionDesc: "Event ticket"}),
		});
		if (!response.ok) throw new Error(`M-Pesa STK push returned ${response.status}`);
		const data = await response.json() as {ResponseCode: string; CheckoutRequestID: string; CustomerMessage?: string};
		if (data.ResponseCode !== "0") throw new Error(data.CustomerMessage || "M-Pesa rejected the request");
		return {success: true, transactionId: data.CheckoutRequestID, message: "Check your phone and enter your M-Pesa PIN"};
	} catch (error) {
		console.error("M-Pesa STK push failed", error);
		throw new HttpsError("failed-precondition", "M-Pesa is not configured or is temporarily unavailable");
	}
});

export const mpesaCallback = onRequest((request, response) => {
	console.log("M-Pesa callback received", request.body);
	response.status(200).json({ResultCode: 0, ResultDesc: "Accepted"});
});

type PurchaseEmail = {
	eventTitle: string;
	ticketId: string;
	quantity: number;
	total: number;
	paymentMethod: string;
	purchaseDate: string;
};

const sendEmail = async (to: string, subject: string, text: string) => {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.EMAIL_FROM;
	if (!apiKey || !from) throw new Error("Email service is not configured");

	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({from, to: [to], subject, text}),
	});
	if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
};

export const sendWelcomeEmail = onCall(async (request) => {
	const email = request.auth?.token.email?.toLowerCase();
	if (!email) {
		throw new HttpsError("permission-denied", "A verified Google account is required");
	}

	await sendEmail(
		email,
		"Welcome to EventBooking",
		`Hello ${request.data?.name || "there"},\n\nYour Gmail account has been successfully registered with EventBooking. Google has verified your account, and you can now sign in and use the platform.\n\nThank you,\nEventBooking`,
	);
	return {sent: true};
});

export const sendPurchaseConfirmation = onCall(async (request) => {
	const data = request.data as PurchaseEmail;
	const email = request.auth?.token.email?.toLowerCase();
	if (!email) {
		throw new HttpsError("permission-denied", "A verified Google account is required");
	}
	if (!data.eventTitle || !data.ticketId || !data.quantity || !data.total) {
		throw new HttpsError("invalid-argument", "Incomplete ticket details");
	}

	await sendEmail(
		email,
		`Ticket confirmed: ${data.eventTitle}`,
		`Hello,\n\nThank you for your purchase. Your ticket has been confirmed.\n\nEvent: ${data.eventTitle}\nTicket ID: ${data.ticketId}\nQuantity: ${data.quantity}\nTotal paid: ${data.total}\nPayment method: ${data.paymentMethod}\nPurchase date: ${data.purchaseDate}\n\nWe appreciate your business and look forward to seeing you at the event.\n\nThank you,\nEventBooking`,
	);
	return {sent: true};
});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
