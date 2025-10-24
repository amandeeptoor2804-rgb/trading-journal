// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const statusEl = document.getElementById("status");
const show = (msg) => {
  console.log(msg);
  if (statusEl) statusEl.textContent = msg;
};

window.addEventListener("error", (e) => {
  show("JS error: " + e.message);
});

try {
  show("Initializing Firebase…");
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Sign in anonymously (required by your rules)
  await signInAnonymously(auth).catch((err) => {
    show("Auth error: " + err.code + " — " + err.message);
    throw err;
  });

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      show("Not signed in.");
      return;
    }
    show("Signed in. Loading trades…");
    try {
      const snap = await getDocs(collection(db, "trades"));
      show(`Loaded ${snap.size} trade(s). If you see ≥1, Firestore is working.`);
    } catch (err) {
      show("Firestore error: " + err.message);
    }
  });
} catch (err) {
  show("Startup error: " + (err?.message || err));
}
