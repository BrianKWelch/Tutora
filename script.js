// Tutora Web App - Full Payment Integration

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

// Session Booking System with Payment Options
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
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    const sessionRef = db.collection("sessions").doc();
    const sessionData = {
        parentId: userId,
        tutorId: tutorId,
        date: date,
        duration: duration,
        price: price,
        paymentMethod: paymentMethod,
        status: paymentMethod === 'Stripe' ? "Paid" : "Pending Payment"
    };

    sessionRef.set(sessionData)
    .then(() => {
        if (paymentMethod === 'Stripe') {
            processStripePayment(sessionRef.id, price);
        } else if (paymentMethod === 'PayPal') {
            processPayPalPayment(sessionRef.id, price);
        } else {
            alert("Payment instructions for " + paymentMethod + " will be sent.");
            console.log("Session booked, waiting for manual payment confirmation.");
        }
    })
    .catch((error) => console.error("Error booking session:", error.message));
}

// Stripe Payment Processing (Placeholder)
function processStripePayment(sessionId, amount) {
    console.log(`Processing Stripe payment of $${amount} for session ${sessionId}...`);
    // Replace with actual Stripe API integration
}

// PayPal Payment Handling (Redirecting to PayPal)
function processPayPalPayment(sessionId, amount) {
    console.log(`Redirecting to PayPal for session ${sessionId} with amount $${amount}`);
    // Implement PayPal redirection logic here
}

// Manual Payment Methods (CashApp, Zelle)
function confirmManualPayment(sessionId) {
    db.collection("sessions").doc(sessionId).update({ status: "Paid" })
    .then(() => console.log("Manual payment confirmed for session", sessionId))
    .catch((error) => console.error("Error confirming manual payment:", error.message));
}

// Event Listeners
document.getElementById("signUpBtn").addEventListener("click", signUp);
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("bookSessionBtn").addEventListener("click", bookSession);
