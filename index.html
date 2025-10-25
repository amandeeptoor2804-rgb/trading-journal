<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>Trading Performance Journal</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
  <link rel="manifest" href="manifest.json" />
  <meta name="theme-color" content="#4f46e5" />

  <style>
    #trade-list-container { -webkit-overflow-scrolling: touch; }
    .spinner { border-top-color:#4f46e5 }
    .subtle { font-size:11px; color:#6b7280 }
  </style>
</head>
<body class="bg-gray-50 text-gray-800 min-h-screen p-4 md:p-8">

  <!-- Loading -->
  <div id="loading" class="fixed inset-0 hidden items-center justify-center bg-gray-50 z-50">
    <div class="text-center p-8 bg-white shadow-xl rounded-xl">
      <div class="spinner animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-gray-200 mx-auto mb-4"></div>
      <p id="loading-msg" class="text-indigo-600 font-semibold">Loading...</p>
    </div>
  </div>

  <!-- Login -->
  <div id="login" class="max-w-sm mx-auto mt-16 bg-white shadow-xl rounded-xl p-6">
    <h1 class="text-2xl font-bold text-indigo-700 mb-2">Trading Journal Login</h1>
    <p class="text-sm text-gray-500 mb-4">Secure access</p>
    <form id="login-form" class="space-y-3">
      <input id="email" type="email" placeholder="Email" class="w-full p-3 border rounded-lg" required />
      <input id="password" type="password" placeholder="Password" class="w-full p-3 border rounded-lg" required />
      <button class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg">Log in</button>
    </form>
    <p id="login-msg" class="text-sm text-red-600 mt-3"></p>
  </div>

  <!-- App -->
  <div id="app" class="max-w-7xl mx-auto hidden">

    <!-- Header -->
    <header class="mb-6 p-4 bg-white shadow-lg rounded-xl flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-indigo-700 mb-1">Trading Performance Journal</h1>
        <p class="text-sm text-gray-500">Multi-currency totals with live charts</p>
        <p id="auth-status" class="text-xs mt-2 text-indigo-400"></p>
      </div>
      <button id="logout" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Log out</button>
    </header>

    <!-- Settings (Base currency + FX) -->
    <section class="mb-6 p-4 bg-white rounded-xl shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="subtle block mb-1">Base currency (for KPIs & charts)</label>
          <select id="baseCurrency" class="p-3 border rounded-lg w-full">
            <option value="USD" selected>USD</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
        <div>
          <label class="subtle block mb-1">FX (1 CAD → USD)</label>
          <input id="fxCadUsd" type="number" step="0.0001" value="0.73" class="p-3 border rounded-lg w-full" />
          <p class="subtle mt-1">Reverse is computed automatically.</p>
        </div>
        <div>
          <button id="applySettings" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg">
            Apply settings
          </button>
        </div>
      </div>
    </section>

    <!-- KPI cards -->
    <div class="grid grid-cols-2 md:grid-cols-8 gap-4 mb-8">
      <div class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-indigo-500">
        <p class="subtle uppercase">Total P&L (<span id="kpi-cur-1">USD</span>)</p>
        <p id="total-pnl" class="text-2xl font-bold mt-1">$0.00</p>
        <p id="total-pnl-break" class="subtle mt-1"></p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500">
        <p class="subtle uppercase">Win Rate</p>
        <p id="win-rate" class="text-2xl font-bold mt-1">0%</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-yellow-500">
        <p class="subtle uppercase">Total Trades</p>
        <p id="total-trades" class="text-2xl font-bold mt-1">0</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-red-500">
        <p class="subtle uppercase">Average P&L (<span id="kpi-cur-2">USD</span>)</p>
        <p id="avg-pnl" class="text-2xl font-bold mt-1">$0.00</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-indigo-600">
        <p class="subtle uppercase">Last 14 Days (<span id="kpi-cur-3">USD</span>)</p>
        <p id="pnl-14d" class="text-2xl font-bold mt-1">$0.00</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-amber-500">
        <p class="subtle uppercase">Total Deposited (<span id="kpi-cur-4">USD</span>)</p>
        <p id="total-deposited" class="text-2xl font-bold mt-1">$0.00</p>
        <p id="total-deposited-break" class="subtle mt-1"></p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-emerald-500">
        <p class="subtle uppercase">Total Profit (<span id="kpi-cur-5">USD</span>)</p>
        <p id="total-profit" class="text-2xl font-bold mt-1 text-green-600">$0.00</p>
        <p id="total-profit-break" class="subtle mt-1"></p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-lg border-l-4 border-rose-500">
        <p class="subtle uppercase">Total Loss (<span id="kpi-cur-6">USD</span>)</p>
        <p id="total-loss" class="text-2xl font-bold mt-1 text-red-600">$0.00</p>
        <p id="total-loss-break" class="subtle mt-1"></p>
      </div>
    </div>

    <!-- Charts -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
        <h2 class="text-lg font-semibold text-indigo-600 mb-4">Cumulative P&L (in base currency)</h2>
        <div class="relative h-64 md:h-96"><canvas id="pnlChart"></canvas></div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-lg">
        <h2 class="text-lg font-semibold text-indigo-600 mb-4">Trade Outcomes</h2>
        <div class="relative h-64"><canvas id="outcomesChart"></canvas></div>
      </div>
    </section>

    <!-- Add Entry -->
    <section class="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 class="text-lg font-semibold text-indigo-600 mb-4">Log New Entry</h2>
      <form id="add-form" class="grid grid-cols-2 md:grid-cols-9 gap-4">
        <select id="type" class="p-3 border rounded-lg">
          <option>Trade</option><option>Deposit</option>
        </select>
        <select id="assetType" class="p-3 border rounded-lg">
          <option>Stock</option><option>Crypto</option><option>Forex</option>
        </select>
        <select id="currency" class="p-3 border rounded-lg">
          <option>USD</option><option>CAD</option>
        </select>
        <input id="symbol" placeholder="Symbol" class="p-3 border rounded-lg" />
        <input id="entryDate" type="date" class="p-3 border rounded-lg" />
        <input id="size" type="number" placeholder="Size" class="p-3 border rounded-lg" />
        <input id="entryPrice" type="number" step="0.01" placeholder="Entry / Amount" class="p-3 border rounded-lg" />
        <input id="exitPrice" type="number" step="0.01" placeholder="Exit (for trades)" class="p-3 border rounded-lg" />
        <select id="action" class="p-3 border rounded-lg">
          <option>Long</option><option>Short</option><option>Call</option><option>Put</option>
        </select>
        <button class="bg-indigo-600 text-white rounded-lg font-bold py-3 col-span-2 md:col-span-1">Add</button>
      </form>
      <div id="form-msg" class="text-red-600 text-xs mt-2"></div>
    </section>

    <!-- History -->
    <section class="bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-lg font-semibold text-indigo-600 mb-4">Transaction History</h2>
      <div id="trade-list-container" class="overflow-x-auto max-h-[420px]">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left">Date</th>
              <th class="px-3 py-2 text-left">Type</th>
              <th class="px-3 py-2 text-left">Asset</th>
              <th class="px-3 py-2 text-left">Class</th>
              <th class="px-3 py-2 text-left">Cur</th>
              <th class="px-3 py-2 text-right">Entry</th>
              <th class="px-3 py-2 text-right">Exit</th>
              <th class="px-3 py-2 text-right">Size</th>
              <th class="px-3 py-2 text-left">Action</th>
              <th class="px-3 py-2 text-right">P&L</th>
              <th class="px-3 py-2 text-right">P&L %</th>
              <th class="px-3 py-2 text-right">Cum P&L (base)</th>
              <th class="px-3 py-2 text-left">Result</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="trade-list"></tbody>
        </table>
      </div>
      <div id="empty" class="text-center py-6 text-gray-500 hidden">No entries yet</div>
    </section>
  </div>

  <!-- SCRIPT -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
    import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
    import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

    // --- YOUR CONFIG ---
    const ALLOWED_EMAIL = "kaur.2804amandeep@gmail.com";
    const firebaseConfig = {
      apiKey: "AIzaSyB5rvkKPst6V9-7HoqK1f27jQj6x7f8LiA",
      authDomain: "trading-journal-da4eb.firebaseapp.com",
      projectId: "trading-journal-da4eb",
      storageBucket: "trading-journal-da4eb.appspot.com",
      messagingSenderId: "50906470929",
      appId: "1:50906470929:web:b9ad784e9ae86c06d42fb0"
    };

    // --- Init ---
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db   = getFirestore(app);

    const $ = id => document.getElementById(id);
    const show = el => el.classList.remove("hidden");
    const hide = el => el.classList.add("hidden");

    const money = (n, cur="USD") => {
      try { return new Intl.NumberFormat("en-US",{style:"currency",currency:cur}).format(Number(n)||0); }
      catch { return (Number(n)||0).toFixed(2) + " " + cur; }
    };
    const todayISO = () => {
      const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    };

    function setLoading(msg){ $("loading-msg").textContent=msg; $("loading").classList.remove("hidden"); }
    function clearLoading(){ $("loading").classList.add("hidden"); }

    // Persist settings locally
    const settings = {
      base: localStorage.getItem("baseCurrency") || "USD",
      fxCadUsd: Number(localStorage.getItem("fxCadUsd") || "0.73")
    };
    $("baseCurrency").value = settings.base;
    $("fxCadUsd").value = String(settings.fxCadUsd);

    // Helper: convert any amount to base currency
    function toBase(amount, cur){
      if(cur === settings.base) return amount;
      if(cur === "CAD" && settings.base === "USD") return amount * settings.fxCadUsd;
      if(cur === "USD" && settings.base === "CAD") return amount / (settings.fxCadUsd || 1);
      return amount; // fallback same
    }

    function labelBaseKpis(){
      ["kpi-cur-1","kpi-cur-2","kpi-cur-3","kpi-cur-4","kpi-cur-5","kpi-cur-6"].forEach(id => $(id).textContent = settings.base);
    }
    labelBaseKpis();

    $("applySettings").onclick = () => {
      settings.base   = $("baseCurrency").value;
      settings.fxCadUsd = Number($("fxCadUsd").value || "0.73");
      localStorage.setItem("baseCurrency", settings.base);
      localStorage.setItem("fxCadUsd", String(settings.fxCadUsd));
      labelBaseKpis();
      if(window.__lastList) render(window.__lastList); // re-render using new base
    };

    // Auth
    setLoading("Checking session...");
    $("login-form").addEventListener("submit", async (e)=>{
      e.preventDefault(); $("login-msg").textContent="";
      try{
        const cred = await signInWithEmailAndPassword(auth, $("email").value.trim(), $("password").value.trim());
        if(cred.user.email !== ALLOWED_EMAIL){ $("login-msg").textContent="Not authorized"; await signOut(auth); }
      }catch(err){ $("login-msg").textContent = "Firebase: " + (err.message || err.code); }
    });
    $("logout").onclick = ()=>signOut(auth);

    onAuthStateChanged(auth, (user)=>{
      clearLoading();
      if(user && user.email === ALLOWED_EMAIL){
        $("auth-status").textContent = "Signed in as: "+user.email;
        hide($("login")); show($("app")); boot(user.uid);
      }else{ show($("login")); hide($("app")); }
    });

    // Data
    let unsub=null;
    function boot(uid){
      if(unsub) unsub();
      const ref = collection(db, "trades");
      const q = query(ref, where("ownerUid","==",uid));

      $("add-form").onsubmit = async (e)=>{
        e.preventDefault(); $("form-msg").textContent="";
        const type = $("type").value;
        const assetType = $("assetType").value;
        const currency = $("currency").value; // NEW
        const symbol = ($("symbol").value||"").toUpperCase();
        const entryDate = $("entryDate").value || todayISO();
        const size  = +$("size").value || 0;
        const entry = +$("entryPrice").value || 0;
        const exit  = +$("exitPrice").value || 0;
        const action = $("action").value;

        if(type==="Trade" && (!symbol || size<=0)){ $("form-msg").textContent="Invalid trade"; return; }
        if(type==="Deposit" && entry<=0){ $("form-msg").textContent="Invalid deposit"; return; }

        let pnl=0, pct=0;
        if(type==="Trade"){
          const dir=(action==="Short"||action==="Put")?-1:1;
          pnl=(exit-entry)*size*dir;
          pct=entry>0?(pnl/(entry*size))*100:0;
        }

        try{
          await addDoc(ref,{
            ownerUid:uid, type, assetType, currency, action, symbol,
            entryDate, size, entryPrice:entry, exitPrice:exit,
            pnl:+pnl.toFixed(2), pnlPct:+pct.toFixed(2),
            timestamp:new Date().toISOString()
          });
          e.target.reset();
        }catch(err){ $("form-msg").textContent="Error: "+(err.message||err); }
      };

      unsub = onSnapshot(q, snap=>{
        const list=[]; snap.forEach(d=>list.push({id:d.id,...d.data()}));
        const sorted = list.sort((a,b)=>new Date(a.entryDate)-new Date(b.entryDate));
        window.__lastList = sorted;
        render(sorted);
      });
    }

    window.delTrade = async(id)=>{ try{ await deleteDoc(doc(db,"trades",id)); }catch(e){ alert(e.message);} };

    // Charts + table + aggregates
    let pnlChart=null, outcomesChart=null;

    function render(list){
      const body=$("trade-list"); body.innerHTML="";
      const empty=$("empty");

      if(!list.length){
        show(empty);
        ["total-pnl","win-rate","total-trades","avg-pnl","pnl-14d","total-deposited","total-profit","total-loss"]
          .forEach(id=>$(id).textContent = id==="win-rate" ? "0%" : money(0, settings.base));
        ["total-pnl-break","total-deposited-break","total-profit-break","total-loss-break"].forEach(id=>$(id).textContent="");
        if(pnlChart){ pnlChart.data.labels=[]; pnlChart.data.datasets[0].data=[]; pnlChart.update(); }
        if(outcomesChart){ outcomesChart.data.datasets[0].data=[0,0,0]; outcomesChart.update(); }
        return;
      }
      hide(empty);

      // per-currency buckets
      const sums = {
        deposit: { USD:0, CAD:0 },
        profit:  { USD:0, CAD:0 },
        loss:    { USD:0, CAD:0 },
        pnl:     { USD:0, CAD:0 }, // trades only
        last14:  { USD:0, CAD:0 }
      };

      // For cumulative in base currency
      let cumBase = 0;
      const cutISO=new Date(Date.now()-14*864e5).toISOString().split("T")[0];

      // pre-pass to compute aggregates
      let wins=0, losses=0, evens=0;

      list.forEach(t=>{
        const cur = t.currency || "USD";

        if(t.type === "Deposit"){
          sums.deposit[cur] += (t.entryPrice||0);
        }

        if(t.type === "Trade"){
          const pnl = t.pnl || 0;
          sums.pnl[cur] += pnl;
          if(pnl>0) sums.profit[cur] += pnl;
          if(pnl<0) sums.loss[cur]   += Math.abs(pnl);
          if(pnl>0) wins++; else if(pnl<0) losses++; else evens++;
          if(t.entryDate >= cutISO) sums.last14[cur] += pnl;
        }
      });

      // rows (show cumulative in base currency)
      list.forEach(t=>{
        const cls=(t.pnl||0)>=0?"text-green-600":"text-red-600";
        const result = t.type!=="Trade" ? "-" : t.pnl>0?"Win":t.pnl<0?"Loss":"Breakeven";
        if(t.type==="Trade") cumBase += toBase(t.pnl||0, t.currency||"USD");

        body.insertAdjacentHTML("beforeend",`
          <tr class="hover:bg-gray-50">
            <td class="px-3 py-2">${t.entryDate}</td>
            <td class="px-3 py-2">${t.type}</td>
            <td class="px-3 py-2 font-semibold text-indigo-600">${t.symbol||"-"}</td>
            <td class="px-3 py-2">${t.assetType||"-"}</td>
            <td class="px-3 py-2">${t.currency||"USD"}</td>
            <td class="px-3 py-2 text-right">${money(t.entryPrice, t.currency||"USD")}</td>
            <td class="px-3 py-2 text-right">${money(t.exitPrice,  t.currency||"USD")}</td>
            <td class="px-3 py-2 text-right">${t.size||0}</td>
            <td class="px-3 py-2">${t.action||"-"}</td>
            <td class="px-3 py-2 text-right ${cls} font-semibold">${t.type==="Trade"?money(t.pnl, t.currency||"USD"):"-"}</td>
            <td class="px-3 py-2 text-right ${cls}">${t.type==="Trade"?(t.pnlPct||0).toFixed(2)+"%":"-"}</td>
            <td class="px-3 py-2 text-right">${t.type==="Trade"?money(cumBase, settings.base):"-"}</td>
            <td class="px-3 py-2">${t.type==="Trade"?result:"-"}</td>
            <td class="px-3 py-2 text-right"><button class="text-red-600" onclick="delTrade('${t.id}')">✕</button></td>
          </tr>
        `);
      });

      // totals in base currency
      const totalDepositedBase = toBase(sums.deposit.USD,"USD") + toBase(sums.deposit.CAD,"CAD");
      const totalProfitBase    = toBase(sums.profit.USD,"USD")  + toBase(sums.profit.CAD,"CAD");
      const totalLossBase      = toBase(sums.loss.USD,"USD")    + toBase(sums.loss.CAD,"CAD");
      const totalPnlBase       = toBase(sums.pnl.USD,"USD")     + toBase(sums.pnl.CAD,"CAD");
      const last14Base         = toBase(sums.last14.USD,"USD")  + toBase(sums.last14.CAD,"CAD");

      const trades = list.filter(x=>x.type==="Trade");
      const wr = trades.length ? (wins/trades.length)*100 : 0;

      // KPIs
      $("pnl-14d").textContent      = money(last14Base, settings.base);
      $("win-rate").textContent     = wr.toFixed(1)+"%";
      $("total-trades").textContent = String(trades.length);
      $("total-pnl").textContent    = money(totalPnlBase, settings.base);
      $("total-pnl").className      = "text-2xl font-bold mt-1 " + (totalPnlBase>=0?"text-green-600":"text-red-600");
      $("avg-pnl").textContent      = money(trades.length ? totalPnlBase / trades.length : 0, settings.base);

      $("total-deposited").textContent = money(totalDepositedBase, settings.base);
      $("total-profit").textContent    = money(totalProfitBase, settings.base);
      $("total-loss").textContent      = money(totalLossBase, settings.base);

      // per-currency breakdowns
      $("total-pnl-break").textContent =
        `USD ${money(sums.pnl.USD,"USD")} · CAD ${money(sums.pnl.CAD,"CAD")}`;
      $("total-deposited-break").textContent =
        `USD ${money(sums.deposit.USD,"USD")} · CAD ${money(sums.deposit.CAD,"CAD")}`;
      $("total-profit-break").textContent =
        `USD ${money(sums.profit.USD,"USD")} · CAD ${money(sums.profit.CAD,"CAD")}`;
      $("total-loss-break").textContent =
        `USD ${money(sums.loss.USD,"USD")} · CAD ${money(sums.loss.CAD,"CAD")}`;

      // Charts (trades only, in base currency)
      const labels = trades.map(t => `${t.entryDate} ${t.symbol||""}`.trim());
      let r=0; const cumulative = trades.map(t => r += toBase(t.pnl||0, t.currency||"USD"));
      const w = trades.filter(t=>t.pnl>0).length;
      const l = trades.filter(t=>t.pnl<0).length;
      const z = trades.filter(t=>t.pnl===0).length;

      if(!pnlChart){
        pnlChart = new Chart($("pnlChart"), {
          type:"line",
          data:{ labels, datasets:[{ label:"Cumulative P&L ("+settings.base+")", data:cumulative, borderColor:"#10b981", fill:false }]},
          options:{ responsive:true, maintainAspectRatio:false }
        });
      }else{
        pnlChart.data.labels=labels;
        pnlChart.data.datasets[0].label="Cumulative P&L ("+settings.base+")";
        pnlChart.data.datasets[0].data=cumulative;
        pnlChart.update();
      }

      if(!outcomesChart){
        outcomesChart = new Chart($("outcomesChart"), {
          type:"doughnut",
          data:{ labels:["Win","Loss","Breakeven"], datasets:[{ data:[w,l,z], backgroundColor:["#10b981","#ef4444","#f59e0b"] }]},
          options:{ responsive:true, maintainAspectRatio:false }
        });
      }else{
        outcomesChart.data.datasets[0].data=[w,l,z];
        outcomesChart.update();
      }
    }
  </script>
</body>
</html>
