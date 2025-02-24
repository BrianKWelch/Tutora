// Tutora Web App - Fixed Tutor Profile & Button Actions

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Initialize Firebase (Replace with your Firebase project details)
const firebaseConfig = {
    apiKey: "AIzaSyCmzDsxlhQwMZTlpnPlVLRRVxDQZwKW6zI",
    authDomain: "tutora-93be2.firebaseapp.com",
    projectId: "tutora-93be2",
    storageBucket: "tutora-93be2.appspot.com",
    messagingSenderId: "538400859458",
    appId: "1:538400859458:web:1c45fe0364821442d854db",
    measurementId: "G-SJ9FDWTHED"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// User Authentication (Sign Up / Login / Logout)
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        alert("User signed up successfully!");
    })
    .catch((error) => alert("Error signing up: " + error.message));
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        alert("User logged in successfully!");
    })
    .catch((error) => alert("Error logging in: " + error.message));
}

function logout() {
    firebase.auth().signOut()
    .then(() => alert("User logged out!"))
    .catch((error) => alert("Error logging out: " + error.message));
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
        verified: false
    }).then(() => {
        alert("Tutor profile created successfully!");
    }).catch((error) => alert("Error creating tutor profile: " + error.message));
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

    db.collection("sessions").add({
        parentId: userId,
        tutorId: tutorId,
        date: date,
        duration: duration,
        price: price,
        paymentMethod: paymentMethod,
        status: paymentMethod === 'Stripe' ? "Paid" : "Pending Payment"
    }).then(() => {
        alert("Session booked successfully!");
    }).catch((error) => alert("Error booking session: " + error.message));
}

// Event Listeners
document.getElementById("signUpBtn").addEventListener("click", signUp);
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("createProfileBtn").addEventListener("click", createTutorProfile);
document.getElementById("bookSessionBtn").addEventListener("click", bookSession);
