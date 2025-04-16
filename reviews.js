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
  const summaryContainer = document.getElementById("rating-summary");

  const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  const reviewsByRestaurant = {};

  snapshot.forEach(doc => {
    const data = doc.data();

    // Group reviews by restaurant name
    if (!reviewsByRestaurant[data.restaurant]) {
      reviewsByRestaurant[data.restaurant] = [];
    }
    reviewsByRestaurant[data.restaurant].push(data);

    // Display individual review card (same as before)
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";
    const stars = "★".repeat(data.rating || 0) + "☆".repeat(5 - (data.rating || 0));

    reviewDiv.innerHTML = `
      <h3>${data.restaurant}</h3>
      <div class="stars">${stars}</div>
      <div class="meta">
        ${data.user?.photo ? `<img src="${data.user.photo}" class="profile-pic">` : ""}
        <strong>${data.user?.name || "Anonymous"}</strong> • ${data.user?.email || ""}
        <br><small>${data.timestamp?.toDate().toLocaleString() || "Unknown date"}</small>
      </div>
      <div class="detail"><strong>Food Quality:</strong> ${data.foodQuality || "-"}</div>
      <div class="detail"><strong>Service:</strong> ${data.service || "-"}</div>
      <div class="detail"><strong>Atmosphere:</strong> ${data.atmosphere || "-"}</div>
      ${data.review ? `<div class="detail"><strong>Comments:</strong> ${data.review}</div>` : ""}
    `;

    container.appendChild(reviewDiv);
  });

  // 👉 Now build the summary view
  const summaryHTML = Object.entries(reviewsByRestaurant).map(([restaurant, reviews]) => {
    const avgRating = (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1);
    return `<div><strong>${restaurant}</strong>: ${avgRating} ★ (${reviews.length} review${reviews.length > 1 ? 's' : ''})</div>`;
  }).join("");

  summaryContainer.innerHTML = `
    <h2>📈 Average Ratings by Restaurant</h2>
    ${summaryHTML}
    <hr>
  `;
}

loadReviews();
