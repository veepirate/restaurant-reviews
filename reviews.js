import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDf0IbhEaZnjcX16_Hf09jZZW-JfPPu1lI",
  authDomain: "restaurant-reviews-e9545.firebaseapp.com",
  projectId: "restaurant-reviews-e9545",
  storageBucket: "restaurant-reviews-e9545.firebasestorage.app",
  messagingSenderId: "719035264640",
  appId: "1:719035264640:web:095d69452c310050f18065"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load reviews
async function loadReviews() {
  const container = document.getElementById("reviews-container");
  const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();

    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";

    const stars = "★".repeat(data.rating || 0) + "☆".repeat(5 - (data.rating || 0));

    reviewDiv.innerHTML = `
      <h3>${data.restaurant}</h3>
      <div class="stars">${stars}</div>
      <div class="meta">By: ${data.user} — ${data.timestamp?.toDate().toLocaleString() || "Unknown date"}</div>
      <div class="detail"><strong>Food Quality:</strong> ${data.foodQuality}</div>
      <div class="detail"><strong>Service:</strong> ${data.service}</div>
      <div class="detail"><strong>Atmosphere:</strong> ${data.atmosphere}</div>
      ${data.review ? `<div class="detail"><strong>Comments:</strong> ${data.review}</div>` : ""}
    `;

    container.appendChild(reviewDiv);
  });
}

loadReviews();
