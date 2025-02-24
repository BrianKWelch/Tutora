// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmzDsxlhQwMZTlpnPlVLRRVxDQZwKW6zI",
    authDomain: "tutora-93be2.firebaseapp.com",
    projectId: "tutora-93be2",
    storageBucket: "tutora-93be2.appspot.com",
    messagingSenderId: "538400859458",
    appId: "1:538400859458:web:1c45fe0364821442d854db",
    measurementId: "G-SJ9FDWTHED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User Authentication (Sign Up / Login / Logout)
const signUp = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("User signed up successfully!");
    } catch (error) {
        alert("Error signing up: " + error.message);
    }
};

const login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("User logged in successfully!");
    } catch (error) {
        alert("Error logging in: " + error.message);
    }
};

const logout = async () => {
    try {
        await signOut(auth);
        alert("User logged out!");
    } catch (error) {
        alert("Error logging out: " + error.message);
    }
};

// Tutor Profile Creation
const createTutorProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in first.");
        return;
    }

    const name = document.getElementById('tutorName').value;
    const subject = document.getElementById('subject').value;
    const qualification = document.getElementById('qualification').value;

    try {
        await setDoc(doc(db, "tutors", user.uid), {
            name: name,
            subject: subject,
            qualification: qualification,
            verified: false
        });
        alert("Tutor profile created successfully!");
    } catch (error) {
        alert("Error creating tutor profile: " + error.message);
    }
};

// Booking a Session
const bookSession = async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in first.");
        return;
    }

    const tutorId = document.getElementById('tutorId').value;
    const date = document.getElementById('sessionDate').value;
    const duration = document.getElementById('sessionDuration').value;
    const price = document.getElementById('sessionPrice').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    try {
        await addDoc(collection(db, "sessions"), {
            parentId: user.uid,
            tutorId: tutorId,
            date: date,
            duration: duration,
            price: price,
            paymentMethod: paymentMethod,
            status: paymentMethod === 'Stripe' ? "Paid" : "Pending Payment"
        });
        alert("Session booked successfully!");
    } catch (error) {
        alert("Error booking session: " + error.message);
    }
};

// Attach Event Listeners (Only After DOM Loads)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signUpBtn").addEventListener("click", signUp);
    document.getElementById("loginBtn").addEventListener("click", login);
    document.getElementById("logoutBtn").addEventListener("click", logout);
    document.getElementById("createProfileBtn").addEventListener("click", createTutorProfile);
    document.getElementById("bookSessionBtn").addEventListener("click", bookSession);
});


// Function to Load Parent Dashboard Data
function loadParentDashboard() {
    console.log("Loading Parent Dashboard...");

    // Fetch upcoming sessions
    document.getElementById("upcomingSessions").innerHTML = "<tr><td>John Doe</td><td>Ms. Smith</td><td>March 10</td><td>1 hour</td><td><button>Cancel</button></td></tr>";

    // Fetch past sessions
    document.getElementById("pastSessions").innerHTML = "<tr><td>John Doe</td><td>Mr. Brown</td><td>Feb 20</td><td>1.5 hours</td><td>Completed</td></tr>";

    // Fetch payment history
    document.getElementById("paymentHistory").innerHTML = "<tr><td>TXN123456</td><td>$50</td><td>March 1</td><td>Paid</td></tr>";
}

// Ensure Parent Dashboard loads when the page is ready
document.addEventListener("DOMContentLoaded", loadParentDashboard);
