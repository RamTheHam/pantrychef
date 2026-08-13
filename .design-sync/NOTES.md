# design-sync notes — pantrychef

## What this repo is

PantryChef is a static MVP web app (`index.html` + `css/styles.css` + `js/app.js`,
no build step). It had **no design system** when the first sync ran. The
`design-system/` package was created during that sync by extracting the app's own
`:root` token block and class vocabulary from `css/styles.css` into a typed React
component library. The app itself was **not** modified.

## Repo-specific gotchas

- **The DS package is at `design-system/`, not the repo root.** The repo root has
  no `package.json`. Build with `npm --prefix design-system run build`
  (`cfg.buildCmd`), and pass `--node-modules design-system/node_modules` plus
  `--entry ./design-system/dist/index.js` — npm will not self-install
  `@pantrychef/design-system` into its own `node_modules`, so `--entry` is required.
- **`cfg.tsconfig` is package-relative.** It must be `tsconfig.build.json`, not
  `design-system/tsconfig.build.json` — the latter silently logs
  `tsconfig: … not found — skipped`.
- **`dist/styles.css` must stay a flat concatenation, never a file of `@import`s.**
  The first build shipped `styles.css` as two `@import` lines; the converter copied
  only that file, so `_ds_bundle.css` was 52 bytes and every design would have
  rendered unstyled. `design-system/scripts/copy-css.mjs` now concatenates
  `tokens.css` + `components.css` into `dist/styles.css` and copies the partials
  alongside. Keep it that way.
- **`guidelinesGlob` is `[]` on purpose.** The default globs include `docs/*.md`,
  which swept all 32 per-component docs into `guidelines/` as duplicates.
- **Playwright must be 1.56.0.** The pre-installed chromium at
  `/opt/pw-browsers` is build **1194**, which only playwright 1.56.0 pins. Latest
  (1.62.x) pins 1234 and fails with `Executable doesn't exist`. Installed into
  `.ds-sync/`, so a fresh clone needs it again.
- **The pinned chromium build is machine-specific — don't assume the number above.**
  A Windows session with a pre-cached `ms-playwright` build 1208 needed playwright
  1.58.0, not 1.56.0. Read the cache dir name (`chromium-<build>`), then confirm
  the candidate version's pin via `raw.githubusercontent.com/microsoft/playwright/v<X.Y.Z>/packages/playwright-core/browsers.json`
  before installing — don't reuse a build number recorded on a different machine.

## Known render warns

None. The final run was 32/32 clean with zero warn lines — so **any** warn on a
future run is new and should be investigated, not assumed benign.

Two things that look odd in screenshots but are correct:

- The `🖼` glyph in `SideButton`/`ControlRow` renders as a monochrome
  framed-picture outline in headless chromium (no colour emoji for that
  codepoint). Other emoji — `🌿`, `🍋` — render in full colour. It is a real
  glyph, not tofu, and matches what the app ships.
- `CameraButton` has a single export (`Shutter`) and `RecipeList` a single
  export (`Stack`). Deliberate: those components have one true presentation.

## Decisions made during the first sync

- Every one of the 32 components has an **authored** preview — there are no floor
  cards. All 70 cells graded `good`.
- `RevealThinking` was **added to the DS during the sync**: the app's
  `.reveal-thinking` style (white serif on the dark flip face) shipped in the CSS
  with no component exposing it, and composing that face with `MascotPrompt`
  rendered dark-ink text on dark green. Anything on `FlipCard`'s back face must
  use `RevealThinking`.
- Fonts are `system-ui` and Georgia only — no webfonts, so no `[FONT_MISSING]`
  and nothing in `fonts/`. Expected, not a gap.

## Re-sync risks

- **The DS duplicates the app's CSS rather than sharing it.** `design-system/src/css/`
  was copied from `css/styles.css` at sync time. Edit either one and they drift
  silently — nothing checks. If the app's look changes, port the change into
  `design-system/src/css/components.css` (or `tokens.css`) and re-sync. Making
  the app consume the DS stylesheet would remove this risk but would add a build
  step the app's brief explicitly forbids.
- **The upload never happened on the first run.** `DesignSync` had no
  design-system authorization in the remote container, so there is no
  `projectId` in `config.json` and no `_ds_sync.json` in any project. The first
  successful sync will therefore be a **full** first-time upload with no anchor —
  expected, not a fault. Grades in `.design-sync/.cache/` are gitignored and will
  not survive a fresh clone; the previews and config will, so re-grading is the
  only repeat cost.
- **Preview content is hand-written recipe copy**, not data from the repo — the
  app ships no recipe fixtures (recipes come from the backend at runtime). It
  will not rot, but it is also not checked against anything real.
- Toolchain assumed: node 22, npm 10, playwright 1.56.0, chromium 1194.
