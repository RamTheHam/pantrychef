# PantryChef — Product Strategy (Holy Shit, Localisation, AI Muscle)

> Working doc. The GTM corpus (competitors / complaints / market size) lands
> separately and feeds the "consensus → blind spots → openings" memo. This
> document is the product-side answer to three questions Henrik asked:
> (1) is the Holy Shit moment real and sharp, (2) how does localisation work,
> (3) is there enough AI muscle behind the scenes to compound.

---

## 1. The Holy Shit moment — sharpen it, don't add to it

**Current frame:** "put food on the counter, snap, get a recipe." This is the
right single glanceable action (matches the Cal AI / UMAX pattern in
`app-idea-review`: upload → instant AI read → "I need that").

**Why it's already close:** one tap, one glance, zero typing. The vision call
actually reads the photo (not a fake demo), and the recipe comes back from only
those ingredients. That's the "I can do that with the mess I already own"
reaction from the dossier.

**Where it's still soft (fix in this order):**

1. **Latency is the wow-killer.** Current round-trip is ~6–20s (vision 25k
   tokens + recipe gen). The holy-shit frame dies past ~4s. Two cheap levers:
   - Shrink the upload image to ~768px before the vision call (we already
     compress to 1200px client-side; 768px would roughly halve the 25k-token
     vision prompt and its ~$0.004 cost).
   - Stream the loading screen with a real status ("I see tomatoes… now finding
     recipes") so the user watches progress instead of a spinner.
2. **The reveal must be visual, not a list.** Right now the result is recipe
   cards. The stronger moment: show the *recognised ingredients as chips with a
   ✓* the instant vision returns, THEN the recipe. The "it saw my exact food"
   beat is the wow; the recipe is the payoff. (Already have the chips; surface
   them as the first thing that renders.)
3. **One-tap demo on the empty state.** For TikTok/App Store screenshots, a
   "See it work" button that runs the demo pantry instantly — already exists,
   keep it above the fold.

**The 15-second script (must stay true):** "I have $12 of groceries and no
idea what to cook. *snap* — it sees my tomatoes, eggs and rice and gives me 5
recipes, nothing to buy. That's dinner."

---

## 2. Localisation — recipes must feel local AND stay adventurous

The thesis already encodes this (`thesis/icp-taxonomy.md` § localization):
overserved in English ≠ overserved in every language. For a *recipe* app this
is sharper than for most apps, because food is intensely local.

**Two-axis localisation (build it into the recipe prompt, not as an afterthought):**

- **Locality axis:** recipes must use ingredients and formats that exist in the
  user's local supermarket and culture. "Scallions + sesame oil + jasmine rice"
  is the right recipe for a Seoul user and the *wrong* one for a Stockholm
  student whose store carries rapeseed oil, dill and filmjölk. Detect the
  user's locale (browser `navigator.language` / IP) and inject it into the
  recipe prompt: "write for a Swedish home cook — Nordic supermarket staples,
  metric, local dish names where natural."
- **Adventure axis (keep, don't lose):** the app must not become a walled
  national cookbook. The adventure is a *toggle*, not a default: "Show me
  something international" lets the same pantry yield a proper pad thai or
  shakshuka. This is also the retention hook — same 5 ingredients, two very
  different dinners, so the app feels infinite.

**Practical implementation (all cheap, all in the existing prompt):**
1. Read locale server-side; pass a `locale` hint into `generate_recipes`.
2. Add a `"regional" | "international" | "any"` field to the request; default
   `"any"` (mix of local comfort + one adventurous pick), let the user switch.
3. Unit-conversion + local naming ("filmjölk", "rapeseed oil" vs "canola")
   comes free from the LLM once the locale is in the prompt — no recipe DB to
   localise by hand, which is the whole reason live generation beats a curated
   list for this.

**Language of the UI** is separate and later; the recipe *content* localisation
above is the part that actually matters to a student's dinner.

---

## 3. AI muscle behind the scenes — the compounding loop

The "snap → recipe" is the demo. The product sticks if the AI *remembers and
improves* across sessions. The muscle is a closed loop, and each link is cheap
on the current stack:

1. **Pantry memory.** After the photo, store the recognised ingredients as "your
   pantry" (client-side localStorage first; a real account later). Next snap,
   the app *already knows* what you had last time — "you had rice and eggs on
   Tuesday; add a tomato and you have shakshuka." This turns a one-shot novelty
   into a persistent assistant.
2. **Taste learning.** Every time the user picks a recipe or says "not for me,"
   that's a signal. Over ~10 interactions the recipe model learns spice level,
   vegetarianism, "no fish," portion size — and the *next* recipe is visibly
   better than the last. This is the retention curve the dossier's
   "transformation to sell" is built on: "the app that learns how you cook."
3. **Zero-waste streak / money framing.** Each recipe already implies "0 to
   buy." Track a weekly "money not wasted" number + streak. That's the paywall
   headline, not "unlock features" — sell the *identity* (the student who never
   throws food away), per the rubric's monetisation rule.
4. **The feedback that feeds Holy Shit again.** Every learned preference makes
   the *next* demo snap more impressive ("it knew I like it spicy before I
   said"). Muscle → wow → retention → more signal → more muscle. That's the
   loop; each turn makes the product harder to copy than the "snap" demo alone.

**What this means for architecture (honest note):** none of this needs a new
model or a backend rewrite — it needs *state* (localStorage now, a cheap store
later) and *the locale/preference fields threaded into the prompt*. The current
two-model setup (vision + Gemini-flash-lite recipe) already does the hard part.
The muscle is prompt + memory, not new AI.

---

## 4. Where this meets price (students/singles, low price)

The cost per snap is the ceiling on price. Measured today: **~$0.006/snap**
(vision $0.0039 + recipe $0.0021). That means:
- A free tier of ~10 snaps/mo costs ~$0.06/user — trivially affordable.
- A paid tier at even $2/mo covers ~330 snaps — huge headroom.
- The two levers that matter for gross margin are (a) smaller upload image
  (halves vision cost) and (b) caching common pantries (skip re-generating when
  the same ingredient set recurs). Both are straightforward.

The honest risk to flag: **vision is the cost driver, not the recipe model.**
Any further price pressure should attack the vision call (image size, caching,
batch), not swap the recipe model again — Gemini flash-lite is already ~$0.002.
