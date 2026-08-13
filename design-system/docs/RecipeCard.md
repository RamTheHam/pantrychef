---
category: Recipes
---

# RecipeCard

One recipe, whole.

The densest component in the system: tags, name, description, proof line, collapsed method, grading row. Pass real recipe data — this card is the product.

```tsx
<RecipeCard
  name="Courgette & feta orzo"
  description="Salty, green and on the table before the kettle cools."
  timeMinutes={18}
  serves={2}
  match="exact"
  usedCount={6}
  dietary={['Vegetarian']}
  ingredients={['Orzo', 'Courgette', 'Feta']}
  steps={['Boil the orzo.', 'Fry the courgette.', 'Fold in the feta.']}
  featured
/>
```
