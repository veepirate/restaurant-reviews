// Import Firebase functions (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDf0IbhEaZnjcX16_Hf09jZZW-JfPPu1lI",
  authDomain: "restaurant-reviews-e9545.firebaseapp.com",
  projectId: "restaurant-reviews-e9545",
  storageBucket: "restaurant-reviews-e9545.firebasestorage.app",
  messagingSenderId: "719035264640",
  appId: "1:719035264640:web:095d69452c310050f18065"
};

// Init Firebase app + services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const statusDiv = document.getElementById("status");
const reviewForm = document.getElementById("review-form");

// 🔐 Google login
function googleLogin() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      statusDiv.innerText = `Logged in as ${result.user.displayName}`;
    })
    .catch(err => {
      statusDiv.innerText = err.message;
    });
}

// 🔓 Logout
function logout() {
  signOut(auth).then(() => {
    statusDiv.innerText = "Logged out";
    reviewForm.style.display = "none";
  });
}

// 👀 Show review form when logged in
onAuthStateChanged(auth, user => {
  if (user) {
    reviewForm.style.display = "block";
    statusDiv.innerText = `Logged in as ${user.displayName}`;
  } else {
    reviewForm.style.display = "none";
    statusDiv.innerText = "Logged out";
  }
});

// ✍️ Submit review
function submitReview() {
  const restaurant = document.getElementById("restaurant").value;
  const reviewText = document.getElementById("review").value;

  const reviewsRef = collection(db, "reviews");
  addDoc(reviewsRef, {
    restaurant,
    review: reviewText,
    user: auth.currentUser.email,
    timestamp: serverTimestamp()
  }).then(() => {
    statusDiv.innerText = "✅ Review submitted!";
    document.getElementById("restaurant").value = "";
    document.getElementById("review").value = "";
  }).catch(err => {
    statusDiv.innerText = err.message;
  });
}

// Expose functions to window so buttons work
window.googleLogin = googleLogin;
window.logout = logout;
window.submitReview = submitReview;


let selectedRating = 0;

document.querySelectorAll('#stars span').forEach(star => {
  star.addEventListener('mouseover', () => {
    const val = parseInt(star.dataset.value);
    highlightStars(val);
  });
  star.addEventListener('mouseout', () => {
    highlightStars(selectedRating);
  });
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.value);
    highlightStars(selectedRating);
  });
});

function highlightStars(value) {
  document.querySelectorAll('#stars span').forEach(star => {
    const starVal = parseInt(star.dataset.value);
    star.classList.toggle('hovered', starVal <= value);
    star.classList.toggle('selected', starVal <= selectedRating);
  });
}

