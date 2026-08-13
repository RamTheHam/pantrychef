import { FlipCard, RevealThinking } from '@pantrychef/design-system';

export const Waiting = () => (
  <FlipCard back={<RevealThinking>Reading your food…</RevealThinking>} />
);

export const CustomAvatar = () => (
  <FlipCard back={<RevealThinking avatar="🍋">Working out what goes together…</RevealThinking>} />
);
