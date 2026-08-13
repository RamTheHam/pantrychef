# @pantrychef/design-system

The components, tokens and type styles behind the PantryChef app — extracted
from the app's own stylesheet and markup so the two stay recognisably the same
product.

```bash
npm install @pantrychef/design-system
```

```tsx
import '@pantrychef/design-system/styles.css';
import { AppShell, Screen, ResultsHero, RecipeCard } from '@pantrychef/design-system';

<AppShell>
  <Screen variant="results">
    <ResultsHero
      kicker="✦ What I see on your counter"
      title={<><span>5</span> dinners from your ingredients.</>}
      ingredients={['Courgette', 'Feta', 'Orzo']}
    />
    <RecipeCard name="Courgette & feta orzo" timeMinutes={18} usedCount={6} />
  </Screen>
</AppShell>
```

`styles.css` is required — it carries both the tokens and the component styles.
There is no theme provider; everything is CSS custom properties on `:root`.

Per-component documentation lives in [`docs/`](./docs).

## Build

```bash
npm install
npm run build   # tsc → dist/, plus the stylesheets
```
