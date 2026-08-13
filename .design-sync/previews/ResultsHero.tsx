import { ResultsHero } from '@pantrychef/design-system';

export const Matches = () => (
  <ResultsHero
    kicker="✦ What I see on your counter"
    title={
      <>
        <span>5</span> dinners from your ingredients.
      </>
    }
    ingredients={['Courgette', 'Feta', 'Orzo', 'Lemon', 'Garlic', 'Olive oil']}
  />
);

export const SingleMatch = () => (
  <ResultsHero
    kicker="✦ What I see on your counter"
    title={
      <>
        <span>1</span> dinner from your ingredients.
      </>
    }
    ingredients={['Butter beans', 'Lemon', 'Garlic']}
  />
);

export const NoMatch = () => (
  <ResultsHero kicker="✦ What I see on your counter" title="Almost there." ingredients={[]} />
);
