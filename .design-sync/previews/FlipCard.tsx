import { FlipCard, RevealSummary, RevealThinking } from '@pantrychef/design-system';

export const Thinking = () => (
  <FlipCard back={<RevealThinking>Reading your food…</RevealThinking>} />
);

export const Revealed = () => (
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
