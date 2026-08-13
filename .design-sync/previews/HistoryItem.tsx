import { HistoryItem } from '@pantrychef/design-system';

export const WithComment = () => (
  <HistoryItem name="Courgette & feta orzo" stars={5} comment="weeknight saviour" />
);

export const WithoutComment = () => <HistoryItem name="Lemon garlic butter beans" stars={4} />;

export const Ungraded = () => <HistoryItem name="Chickpea shakshuka" stars={0} />;
