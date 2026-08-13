---
category: Reveal
---

# FlipCard

The card that shakes, then flips to the dish.

The app's sense of theatre. Shake while the work happens, then flip — never cut straight to results.

```tsx
<FlipCard
  flipped
  back={<MascotPrompt size="lg">Reading your food…</MascotPrompt>}
  front={<RevealSummary name="Courgette & feta orzo" timeMinutes={18} usedCount={6} />}
/>
```
