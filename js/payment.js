        const Payment = {
            mpesaRecipientNumber: '0769323786',

            process: (method, amount, details) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        let success = true;
                        let message = '';
                        let transactionId = '';

                        switch(method) {
                            case 'card':
                                success = Math.random() > 0.1;
                                transactionId = 'TXN-' + Utils.generateId();
                                message = success ? 'Card payment successful' : 'Card payment declined by bank';
                                break;
                            case 'paypal':
                                success = Math.random() > 0.05;
                                transactionId = 'PAY-' + Utils.generateId();
                                message = success ? 'PayPal payment confirmed' : 'PayPal authorization failed';
                                break;
                            case 'mpesa':
                                // M-Pesa requires phone number validation
                                if (!details.phone || details.phone.length < 9) {
                                    success = false;
                                    message = 'Invalid M-Pesa phone number';
                                } else {
                                    success = Math.random() > 0.05;
                                    transactionId = Utils.generateMpesaCode();
                                    message = success ? `M-Pesa payment confirmed for ${details.recipientName}. Check your phone for confirmation.` : 'M-Pesa transaction failed. Insufficient funds or wrong PIN.';
                                }
                                break;
                        }

                        if (success) {
                            resolve({
                                success: true,
                                transactionId,
                                method,
                                message,
                                recipientNumber: details.recipientNumber,
                                recipientName: details.recipientName
                            });
                        } else {
                            resolve({ success: false, message });
                        }
                    }, 2000);
                });
            }
        };

