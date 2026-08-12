# PantryChef static MVP

PantryChef is a mobile-first, offline demo that matches a pantry to a small set of curated dinner recipes. The matching is deliberately simple and honest: a recipe appears only when every ingredient it needs is in the user’s selected pantry.

## Run it

Open `index.html` directly in a browser. There is no install, build step, server, account, API key, or network dependency.

The fastest journey is the **Try the 10-second demo** button. One tap loads a clearly disclosed sample pantry and shows five recipes that use only those ingredients. Alternatively, select pantry items manually and choose **Find exact recipe matches**.

## MVP scope

- Curated local ingredient picker and recipe data
- Client-side exact-subset matching
- One-tap sample scenario
- Responsive layout designed for a 390px viewport and capped at 480px
- Offline operation with no remote fonts, images, analytics, or API calls
- Persistent “MVP demo” and rules-engine disclosure on both picker and results views

This version does **not** analyze photos and does not claim to run AI or a vision model. Photo recognition would require a safe backend or a genuine on-device model and is intentionally outside this static MVP.

## Structure

```text
index.html
css/styles.css
js/app.js
```

All recipe names, ingredient lists, and methods are small original fixtures created for this demo; no external recipe database is represented or implied.
