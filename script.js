// Tutora Web App - Updated Code with Session Booking & Payment System

// Initialize Firebase (Replace with your Firebase project details)
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// User Authentication (Sign Up / Login / Logout)
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        console.log("User signed up:", userCredential.user);
    })
    .catch((error) => console.error("Error signing up:", error.message));
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
    })
    .catch((error) => console.error("Error logging in:", error.message));
}

function logout() {
    firebase.auth().signOut()
    .then(() => console.log("User logged out"))
    .catch((error) => console.error("Error logging out:", error.message));
}

// Tutor Profile Creation & Verification System
function createTutorProfile() {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) {
        alert("Please log in first.");
        return;
    }

    const name = document.getElementById('tutorName').value;
    const subject = document.getElementById('subject').value;
    const qualification = document.getElementById('qualification').value;

    db.collection("tutors").doc(userId).set({
        name: name,
        subject: subject,
        qualification: qualification,
        verified: false // Default until reviewed
    }).then(() => {
        console.log("Tutor profile created successfully");
    }).catch((error) => console.error("Error creating tutor profile:", error.message));
}

// Session Booking System
function bookSession() {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) {
        alert("Please log in first.");
        return;
    }

    const tutorId = document.getElementById('tutorId').value;
    const date = document.getElementById('sessionDate').value;
    const duration = document.getElementById('sessionDuration').value;
    const price = document.getElementById('sessionPrice').value;

    db.collection("sessions").add({
        parentId: userId,
        tutorId: tutorId,
        date: date,
        duration: duration,
        price: price,
        status: "pending"
    }).then(() => {
        console.log("Session booked successfully");
    }).catch((error) => console.error("Error booking session:", error.message));
}

// Payment Processing Placeholder
function processPayment(sessionId, amount) {
    console.log(`Processing payment of $${amount} for session ${sessionId}...`);
    // Replace with actual payment API integration (Stripe, PayPal, etc.)
}

// Event Listeners
document.getElementById("signUpBtn").addEventListener("click", signUp);
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("createProfileBtn").addEventListener("click", createTutorProfile);
document.getElementById("bookSessionBtn").addEventListener("click", bookSession);

