---
category: Recipes
---

# ResultsHero

The payoff block at the top of results.

The app's holy-shit frame — lead with the number, wrapped in a `<span>` so it paints accent orange.

```tsx
<ResultsHero
  kicker="✦ What I see on your counter"
  title={<><span>5</span> dinners from your ingredients.</>}
  ingredients={['Courgette', 'Feta', 'Orzo']}
/>
```
