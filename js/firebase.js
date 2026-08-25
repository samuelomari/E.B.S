import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js';

const firebaseConfig = {
    apiKey: 'AIzaSyDnRbDBQDSVxUkdDXePNWL3qLemZ1EB7dY',
    authDomain: 'electronic-booking-syste-bcc31.firebaseapp.com',
    projectId: 'electronic-booking-syste-bcc31',
    storageBucket: 'electronic-booking-syste-bcc31.firebasestorage.app',
    messagingSenderId: '116174197129',
    appId: '1:116174197129:web:574df26101a4ca8d661158',
    measurementId: 'G-RHLMNT4NNF'
};

const app = initializeApp(firebaseConfig);

isSupported().then((supported) => {
    if (supported) {
        window.firebaseAnalytics = getAnalytics(app);
    }
});

window.firebaseApp = app;