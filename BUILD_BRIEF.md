# PantryChef — Build Brief

Build a **static, mobile-first web app MVP** for PantryChef. Work inside this
repo only. Do not commit, push, or deploy — the orchestrator handles that.

## Product (from ramp dossier IDEA-001)
**PantryChef** gives home cooks a zero-waste dinner plan by photographing the
food they already have and instantly matching recipes that use ONLY those
ingredients.

- **Hero holy-shit frame:** photo-the-fridge → "5 recipes using ONLY what's in
  the photo." One glance, one tap, zero typing.
- **Selected differentiator:** photo-the-pantry → instant recipes using only
  the photographed ingredients.
- **The `#whatsinmyfridge` creator format is already proven** — the demo
  moment must land in <15 seconds with one tap.

## End-goal spec (MUST all be met)
1. Static `index.html` + `css/` + `js/`. No build step. No backend.
2. Mobile-first, tested at **390px viewport** (480px max-width container).
3. The ONE holy-shit frame works in **<15s of use with one tap**.
4. **Visible "MVP demo" honesty label + honest scope line on every screen.**
5. **NO API keys/secrets.** Zero network calls where possible — the MVP must
   work offline. A static Pages app cannot safely call DeepSeek/vision, so the
   client-side honest version ships instead.
6. `README.md` present.
7. `git init` (already done) — leave an initial commit.

## The static, client-side honest MVP (no backend, no API keys)
The photo-recognition hero must be implemented **client-side and honestly**.
Options that satisfy this:
- **Curated pantry-ingredient picker with constraint matching** — the user
  taps ingredients they have (or uploads a photo and picks from a generated
  candidate list); the app matches recipes that use ONLY those ingredients.
  This is the honest MVP core. Do NOT fake "the AI recognises your photo" —
  disclose a rules-based matcher, not a vision model.
- A built-in **demo scenario** ("Ver la demo / Try the demo — 10 seconds")
  that pre-loads a realistic set of ingredients and shows the holy-shit frame
  in <15s with one tap.
- Recipe data can be a small curated **local JSON** embedded in the app —
  no network.
- Money-first framing is a strong bonus: "this dinner: $3.20, and you already
  own 11 of 13 ingredients."

## Honesty rules (non-negotiable)
- Never claim an "AI" or "vision" the client isn't actually running. Label it
  "rules engine / curated recipes, not a vision model."
- No fake social proof. No invented recipes/datasource.
- No secrets anywhere.

## Deliverables for the orchestrator to verify
- Files land in this folder.
- A commit exists.
- index.html opens without network and the demo journey is walkable at 390px.
