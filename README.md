# Trading Journal (GitHub Pages + Firebase)

Mobile-friendly Trading Journal UI with:
- Anonymous login
- Firestore storage
- Real-time charts (Chart.js)
- Tailwind CSS

## 1) Put your Firebase config
Edit `js/config.js` and paste the exact `firebaseConfig` from Firebase Console > Project settings > Your apps (Web).

**Auth > Settings > Authorized domains**: add
- `github.io`
- `<your-username>.github.io`

## 2) Firestore Rules
In Firebase Console > Firestore > Rules, paste `firestore.rules` contents and **Publish**.

## 3) Deploy to GitHub Pages
- Create a new GitHub repo (e.g., `trading-journal`)
- Upload all files (index.html, js/*, firestore.rules, README.md)
- Repo **Settings > Pages** → Source: *Deploy from a branch* → Branch: *main* (root)
- Your site: `https://<username>.github.io/trading-journal/`
