import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB5rvkKPst6V9-7HoqK1f27jQj6x7f8LiA",
  authDomain: "trading-journal-da4eb.firebaseapp.com",
  projectId: "trading-journal-da4eb",
  storageBucket: "trading-journal-da4eb.firebasestorage.app",
  messagingSenderId: "50906470929",
  appId: "1:50906470929:web:b9ad784e9ae86c06d42fb0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load trades from Firestore
async function loadTrades() {
  const tradesCol = collection(db, "trades");
  const tradeSnapshot = await getDocs(tradesCol);
  const tradeList = tradeSnapshot.docs.map(doc => doc.data());

  console.log("Fetched Trades:", tradeList);

  document.body.insertAdjacentHTML('beforeend',
    `<h3>Firestore Data Loaded ✅</h3>
     <pre>${JSON.stringify(tradeList, null, 2)}</pre>`
  );
}

loadTrades();
