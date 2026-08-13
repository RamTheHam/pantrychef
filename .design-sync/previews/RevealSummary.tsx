import { FlipCard, RevealSummary, RevealThinking } from '@pantrychef/design-system';

export const InCard = () => (
  <FlipCard
    flipped
    back={<RevealThinking>Reading your food…</RevealThinking>}
    front={
      <RevealSummary
        name="Courgette & feta orzo"
        description="Salty, green and on the table before the kettle has cooled."
        timeMinutes={18}
        usedCount={6}
      />
    }
  />
);

export const ShortName = () => (
  <FlipCard
    flipped
    front={<RevealSummary name="Butter beans" timeMinutes={10} usedCount={4} />}
  />
);
