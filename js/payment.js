        const Payment = {
            mpesaRecipientNumber: '0769323786',

            process: async (method, amount, details) => {
                try {
                    if (method === 'paypal') {
                        if (!window.firebaseCreatePaypalOrder || !window.firebaseCapturePaypalOrder) return { success: false, message: 'PayPal is not configured.' };
                        return { success: false, message: 'PayPal checkout requires customer approval. Complete the PayPal approval flow before enabling ticket issuance.' };
                    }
                    if (method === 'mpesa') {
                        if (!window.firebaseInitiateMpesa) return { success: false, message: 'M-Pesa is not configured.' };
                        const phone = '254' + details.phone.replace(/^0/, '');
                        const result = await window.firebaseInitiateMpesa(amount, phone, details.reference);
                        return { ...result.data, pending: true, method, recipientNumber: details.recipientNumber, recipientName: details.recipientName };
                    }
                    return { success: false, message: 'Card payments require a secure payment provider and are not enabled yet.' };
                } catch (error) {
                    return { success: false, message: error.message || 'Payment could not be completed.' };
                }
            }
        };

