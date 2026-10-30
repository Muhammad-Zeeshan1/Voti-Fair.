# Votify — Opinion Arena (PWA · Real-Time Build v11)

Ye package ek **complete, installable Progressive Web App** hai — real-time messaging ke saath. Kisi bhi static host (Netlify / Vercel / Cloudflare Pages) par deploy karo aur har device par native app ki tarah install ho jayegi — offline bhi chalegi.

**Ye private package hai — is code ko publicly share na karein.**

## Naya is build me (v11 — Privacy Sync + Boot Fix)

- ✅ **🚫 WC AI button sab se hidden** — People tab wala pinned "WC AI" card ab kisi ko nazar nahi aata (koi bhi user, koi bhi device). AI ab sirf `@ai` likhne par reply karta hai — UI me koi AI button nahi
- ✅ **⚡ Purane messages ka boot-flash fix** — app kholte hi purani chat history kuch seconds ke liye flash hoti thi phir gayab ho jati thi. Ab chat view tab tak empty rehta hai jab tak Firebase se pehla live snapshot nahi aata (8 sec tak na aaye to cached history dikhti hai, offline mode me turant). Stale local messages jo server par exist nahi karte wo ab boot par hi purge ho jate hain — flash hamesha ke liye khatam
- ✅ **👥 People ab admin Privacy list se 100% synced** — World Chatter People/DM list me SIRF wo accounts dikhte hain jo superadmin ke Privacy & Accounts me maujood hain (`accounts/` registry, uid + email dono se match). Stale entries (tk26b jaise) jo sirf purane `users/` cache me thin ab kisi ko nahi dikhti
- ✅ **🧹 Privacy sync self-heal (admin)** — Admin Privacy page kholte hi agar `users/` registry me aise accounts milte hain jo Privacy list me nahi, to admin ko ek confirm ke saath unhe remove karne ka option milta hai (users/ + wc/u/ + presence/ + dms/ clean + deleted marker) — sab devices par People list turant theek ho jati hai

## Pichla update (v10 — Dark Fantasy Profiles + Privacy)

- ✅ **🏰 Dark Fantasy Profile Card (naya!)** — World Chatter me kisi ke bhi profile pic/name par click karo aur ek premium game-style profile card khulta hai: golden crown, ornate gold frame, candle-lit dark hall, purple magic glow. Card me REAL stats hain: ⏳ Time Spent, 👍 Total Votes, 📅 Account Created, 🏆 Trophies aur earned Achievements & Badges (OG Member, Legend, Champion…)
- ✅ **🖼️ Profile pic har message ke saath** — message bhejne wale ka profile pic ab dusre users ko live dikhta hai; pic update karo to purane messages me bhi naya pic nazar aata hai
- ✅ **🛡️ Admin ki presence kabhi nahi dikhti** — admin kabhi kisi online/offline list me nahi aata, uska online status kabhi nahi dikhaya jata (DM header sirf "official · protected" dikhata hai)
- ✅ **🤖 AI/Bot online count me nahi** — Online Now count sirf REAL online users ka hai; AI kisi online/offline list me count nahi hota (`@ai` mention se DM kaam karta hai)
- ✅ **👥 People = sirf real existing accounts** — People list ab Firebase `users/` registry se cross-check hoti hai: jo account registered nahi (stale/garbage cache entry) wo list se auto-remove + Firebase se bhi purge; deleted accounts pehle se filtered
- ✅ **DM header avatar clickable** — DM kholo aur header ke avatar par click karke seedha profile card dekho

## Pehle is build me (v9 — Chat Fixes + AI + Force Settings)

- ✅ **🤖 WC AI (v9 me add kiya)** — World Chatter ka apna AI assistant. World chat me `@ai` likho — salam, waqt/date, hisaab, jokes, coin toss, dice, motivation aur free baatein. Replies sab devices par live sync
- ✅ **💬 Clear messages ab sach me kaam karta hai** — Admin → Settings → "Clear ALL chats" ab asli data wipe karta hai (`wc/m` + DMs + typing) aur har device ka local cache bhi (naya epoch system). Pehle galat path clear ho raha tha
- ✅ **🎨 Bubble color fix** — dusre user ka bubble ab hamesha USKA live color dikhata hai (purana frozen color nahi) aur blue bubble ke andar ka text ab white (pehle black tha)
- ✅ **🖼️ Wallpaper sab ke liye** — Admin global wallpaper ab Firebase par sync: naya user ya naya device bhi wahi default wallpaper dekhega
- ✅ **⚡ Force Settings (naya admin category)** — Admin Panel → System → Force Settings: ON karo aur SAB users ke World Chatter pe bubble color, wallpaper (day/night), notification sound force ho jaye — users unhe badal nahi sakenge
- ✅ **🧹 People list sirf existing users** — hamburger (three-line) → People me ab SIRF wo accounts dikhte hain jo abhi exist karte hain (deleted/stale cache accounts auto-clean). Superadmin privacy ke sath fully synced
- ✅ **🗂️ Admin panel shape** — sidebar ab categories me grouped hai: Overview / Community / Engagement / Customize / System
- ✅ **Profile button top navbar se removed** — navbar ab clean hai (search, leaderboard, bell, World Chatter)

## Pehle is build me (v8 — Legendary Themes)

- ✅ **👑 20 Legendary Live Themes (naya!)** — Home page ke **top-right three-dots (⋮)** par tap karo aur poora naya **Legendary Themes screen** khulta hai. 20 ultimate live background themes: 💎 Crystal Cave, 🌌 Aurora Sky, 🌠 Galaxy Drift, 🔥 Ember Storm, 🌊 Moonlit Ocean, ⛰️ Mountain Dusk, 🕹️ Neon Grid, ⚡ Thunder Night, 🌋 Lava Core, 🌅 Golden Sunset, 🫧 Bubbles, ☁️ Clouds, 🌧️ Rainy Mood, ❄️ Snowfall, 🟢 Matrix Code, ✨ Fireflies, 🌸 Sakura, 🧊 Ice Palace, 👑 Royale Gold, 🦄 Rainbow Aura. Tap karte hi theme **live apply** + yaad rehti hai (localStorage). Har theme ULTIMATE/LEGENDARY tier badge ke saath
- ✅ **Performance-safe engine** — sab 16 naye scenes ek hi shared raf engine par chalte hain: DPR-capped canvas, tab hidden = auto-pause, reduced-motion support, resize par scene rebuild. Ek waqt me sirf ek theme active hoti hai
- ✅ **Three-dots cleanup** — tags ke saath wala purana themes button hat gaya; ab sirf top-right (⋮) hi themes screen kholta hai (arrow wala)
- ✅ **Deploy/download tool poori tarah remove** — app ke andar se zip-download/deploy tool aur uska poora module hata diya gaya hai; ab app me se koi bhi source-code download possible nahi hai (privacy)
- ✅ **v7 (pehle se):** Deleted account har jagah se gayab (People + Leaderboard), self-healing scrub, deleted-user auto-logout, admin delete ab `wc/u/<uid>` bhi clean karta hai

## Pehle is build me (v6 — Crystal Theme + wallpaper sync + notification dots)

- ✅ **Advanced Crystal Theme (home background)** — premium crystal shards (facets, specular highlights, glowing edges), light refraction beams aur twinkling sparkles. Pre-rendered sprites se smooth 60fps
- ✅ **Globe shortcut** — top navigation bar me naya globe icon button, ek tap me seedha World Chatter
- ✅ **Message notification dots (People tab)** — jis online user ne aapko message bheja hai uske naam ke saath pink/red pulsing dot + unread count, automatically update hota hai
- ✅ **Global Wallpaper (Admin)** — Admin Panel → Theme Studio se global wallpaper set karo; Firebase (wcAdminCfg) par sync ho kar SAB users ka default ban jata hai
- ✅ **Personal Wallpaper (per account)** — user apna wallpaper chune to sirf uske account par apply hota hai (global par bhaari). Choice localStorage + Firebase (wc/u/<uid>/wp) dono par save
- ✅ **WCAG auto text color (upgraded)** — bubble color ke hisaab se text color khud select hota hai (blue → white, light → dark). rgba()/8-digit hex support, WCAG contrast ratio guaranteed
- ✅ **Home page de-boxed** — bade container panels ke box backgrounds remove; buttons ab free-floating subtle lift ke saath
- ✅ **Admin identity bridge** — main app ka admin chat ka admin panel bina access code ke khol sakta hai

## Pehle se (v4 — admin sync + identity colors + UX pack)

- ✅ **Admin "Clear all messages" ab SAB ke paas turant clear hota hai** — Firebase se messages delete + clear-stamp broadcast, har device live update
- ✅ **Consistent bubble colors** — jis user ne jo bubble color chuna hai, WOHI color dusre users ko bhi nazar aata hai
- ✅ **Auto color sequence** — naya account OB_COLORS palette se agla color automatically milta hai
- ✅ **Smart auto text contrast** — WCAG contrast ratio se decide hota hai (`wcPickText`)
- ✅ **Realtime typing indicator** — "Ali is typing…" live, har room me
- ✅ **Per-room drafts** — likha hua text room switch karne par bhi save rehta hai
- ✅ **Incoming message: soft ping + vibrate + tab title badge** — "(3) Votify" title me unread count
- ✅ **Message text upgrades** — URLs auto-clickable (safe), emoji-only messages bade size me
- ✅ **Image auto-compress** — badi photo (1280px+, JPEG) automatically compress ho kar send hoti hai
- ✅ **Connection pill + scroll-to-bottom FAB + anti double-send**
- ✅ **UX Extras panel** — message sounds on/off, 24-hour clock, icebreakers

## File structure (private package)

| File | Kaam |
|---|---|
| `index.html` | Poora app — single file, koi build step nahi |
| `manifest.webmanifest` | PWA manifest (naam, icons, colors, standalone) |
| `sw.js` | Service worker — offline cache + instant repeat loads (cache `votify-pwa-v12`) |
| `icons/icon-192.png` | Install icon (192×192) |
| `icons/icon-512.png` | Install icon (512×512, maskable) |
| `LICENSE` | App credit — Muhammad Zeeshan |

---

## Host par deploy kaise karein (private)

1. Apna hosting dashboard kholo (Netlify Drop / Vercel / Cloudflare Pages / apna server).
2. Is package ki saari files upload karo (folder structure same rakho — `icons` folder waisa hi).
3. `index.html` ko root par rakho — bas, app live hai.
4. Update ke liye naya `index.html` upload karo aur `sw.js` me cache naam bump karo (`votify-pwa-v12` → `v13`).
5. **iPhone install:** Safari → Share → *Add to Home Screen*. **Android:** browser menu → *Install app*.

---

## Zaroori baatein

- HTTPS wale host par install prompt + service worker seedha chalta hai.
- Firebase config `index.html` ke andar embedded hai (`votify-a664a` project) — sab visitors ka data live shared rehta hai. Apna project lena ho to `VTY_NEW_FIREBASE_CFG` badal do.
- **Ye code private hai** — ise public repo par push na karein, sirf apne devices par deploy karein.

---

- App credit: **Muhammad Zeeshan** — Votify Diamond Opinion Arena
- Realtime build v11 — privacy-synced People + boot flash fix + dark fantasy profile cards + legendary themes (20) + deleted accounts cleanup + admin sync + UX pack
