const firebaseConfig = {
    apiKey: 'AIzaSyDnRbDBQDSVxUkdDXePNWL3qLemZ1EB7dY',
    authDomain: 'electronic-booking-syste-bcc31.firebaseapp.com',
    projectId: 'electronic-booking-syste-bcc31',
    storageBucket: 'electronic-booking-syste-bcc31.firebasestorage.app',
    messagingSenderId: '116174197129',
    appId: '1:116174197129:web:574df26101a4ca8d661158',
    measurementId: 'G-RHLMNT4NNF'
};

let app = null;
let auth = null;
let googleProvider = null;

try {
    if (typeof firebase !== 'undefined') {
        app = firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        googleProvider = new firebase.auth.GoogleAuthProvider();

        window.firebaseApp = app;
        window.firebaseAuth = auth;
        window.firebaseFunctions = firebase.functions(app);
        window.firebaseSignInWithGoogle = () => auth.signInWithPopup(googleProvider);
        window.firebaseSignOut = () => auth.signOut();
        window.firebaseSendWelcomeEmail = (name) => window.firebaseFunctions.httpsCallable('sendWelcomeEmail')({name});
        window.firebaseSendPurchaseEmail = (ticket) => window.firebaseFunctions.httpsCallable('sendPurchaseConfirmation')(ticket);
        window.firebaseCreatePaypalOrder = (amount) => window.firebaseFunctions.httpsCallable('createPaypalOrder')({amount});
        window.firebaseCapturePaypalOrder = (orderId) => window.firebaseFunctions.httpsCallable('capturePaypalOrder')({orderId});
        window.firebaseInitiateMpesa = (amount, phone, reference) => window.firebaseFunctions.httpsCallable('initiateMpesaStkPush')({amount, phone, reference});

        window.firebaseAuthReady = new Promise((resolve) => {
            let unsubscribed = false;
            const timeout = setTimeout(() => {
                if (!unsubscribed) {
                    resolve(auth.currentUser);
                }
            }, 3000);

            const unsubscribe = auth.onAuthStateChanged(
                (user) => {
                    unsubscribed = true;
                    clearTimeout(timeout);
                    unsubscribe();
                    resolve(user);
                },
                (error) => {
                    unsubscribed = true;
                    clearTimeout(timeout);
                    window.firebaseAuthError = error;
                    resolve(null);
                }
            );
        });

        if (firebase.analytics && firebase.analytics.isSupported) {
            firebase.analytics.isSupported().then((supported) => {
                if (supported) window.firebaseAnalytics = firebase.analytics();
            }).catch(() => {});
        }
    } else {
        window.firebaseAuthReady = Promise.resolve(null);
    }
} catch (e) {
    console.warn('Firebase initialization warning:', e);
    window.firebaseAuthError = e;
    window.firebaseAuthReady = Promise.resolve(null);
}