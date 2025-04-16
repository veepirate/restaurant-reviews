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

const select = document.getElementById("restaurant");
const otherInput = document.getElementById("restaurant-other");

select.addEventListener("change", () => {
  otherInput.style.display = select.value === "other" ? "block" : "none";
});

import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const restaurantSelect = document.getElementById("restaurant");
const otherInput = document.getElementById("restaurant-other");

async function loadRestaurantOptions() {

  
  try {
    console.log("Loading restaurants...");
    const snapshot = await getDocs(collection(db, "restaurants"));
    console.log("Snapshot size:", snapshot.size);

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.name) {
        const option = document.createElement("option");
        option.value = data.name;
        option.innerText = data.name;
        restaurantSelect.appendChild(option);
      }
    });

    // Add "Other..." option at end
    const otherOption = document.createElement("option");
    otherOption.value = "other";
    otherOption.innerText = "➕ Other...";
    restaurantSelect.appendChild(otherOption);

  } catch (error) {
    console.error("Failed to load restaurants:", error);
  }
}

loadRestaurantOptions();

// Show/hide "Other" input
restaurantSelect.addEventListener("change", () => {
  otherInput.style.display = restaurantSelect.value === "other" ? "block" : "none";
});



// Add variable to hold user
let currentUser = null;

// 👀 Show review form when logged in
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user; // ✅ Store the signed-in user
    reviewForm.style.display = "block";
    statusDiv.innerText = `Logged in as ${user.displayName}`;
  } else {
    currentUser = null;
    reviewForm.style.display = "none";
    statusDiv.innerText = "Logged out";
  }
});

// ✍️ Submit review
function submitReview() {
  const restaurant = restaurantSelect.value === "other"
  ? otherInput.value.trim()
  : restaurantSelect.value;
  const reviewText = document.getElementById("review").value;
  const foodQuality = document.getElementById("food-quality").value;
  const service = document.getElementById("service").value;
  const atmosphere = document.getElementById("atmosphere").value;

  if (!restaurant || selectedRating === 0 || !foodQuality || !service || !atmosphere) {
    statusDiv.innerText = "❗ Please complete all required fields.";
    return;
  }

if (!currentUser) {
  statusDiv.innerText = "❗ You must be logged in to submit a review.";
  return;
}

// Optional: Save new restaurant to collection
if (restaurantSelect.value === "other" && restaurant) {
  await addDoc(collection(db, "restaurants"), { name: restaurant });
}

const reviewData = {
  restaurant,
  review: reviewText,
  rating: selectedRating,
  foodQuality,
  service,
  atmosphere,
  user: {
    email: currentUser.email,
    name: currentUser.displayName,
    photo: currentUser.photoURL
  },
  timestamp: serverTimestamp()
};

  const reviewsRef = collection(db, "reviews");
  addDoc(reviewsRef, reviewData).then(() => {
    statusDiv.innerText = "✅ Review submitted!";
    document.getElementById("restaurant").value = "";
    document.getElementById("review").value = "";
    document.getElementById("food-quality").value = "";
    document.getElementById("service").value = "";
    document.getElementById("atmosphere").value = "";
    selectedRating = 0;
    highlightStars(0);
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

