/* -------------------------------------------------
 TRADING JOURNAL - CLEAN WORKING VERSION (no emojis)
 - Firebase Auth (Anonymous)
 - Firestore CRUD (trades collection)
 - Metrics + Charts
 - Loading overlay control
--------------------------------------------------*/

// Firebase Import & Config
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI helpers
function showLoading(msg) {
  const lm = document.getElementById("loading-message");
  const ls = document.getElementById("loading-status");
  if (lm) lm.textContent = msg || "Loading…";
  if (ls) ls.classList.remove("hidden");
}
function hideLoading(msg) {
  const lm = document.getElementById("loading-message");
  const ls = document.getElementById("loading-status");
  if (lm && msg) lm.textContent = msg;
  if (ls) setTimeout(() => ls.classList.add("hidden"), 300);
}
function showApp() {
  const appEl = document.getElementById("app");
  if (appEl) appEl.classList.remove("hidden");
}
const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number.isFinite(n) ? n : 0
  );

// Charts (Chart.js is loaded by index.html)
let pnlChartInstance = null;
let outcomesChartInstance = null;

// Firestore collection ref
const tradesRef = collection(db, "trades");

// Boot sequence
showLoading("Starting… authenticating…");

// Anonymous auth
signInAnonymously(auth).catch((e) => {
  console.error("Auth failed:", e);
  showLoading(`Auth error: ${e.code || e.message}`);
});

// After auth, start app
onAuthStateChanged(auth, (user) => {
  if (!user) return;
  const authStatus = document.getElementById("auth-status");
  if (authStatus) authStatus.textContent = `Signed in (anon): ${user.uid.slice(0, 8)}…`;
  hideLoading("Connected");
  showApp();
  wireForm();
  watchTrades();
});

// Listen to trades (realtime)
function watchTrades() {
  const tradeList = document.getElementById("trade-list");
  const noTradesMsg = document.getElementById("no-trades-message");

  onSnapshot(
    tradesRef,
    (snapshot) => {
      const trades = [];
      snapshot.forEach((docSnap) => {
        trades.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Sort newest first for the table
      trades.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));

      // Build table rows
      if (tradeList) tradeList.innerHTML = "";
      if (!trades.length) {
        if (noTradesMsg) noTradesMsg.classList.remove("hidden");
      } else {
        if (noTradesMsg) noTradesMsg.classList.add("hidden");
        trades.forEach((t) => {
          const pnlClass = Number(t.pnl) >= 0 ? "text-green-600" : "text-red-600";
          const row = `
            <tr>
              <td class="px-3 py-3">${t.entryDate || ""}</td>
              <td class="px-3 py-3 font-medium text-indigo-600">${(t.symbol || "").toUpperCase()}</td>
              <td class="px-3 py-3 text-right">${fmt(t.entryPrice)}</td>
              <td class="px-3 py-3 text-right">${fmt(t.exitPrice)}</td>
              <td class="px-3 py-3 text-right">${t.size || 0}</td>
              <td class="px-3 py-3 text-right ${pnlClass} font-semibold">${fmt(t.pnl)}</td>
              <td class="px-3 py-3 text-right">
                <button class="text-red-600 hover:text-red-800 delete-btn" data-id="${t.id}">Delete</button>
              </td>
            </tr>
          `;
          if (tradeList) tradeList.insertAdjacentHTML("beforeend", row);
        });

        // Attach delete handlers
        document.querySelectorAll(".delete-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            if (id) deleteTrade(id);
          });
        });
      }

      // Update metrics and charts
      updateMetricsAndCharts(trades);
    },
    (err) => {
      console.error("Snapshot error:", err);
      if (tradeList)
        tradeList.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-600">Error loading trades: ${err.message}</td></tr>`;
    }
  );
}

// Update dashboard + charts
function updateMetricsAndCharts(trades) {
  // Compute metrics
  let totalPnl = 0;
  let wins = 0;
  let losses = 0;
  let zeros = 0;

  // For cumulative P&L chart, sort oldest first
  const sortedForChart = [...trades].sort(
    (a, b) => new Date(a.entryDate) - new Date(b.entryDate)
  );

  const labels = [];
  const cumulative = [];
  let running = 0;

  sortedForChart.forEach((t) => {
    const pnl = Number(t.pnl) || 0;
    totalPnl += pnl;
    if (pnl > 0) wins++;
    else if (pnl < 0) losses++;
    else zeros++;

    running += pnl;
    const label = `${t.entryDate || ""} (${(t.symbol || "").toUpperCase()})`;
    labels.push(label);
    cumulative.push(Number(running.toFixed(2)));
  });

  const totalTrades = trades.length;
  const winRate = totalTrades ? (wins / totalTrades) * 100 : 0;
  const avgPnl = totalTrades ? totalPnl / totalTrades : 0;

  // Update cards
  const elTotal = document.getElementById("total-pnl");
  const elWinRate = document.getElementById("win-rate");
  const elTotalTrades = document.getElementById("total-trades");
  const elAvg = document.getElementById("avg-pnl");

  if (elTotal) {
    elTotal.textContent = fmt(totalPnl);
    elTotal.className =
      "text-2xl font-bold mt-1 " + (totalPnl >= 0 ? "text-green-600" : "text-red-600");
  }
  if (elWinRate) elWinRate.textContent = `${winRate.toFixed(1)}%`;
  if (elTotalTrades) elTotalTrades.textContent = String(totalTrades);
  if (elAvg) elAvg.textContent = fmt(avgPnl);

  // Render charts
  renderCharts(labels, cumulative, [wins, losses, zeros]);
}

// Charts rendering
function renderCharts(labels, cumulativeData, outcomes) {
  // Cumulative P&L line
  const pnlCanvas = document.getElementById("pnlChart");
  if (pnlCanvas) {
    const ctx = pnlCanvas.getContext("2d");
    const finalPnl = cumulativeData.length ? cumulativeData[cumulativeData.length - 1] : 0;

    if (pnlChartInstance) {
      pnlChartInstance.data.labels = labels;
      pnlChartInstance.data.datasets[0].data = cumulativeData;
      pnlChartInstance.data.datasets[0].borderColor = finalPnl >= 0 ? "#10b981" : "#ef4444";
      pnlChartInstance.update();
    } else {
      pnlChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Cumulative P&L ($)",
              data: cumulativeData,
              borderColor: finalPnl >= 0 ? "#10b981" : "#ef4444",
              backgroundColor: "rgba(79, 70, 229, 0.1)",
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              pointHoverRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              ticks: {
                callback: (v) =>
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                  }).format(v)
              }
            },
            x: { display: false }
          }
        }
      });
    }
  }

  // Outcomes doughnut
  const outcomesCanvas = document.getElementById("outcomesChart");
  if (outcomesCanvas) {
    const ctx2 = outcomesCanvas.getContext("2d");
    if (outcomesChartInstance) {
      outcomesChartInstance.data.datasets[0].data = outcomes;
      outcomesChartInstance.update();
    } else {
      outcomesChartInstance = new Chart(ctx2, {
        type: "doughnut",
        data: {
          labels: ["Wins", "Losses", "Breakeven"],
          datasets: [
            {
              label: "Trade Count",
              data: outcomes,
              backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
              hoverOffset: 10
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: { legend: { position: "bottom" } }
        }
      });
    }
  }
}

// Form submit → add trade
function wireForm() {
  const form = document.getElementById("add-trade-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("form-message");
    if (msg) msg.textContent = "";

    const symbol = document.getElementById("symbol").value.trim().toUpperCase();
    const entryDate = document.getElementById("entryDate").value;
    const size = parseFloat(document.getElementById("size").value);
    const entryPrice = parseFloat(document.getElementById("entryPrice").value);
    const exitPrice = parseFloat(document.getElementById("exitPrice").value);

    if (!symbol || !entryDate || !Number.isFinite(size) || !Number.isFinite(entryPrice) || !Number.isFinite(exitPrice)) {
      if (msg) msg.textContent = "Please fill all fields with valid numbers.";
      return;
    }

    const pnl = parseFloat(((exitPrice - entryPrice) * size).toFixed(2));
    const data = { symbol, entryDate, size, entryPrice, exitPrice, pnl, timestamp: new Date().toISOString() };

    try {
      await addDoc(tradesRef, data);
      form.reset();
    } catch (err) {
      console.error("Error adding trade:", err);
      if (msg) msg.textContent = `Failed to save trade: ${err.message}`;
    }
  });
}

// Delete trade
async function deleteTrade(id) {
  try {
    await deleteDoc(doc(db, "trades", id));
  } catch (err) {
    alert("Error deleting trade: " + err.message);
  }
}
