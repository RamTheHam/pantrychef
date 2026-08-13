import { RecipeCard, RecipeList } from '@pantrychef/design-system';

export const ExactMatch = () => (
  <RecipeCard
    featured
    name="Courgette & feta orzo"
    description="Salty, green and on the table before the kettle has cooled."
    timeMinutes={18}
    serves={2}
    match="exact"
    usedCount={6}
    defaultOpen
    dietary={['Vegetarian']}
    ingredients={['Orzo', 'Courgette', 'Feta', 'Lemon', 'Garlic', 'Olive oil']}
    steps={[
      'Boil the orzo in well-salted water until just tender.',
      'Meanwhile fry the courgette in olive oil with the garlic until it takes colour.',
      'Fold the drained orzo through the courgette, crumble in the feta and finish with lemon.',
    ]}
    proTip="Salt the water like the sea — the orzo is the only thing here seasoned from within."
  />
);

export const ClosestMatch = () => (
  <RecipeCard
    name="Chickpea shakshuka"
    description="A one-pan braise that turns a tin of chickpeas into dinner."
    timeMinutes={25}
    serves={3}
    match="closest"
    usedCount={5}
    missing={['Eggs', 'Smoked paprika']}
    dietary={['Vegetarian', 'High protein']}
    ingredients={['Chickpeas', 'Tomatoes', 'Onion', 'Garlic', 'Olive oil']}
    steps={[
      'Soften the onion and garlic in a wide pan.',
      'Add the tomatoes and chickpeas and simmer until thick.',
      'Make wells, crack in the eggs, cover and cook until just set.',
    ]}
  />
);

export const Graded = () => (
  <RecipeCard
    name="Lemon garlic butter beans"
    description="Ten minutes, one pan, and the lemon does most of the work."
    timeMinutes={10}
    serves={2}
    match="exact"
    usedCount={4}
    ingredients={['Butter beans', 'Lemon', 'Garlic', 'Olive oil']}
    steps={['Warm the garlic in oil.', 'Add the beans and crush a few.', 'Finish with lemon.']}
    grade={4}
    onRate={() => {}}
  />
);

export const InAList = () => (
  <RecipeList>
    <RecipeCard
      featured
      name="Courgette & feta orzo"
      description="Salty, green and quick."
      timeMinutes={18}
      match="exact"
      usedCount={6}
    />
    <RecipeCard
      name="Chickpea shakshuka"
      description="A one-pan braise."
      timeMinutes={25}
      match="closest"
      usedCount={5}
      missing={['Eggs', 'Smoked paprika']}
    />
  </RecipeList>
);
