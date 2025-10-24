/* -------------------------------------------------
✅ TRADING JOURNAL - WORKING VERSION
- Firebase Auth (Anonymous)
- Firestore CRUD
- Auto UI loading
--------------------------------------------------*/

// ✅ Firebase Import & Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5rvkKPst6V9-7HoqK1f27jQj6x7f8LiA",
  authDomain: "trading-journal-da4eb.firebaseapp.com",
  projectId: "trading-journal-da4eb",
  storageBucket: "trading-journal-da4eb.appspot.com",
  messagingSenderId: "50906470929",
  appId: "1:50906470929:web:b9ad784e9ae86c06d42fb0",
  measurementId: "G-WR261BKTXL"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ UI FUNCTIONS
function showLoading(msg) {
  document.getElementById('loading-message').textContent = msg;
  document.getElementById('loading-status').classList.remove('hidden');
}
function hideLoading(msg = "Ready!") {
  document.getElementById('loading-message').textContent = msg;
  setTimeout(() => {
    document.getElementById('loading-status').classList.add('hidden');
  }, 400);
}
function showApp() {
  document.getElementById('app').classList.remove('hidden');
}

// ✅ SIGN IN Anonymously
showLoading("Starting… authenticating…");

signInAnonymously(auth).catch((e) => {
  console.error("Auth failed:", e);
  showLoading(`Auth error: ${e.code}`);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("auth-status").textContent =
      `Signed in (anon): ${user.uid.slice(0, 8)}…`;

    hideLoading("Connected ✅");
    showApp();
    loadTrades(); ✅ // Load trades after login
  }
});

// ✅ Firestore References
const tradesRef = collection(db, "trades");

// ✅ LOAD Trades Realtime
function loadTrades() {
  const tradeList = document.getElementById("trade-list");
  const noTradesMsg = document.getElementById("no-trades-message");

  onSnapshot(tradesRef, (snapshot) => {
    tradeList.innerHTML = "";

    if (snapshot.empty) {
      noTradesMsg.classList.remove("hidden");
      return;
    }

    noTradesMsg.classList.add("hidden");

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      const pnlColor = data.pnl >= 0 ? "text-green-600" : "text-red-600";

      const row = `
        <tr>
          <td class="px-3 py-3">${data.entryDate}</td>
          <td class="px-3 py-3 font-bold">${data.symbol}</td>
          <td class="px-3 py-3 text-right">$${data.entryPrice}</td>
          <td class="px-3 py-3 text-right">$${data.exitPrice}</td>
          <td class="px-3 py-3 text-right">${data.size}</td>
          <td class="px-3 py-3 text-right ${pnlColor} font-bold">$${data.pnl}</td>
          <td class="px-3 py-3 text-right">
            <button class="text-red-600 font-semibold delete-btn" data-id="${id}">
              Delete
            </button>
          </td>
        </tr>
      `;
      tradeList.insertAdjacentHTML("beforeend", row);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => deleteTrade(e.target.dataset.id));
    });
  });
}

// ✅ Add Trade
document.getElementById("add-trade-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const symbol = document.getElementById("symbol").value.toUpperCase();
  const entryDate = document.getElementById("entryDate").value;
  const size = parseFloat(document.getElementById("size").value);
  const entryPrice = parseFloat(document.getElementById("entryPrice").value);
  const exitPrice = parseFloat(document.getElementById("exitPrice").value);
  const pnl = parseFloat(((exitPrice - entryPrice) * size).toFixed(2));

  const data = { symbol, entryDate, size, entryPrice, exitPrice, pnl };

  try {
    await addDoc(tradesRef, data);
    document.getElementById("add-trade-form").reset();
  } catch (err) {
    alert("Error adding trade " + err);
  }
});

// ✅ Delete trade
async function deleteTrade(id) {
  await deleteDoc(doc(db, "trades", id));
}
