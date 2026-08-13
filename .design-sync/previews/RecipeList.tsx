import { RecipeCard, RecipeList } from '@pantrychef/design-system';

export const Stack = () => (
  <RecipeList>
    <RecipeCard
      featured
      name="Courgette & feta orzo"
      description="Salty, green and on the table before the kettle has cooled."
      timeMinutes={18}
      serves={2}
      match="exact"
      usedCount={6}
      dietary={['Vegetarian']}
    />
    <RecipeCard
      name="Lemon garlic butter beans"
      description="Ten minutes, one pan, and the lemon does most of the work."
      timeMinutes={10}
      serves={2}
      match="exact"
      usedCount={4}
    />
    <RecipeCard
      name="Chickpea shakshuka"
      description="A one-pan braise that turns a tin of chickpeas into dinner."
      timeMinutes={25}
      serves={3}
      match="closest"
      usedCount={5}
      missing={['Eggs', 'Smoked paprika']}
    />
  </RecipeList>
);
