// Importuj i skonfiguruj Firebase w Service Workerze
// Nadaj temu plikowi nazwę firebase-messaging-sw.js i umieść go w głównym katalogu
importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js");

// Twoja konfiguracja Firebase
// WAŻNE: Musi być taka sama jak w Twojej aplikacji
const firebaseConfig = {
    apiKey: "__API_KEY__",
    authDomain: "__AUTH_DOMAIN__",
    projectId: "__PROJECT_ID__",
    storageBucket: "__STORAGE_BUCKET__",
    messagingSenderId: "__MESSAGING_SENDER_ID__",
    appId: "__APP_ID__"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
