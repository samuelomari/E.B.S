const firebaseConfig = {
    apiKey: 'AIzaSyDnRbDBQDSVxUkdDXePNWL3qLemZ1EB7dY',
    authDomain: 'electronic-booking-syste-bcc31.firebaseapp.com',
    projectId: 'electronic-booking-syste-bcc31',
    storageBucket: 'electronic-booking-syste-bcc31.firebasestorage.app',
    messagingSenderId: '116174197129',
    appId: '1:116174197129:web:574df26101a4ca8d661158',
    measurementId: 'G-RHLMNT4NNF'
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseFunctions = firebase.functions(app);
window.firebaseSignInWithGoogle = () => auth.signInWithRedirect(googleProvider);
window.firebaseSignOut = () => auth.signOut();
window.firebaseSendWelcomeEmail = (name) => window.firebaseFunctions.httpsCallable('sendWelcomeEmail')({name});
window.firebaseSendPurchaseEmail = (ticket) => window.firebaseFunctions.httpsCallable('sendPurchaseConfirmation')(ticket);
const redirectResult = auth.getRedirectResult()
    .then((result) => result.user || auth.currentUser)
    .catch((error) => {
        window.firebaseAuthError = error;
        return auth.currentUser;
    });
window.firebaseAuthReady = Promise.race([
    redirectResult,
    new Promise((resolve) => setTimeout(() => resolve(auth.currentUser), 4000))
]);

firebase.analytics.isSupported().then((supported) => {
    if (supported) window.firebaseAnalytics = firebase.analytics();
});