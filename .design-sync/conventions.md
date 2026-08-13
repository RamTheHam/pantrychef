# Building with the PantryChef design system

PantryChef is a phone-first cooking app with a warm, editorial look: paper-cream
ground, deep green brand, one orange accent, serif headlines against a sans UI.
Designs built with it should feel like that app, not like a generic mobile kit.

## Setup

Import the stylesheet once — it carries both the tokens and every component
style. **There is no theme provider and no context**: any component renders
correctly on its own as long as `styles.css` is loaded.

```tsx
import '@pantrychef/design-system/styles.css';
```

Wrap screens in `AppShell`. It is not a provider — it is the phone-width column
(480px max, centred) that paints the `--paper` background and sets the sans type
stack. Without it, components still render styled but sit on the host page's
background at full width, which looks wrong for this product.

```tsx
<AppShell>
  <Screen variant="results">…</Screen>
</AppShell>
```

`Screen` takes `variant="camera" | "reveal" | "results" | "settings"`. The app
keeps every screen mounted and toggles `hidden` rather than unmounting, so
in-progress input survives navigation.

## The styling idiom: CSS custom properties, not utility classes

This system has **no utility-class vocabulary** — there is no `bg-*`, no
`p-4`, no spacing scale to compose from. Components carry their own class names
internally; you style your own layout glue with inline styles or your own CSS
that reads these tokens. Never invent a class name and expect it to resolve.

All 15 tokens are defined on `:root`:

| Group | Tokens |
|---|---|
| Ink & paper | `--ink` `#10231a`, `--ink-soft` `#4a5d52`, `--paper` `#f6f1e7`, `--card` `#ffffff` |
| Brand green | `--green` `#0f2a1c`, `--green-soft` `#1c4a33` |
| Accent | `--accent` `#e2542d`, `--accent-soft` `#ff7a4d` |
| Gold | `--gold` `#eec04f` |
| Shape | `--radius-lg` `22px`, `--radius-sm` `14px`, `--shadow`, `--shadow-card` |
| Type | `--font-sans`, `--font-serif` (Georgia) |

Colour carries meaning here — use it that way:

- **`--accent` is scarce.** It marks the one thing that matters on a screen: the
  match count in `ResultsHero`, the `Eyebrow` kicker, the `DemoLabel`, the
  featured card's outline, destructive actions. Two accent elements competing on
  one screen is a design error.
- **`--green-soft`** is the committing action (`Button variant="primary"`) and
  the proof lines that say the cook already owns the ingredients.
- **`--gold`** is grading and `ProTip` only.
- **Serif (`--font-serif`) is for voice** — headlines, dish names, and anything
  Basil the mascot says. Sans is for UI chrome, labels and body copy. Never set
  a serif on a button or a tag.

## Composition rules that are easy to get wrong

- On the dark face of a `FlipCard`, use `RevealThinking`, **not**
  `MascotPrompt` — MascotPrompt's `--ink` text is invisible against the green.
- `ResultsHero`'s `title` takes a node: wrap the number in a `<span>` so it
  paints accent. `title="5 dinners"` renders the number in plain ink and loses
  the whole point of the frame.
- `RecipeCard`'s grade row only appears when you pass `onRate`.
- `HistoryList` shows `emptyMessage` only when it has no children.
- Every results screen ends with `SiteFooter` — the honesty badge is not
  decoration, it is a product requirement.

## Where the truth lives

- `_ds/<folder>/styles.css` and its imports — the real tokens and every
  component rule. Read it before writing any CSS of your own.
- `components/<group>/<Name>/<Name>.d.ts` — the prop contract.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage with
  examples.

## A representative build

```tsx
import '@pantrychef/design-system/styles.css';
import {
  AppShell, Screen, BrandRow, TextButton, ResultsHero,
  RecipeList, RecipeCard, SiteFooter,
} from '@pantrychef/design-system';

export function Results() {
  return (
    <AppShell>
      <Screen variant="results">
        <BrandRow
          left={<TextButton>← Retake</TextButton>}
          right={<TextButton>My dishes</TextButton>}
        />
        <ResultsHero
          kicker="✦ What I see on your counter"
          title={<><span>2</span> dinners from your ingredients.</>}
          ingredients={['Courgette', 'Feta', 'Orzo']}
        />
        {/* layout glue is your own CSS reading the tokens — no utility classes */}
        <div style={{ marginTop: 'var(--radius-sm)' }}>
          <RecipeList>
            <RecipeCard
              featured
              name="Courgette & feta orzo"
              description="Salty, green and on the table before the kettle has cooled."
              timeMinutes={18}
              serves={2}
              match="exact"
              usedCount={6}
            />
          </RecipeList>
        </div>
        <SiteFooter>Memory stays on your phone · see what&rsquo;s shared in ⚙ settings</SiteFooter>
      </Screen>
    </AppShell>
  );
}
```
