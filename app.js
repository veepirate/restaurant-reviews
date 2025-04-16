// Paste your Firebase config here ↓
const firebaseConfig = {apiKey: "AIzaSyDf0IbhEaZnjcX16_Hf09jZZW-JfPPu1lI",
                        authDomain: "restaurant-reviews-e9545.firebaseapp.com",
                        projectId: "restaurant-reviews-e9545",
                        storageBucket: "restaurant-reviews-e9545.firebasestorage.app",
                        messagingSenderId: "719035264640",
                        appId: "1:719035264640:web:095d69452c310050f18065"};
// Init Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const statusDiv = document.getElementById("status");
const reviewForm = document.getElementById("review-form");

// Auth handlers
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      statusDiv.innerText = `Logged in as ${result.user.displayName}`;
    })
    .catch(err => {
      statusDiv.innerText = err.message;
    });
}
function logout() {
  auth.signOut().then(() => {
    statusDiv.innerText = "Logged out";
    reviewForm.style.display = "none";
  });
}

// Show/hide review form when logged in
auth.onAuthStateChanged(user => {
  if (user) {
    reviewForm.style.display = "block";
  } else {
    reviewForm.style.display = "none";
  }
});

// Submit review
function submitReview() {
  const restaurant = document.getElementById("restaurant").value;
  const reviewText = document.getElementById("review").value;

  db.collection("reviews").add({
    restaurant,
    review: reviewText,
    user: auth.currentUser.email,
    timestamp: new Date()
  }).then(() => {
    statusDiv.innerText = "✅ Review submitted!";
    document.getElementById("restaurant").value = "";
    document.getElementById("review").value = "";
  }).catch(err => statusDiv.innerText = err.message);
}
