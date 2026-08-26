/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {HttpsError, onCall} from "firebase-functions/v2/https";
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
	if (!email || !email.endsWith("@gmail.com")) {
		throw new HttpsError("permission-denied", "A verified Gmail account is required");
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
	if (!email || !email.endsWith("@gmail.com")) {
		throw new HttpsError("permission-denied", "A verified Gmail account is required");
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
