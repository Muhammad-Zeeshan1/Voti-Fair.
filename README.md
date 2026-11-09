# Votify — Grand Operation 🗳️⚡

**Opinion Arena** — a full social PWA in a single `index.html`: picture battles, XP & levels, weekly arena, profiles, World Chatter (live Firebase chat), Diamond Rooms, Quiz Arena, XP Shop, Mini Games, Screen Share and a generative QR studio (QRXEL). No build step, no framework, no install required.

> **Roman Urdu:** Ye ek single-file social app hai. Zip ko unzip karein, sab files ek repo me daal kar GitHub Pages par publish karein — pehli visit ke baad app offline bhi chalegi aur "Install" ho sakti hai.

---

## ✨ Features

- **Opinion Battles** — create battles, vote on two sides, XP rewards, streaks, levels
- **Weekly Arena** — leaderboard resets with weekly XP (`weeklyxp` in Firebase)
- **World Chatter** — realtime global chat + DMs, synced through Firebase Realtime Database, 7-day retention in Diamond Rooms
- **Diamond Rooms** — private rooms with themes, music, gifts and moderation tools
- **Profiles & Gifts** — avatars, frames, badges, wallpapers (admin Gift Studio)
- **Quiz Arena, XP Shop, Mini Games, Diary, Status/Phub, Screen Share**
- **QRXEL — Generative QR Studio** — 100% local QR codes (text / URL / Wi-Fi / contact / crypto …)
- **PWA** — installable on Android/iOS/desktop, offline mode via `sw.js`
- **100+ live admin controls**, moderation center, optional AI Judge (bring your own OpenAI-compatible key, stored on-device only)

## 📁 Repository layout

```
votify-grand-operation/
├── index.html          # The entire app (self-contained, payloads are gzip+base64 embedded)
├── manifest.json       # PWA manifest (name, icons, theme colors)
├── sw.js               # Service worker — offline app-shell cache
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-maskable-512.png
├── LICENSE             # MIT
└── README.md
```

## 🚀 Run locally

Any static server works — just don't open `index.html` with `file://` (the service worker needs `http(s)`):

```bash
cd votify-grand-operation
python3 -m http.server 8080
# open http://localhost:8080
```

## 🌐 Publish on GitHub Pages

1. Create a repository and upload **all files** from this folder (keep `index.html` at the repo root).
2. Repo → **Settings → Pages → Source: Deploy from a branch** → branch `main`, folder `/ (root)` → Save.
3. Your app goes live at `https://<username>.github.io/<repo>/` within a minute or two.

Notes:

- `sw.js` and `manifest.json` are referenced with **relative paths** (`./sw.js`), so they work both at `username.github.io/<repo>/` and on a custom domain root.
- After changing `index.html`, bump `CACHE_VERSION` at the top of `sw.js` (e.g. `votify-v1.0.1`) so installed clients get the update.

## 🔧 Technical notes

- **Self-extracting payloads** — most of the app lives inside `index.html` as base64 + raw-DEFLATE blocks (`<script type="text/vfy-gz">`), inflated at runtime by a tiny inflater in `<head>`. That keeps the file small; you don't need to touch those blocks.
- **Service worker strategy** — page navigations are *network-first* with an offline fallback to the cached shell; same-origin assets are *stale-while-revalidate*; cross-origin traffic (Firebase, IP API) is never intercepted.

## ⚠️ Security checklist (please read before going public)

- The Firebase web config inside the app (apiKey / databaseURL) is **public by design** — it is not a secret. What matters is your **Realtime Database rules**. In the Firebase console, restrict `users/`, `accounts/`, `rooms/`, `wc/` etc. with proper read/write rules instead of leaving the database fully open.
- Account passwords are stored hashed, but the legacy record also keeps a reversibly encrypted copy (`pw:` field) for account recovery. For a serious deployment, consider removing that field server-side.
- The optional **AI Judge** key (`V3 → AI Settings`) is stored in `localStorage` on the user's device and called directly from the browser. Use a low-limit / restricted key, or proxy it through a small serverless function.

## 📄 License

Released under the [MIT License](LICENSE).
