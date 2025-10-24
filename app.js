import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, addDoc, deleteDoc, onSnapshot, collection, query, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { firebaseConfig, appId } from "./config.js";

let db, auth, userId;
let pnlChartInstance = null;
let outcomesChartInstance = null;

setLogLevel('Debug');

const showApp = () => {
  document.getElementById('loading-status').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
};

const displayCriticalError = (message) => {
  const loadingStatus = document.getElementById('loading-status');
  const loadingMessage = document.getElementById('loading-message');
  loadingMessage.textContent = `CRITICAL ERROR: ${message}`;
  loadingMessage.classList.remove('text-indigo-600', 'font-semibold');
  loadingMessage.classList.add('text-red-600', 'font-bold');
  loadingStatus.querySelector('.spinner').classList.add('hidden');
  loadingStatus.classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
};

const showModal = (title, body, isConfirmation=false) => {
  const modal = document.getElementById('custom-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalConfirm = document.getElementById('modal-confirm');
  const modalCancel = document.getElementById('modal-cancel');

  modalTitle.textContent = title;
  modalBody.textContent = body;
  modalCancel.classList.toggle('hidden', !isConfirmation);
  modalConfirm.textContent = isConfirmation ? 'Confirm' : 'OK';
  modalConfirm.classList.remove('bg-red-600','hover:bg-red-700','bg-indigo-600','hover:bg-indigo-700');
  modalConfirm.classList.add(isConfirmation ? 'bg-red-600':'bg-indigo-600', isConfirmation ? 'hover:bg-red-700':'hover:bg-indigo-700');

  modal.classList.remove('hidden'); modal.classList.add('flex');

  return new Promise(resolve=>{
    const handleConfirm = ()=>{ modal.classList.add('hidden'); modal.classList.remove('flex'); resolve(true); cleanup(); };
    const handleCancel = ()=>{ modal.classList.add('hidden'); modal.classList.remove('flex'); resolve(false); cleanup(); };
    const cleanup = ()=>{ modalConfirm.removeEventListener('click', handleConfirm); modalCancel.removeEventListener('click', handleCancel); };
    modalConfirm.addEventListener('click', handleConfirm);
    modalCancel.addEventListener('click', handleCancel);
    if(!isConfirmation){ modalCancel.classList.add('hidden'); }
  });
};

const formatCurrency = (v)=> new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);

const initializeFirebase = async () => {
  try{
    if(!firebaseConfig || !firebaseConfig.projectId) throw new Error("Firebase configuration is missing. Edit js/config.js");
    document.getElementById('loading-message').textContent = 'Connecting to database...';

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    document.getElementById('loading-message').textContent = 'Authenticating user...';
    await signInAnonymously(auth);

    userId = auth.currentUser?.uid;
    document.getElementById('auth-status').innerHTML = `User ID: <span class="font-mono text-xs">${userId}</span>`;

    showApp();
    listenForTrades();
  }catch(error){
    console.error("Init/sign-in error:", error);
    displayCriticalError(`Failed to initialize. ${error.message}`);
  }
};

const getTradeCollectionRef = ()=> collection(db, 'artifacts', appId, 'users', userId, 'trading_journal');

const calculateData = (trades)=>{
  let totalPnl=0, wins=0, losses=0, breakeven=0;
  const pnlChartLabels=[], pnlChartData=[];
  const sorted = trades.sort((a,b)=>{
    const da = new Date(a.entryDate).getTime(), dbb = new Date(b.entryDate).getTime();
    if(da!==dbb) return da - dbb;
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
  sorted.forEach(t=>{
    totalPnl += t.pnl;
    if(t.pnl>0) wins++; else if(t.pnl<0) losses++; else breakeven++;
    pnlChartLabels.push(`${t.entryDate} (${t.symbol})`);
    pnlChartData.push(parseFloat(totalPnl.toFixed(2)));
  });
  const totalTrades = trades.length;
  const winRate = totalTrades>0 ? (wins/totalTrades)*100 : 0;
  const avgPnl = totalTrades>0 ? totalPnl/totalTrades : 0;
  return { totalPnl, totalTrades, winRate, avgPnl, outcomes:[wins,losses,breakeven], pnlChart:{labels:pnlChartLabels, data:pnlChartData} };
};

const renderData = (trades)=>{
  const tradeListBody = document.getElementById('trade-list');
  const noTradesMessage = document.getElementById('no-trades-message');
  const { totalPnl, totalTrades, winRate, avgPnl, pnlChart, outcomes } = calculateData(trades);

  const totalPnlEl = document.getElementById('total-pnl');
  totalPnlEl.textContent = formatCurrency(totalPnl);
  totalPnlEl.className = `text-2xl font-bold mt-1 ${totalPnl>=0?'text-green-600':'text-red-600'}`;
  document.getElementById('win-rate').textContent = `${winRate.toFixed(1)}%`;
  document.getElementById('total-trades').textContent = totalTrades.toString();
  document.getElementById('avg-pnl').textContent = formatCurrency(avgPnl);

  tradeListBody.innerHTML = '';
  if(totalTrades===0){
    noTradesMessage.classList.remove('hidden');
  }else{
    noTradesMessage.classList.add('hidden');
    const sortedForTable = trades.sort((a,b)=> new Date(b.entryDate) - new Date(a.entryDate));
    sortedForTable.forEach(trade=>{
      const row = document.createElement('tr');
      const pnlClass = trade.pnl>=0 ? 'text-green-600' : 'text-red-600';
      const pnlText = formatCurrency(trade.pnl);
      row.innerHTML = `
        <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900">${trade.entryDate}</td>
        <td class="px-3 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">${trade.symbol.toUpperCase()}</td>
        <td class="px-3 py-3 whitespace-nowrap text-sm text-right">${formatCurrency(trade.entryPrice)}</td>
        <td class="px-3 py-3 whitespace-nowrap text-sm text-right">${formatCurrency(trade.exitPrice)}</td>
        <td class="px-3 py-3 whitespace-nowrap text-sm text-right">${trade.size}</td>
        <td class="px-3 py-3 whitespace-nowrap text-sm font-semibold text-right ${pnlClass}">${pnlText}</td>
        <td class="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
          <button data-id="${trade.id}" class="delete-btn text-red-600 hover:text-red-900 transition">Delete</button>
        </td>`;
      tradeListBody.appendChild(row);
    });
    document.querySelectorAll('.delete-btn').forEach(btn=> btn.addEventListener('click', (e)=> deleteTrade(e.target.dataset.id)));
  }

  renderCharts(pnlChart, outcomes);
};

const renderCharts = (pnlData, outcomes)=>{
  const colors = { indigo:'#4f46e5', green:'#10b981', red:'#ef4444', yellow:'#f59e0b' };

  const pnlCtx = document.getElementById('pnlChart').getContext('2d');
  const finalPnl = pnlData.data.length>0 ? pnlData.data[pnlData.data.length-1] : 0;
  if(pnlChartInstance){
    pnlChartInstance.data.labels = pnlData.labels;
    pnlChartInstance.data.datasets[0].data = pnlData.data;
    pnlChartInstance.data.datasets[0].borderColor = finalPnl>=0?colors.green:colors.red;
    pnlChartInstance.update();
  }else{
    pnlChartInstance = new Chart(pnlCtx, {
      type:'line',
      data:{ labels:pnlData.labels, datasets:[{ label:'Cumulative P&L ($)', data:pnlData.data, borderColor: finalPnl>=0?colors.green:colors.red, backgroundColor:'rgba(79,70,229,0.1)', fill:true, tension:0.3, pointRadius:4, pointHoverRadius:6 }]},
      options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:false, title:{display:true,text:'P&L ($)'}, ticks:{ callback:(v)=>formatCurrency(v) } }, x:{ display:false, title:{display:true,text:'Trades'} }}, plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:(ctx)=>`P&L: ${formatCurrency(ctx.parsed.y)}` } } } }
    });
  }

  const outcomesCtx = document.getElementById('outcomesChart').getContext('2d');
  if(outcomesChartInstance){
    outcomesChartInstance.data.datasets[0].data = outcomes;
    outcomesChartInstance.update();
  }else{
    outcomesChartInstance = new Chart(outcomesCtx, {
      type:'doughnut',
      data:{ labels:['Wins','Losses','Breakeven'], datasets:[{ label:'Trade Count', data:outcomes, backgroundColor:[colors.green, colors.red, colors.yellow], hoverOffset:10 }]},
      options:{ responsive:true, maintainAspectRatio:false, cutout:'75%', plugins:{ legend:{ position:'bottom' }, tooltip:{ callbacks:{ label:(ctx)=>{ const count = ctx.parsed; const total = outcomes.reduce((a,b)=>a+b,0); const pct = total>0?((count/total)*100).toFixed(1):0; return `${ctx.label}: ${count} (${pct}%)`; } } } } }
    });
  }
};

const listenForTrades = ()=>{
  const colRef = getTradeCollectionRef();
  onSnapshot(query(colRef), (snapshot)=>{
    const trades = snapshot.docs.map(d=> ({ id:d.id, ...d.data() }));
    renderData(trades);
  }, (error)=>{
    console.error("Snapshot error:", error);
    document.getElementById('trade-list').innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Error loading trades: ${error.message}</td></tr>`;
  });
};

const addTrade = async (e)=>{
  e.preventDefault();
  const formMsg = document.getElementById('form-message'); formMsg.textContent='';
  const colRef = getTradeCollectionRef();

  const symbol = document.getElementById('symbol').value.trim().toUpperCase();
  const entryDate = document.getElementById('entryDate').value;
  const size = parseFloat(document.getElementById('size').value);
  const entryPrice = parseFloat(document.getElementById('entryPrice').value);
  const exitPrice = parseFloat(document.getElementById('exitPrice').value);
  if(isNaN(size) || isNaN(entryPrice) || isNaN(exitPrice) || size<=0){
    formMsg.textContent = 'Please enter valid numerical values.'; return;
  }
  const pnl = (exitPrice - entryPrice) * size;
  const tradeData = { symbol, entryDate, size, entryPrice, exitPrice, pnl: parseFloat(pnl.toFixed(2)), timestamp: new Date().toISOString() };
  try{
    await addDoc(colRef, tradeData);
    document.getElementById('add-trade-form').reset();
  }catch(error){
    console.error("Add error:", error);
    formMsg.textContent = `Failed to save trade: ${error.message}`;
    showModal('Save Error', `Could not save trade: ${error.message}`, false);
  }
};

const deleteTrade = async (id)=>{
  const ok = await showModal('Confirm Delete', 'Are you sure you want to permanently delete this trade record?', true);
  if(!ok) return;
  try{
    const colRef = getTradeCollectionRef();
    const ref = doc(colRef, id);
    await deleteDoc(ref);
  }catch(error){
    console.error("Delete error:", error);
    showModal('Deletion Error', `Failed to delete trade: ${error.message}`, false);
  }
};

window.addEventListener('load', initializeFirebase);
document.getElementById('add-trade-form').addEventListener('submit', addTrade);
