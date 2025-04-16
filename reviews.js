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

document.getElementById("show-all-btn").addEventListener("click", () => {
  document.querySelectorAll(".review").forEach(r => r.style.display = "block");
});

function showOnlyReviewsFor(name) {
  const reviews = document.querySelectorAll(".review");
  reviews.forEach(r => {
    const title = r.querySelector("h3")?.innerText || "";
    r.style.display = title === name ? "block" : "none";
  });

  // Optional: scroll to the review section
  document.getElementById("reviews-container").scrollIntoView({ behavior: "smooth" });
}

  document.getElementById("write-review-btn").addEventListener("click", () => {
    console.log("Button clicked, trying to open popup...");

    const popup = window.open("/restaurant-reviews/submit.html", "ReviewPopup", "width=500,height=700");

    // If popup failed to open
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      alert("🚫 Popup blocked! Please allow popups for this site.");
    }

    // Refresh main page when popup is closed
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        location.reload();
      }
    }, 500);
  });

// Load reviews
async function loadReviews() {
  const container = document.getElementById("reviews-container");
  const summaryContainer = document.getElementById("rating-summary");

  const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  const reviewsByRestaurant = {};

  snapshot.forEach(doc => {
    const data = doc.data();

    document.querySelectorAll(".restaurant-link").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const selected = link.dataset.name;
        showOnlyReviewsFor(selected);
      });
    });

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

  const summaryHTML = Object.entries(reviewsByRestaurant)
  .map(([restaurant, reviews]) => {
    const avg = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
    const avgRating = avg.toFixed(1);

    let emoji = "😐";
    if (avg >= 4.5) emoji = "🥇";
    else if (avg >= 4.0) emoji = "🌟";
    else if (avg >= 3.0) emoji = "🙂";
    else if (avg >= 2.0) emoji = "😕";
    else emoji = "😬";

    return {
      name: restaurant,
      avgRating: parseFloat(avgRating),
      count: reviews.length,
      emoji
    };
  })
  .sort((a, b) => b.avgRating - a.avgRating) // 🔽 sort by avgRating
  .map(entry => `
    <div class="summary-row">
      <a href="#" class="restaurant-link" data-name="${entry.name}">
        <strong>${entry.name}</strong>
      </a>:
      ${entry.avgRating} ★ ${entry.emoji} (${entry.count} review${entry.count > 1 ? 's' : ''})
    </div>
  `).join("");

summaryContainer.innerHTML = `
  <h2>📈 Average Ratings by Restaurant</h2>
  ${summaryHTML}
  <hr>
`;

}



loadReviews();
