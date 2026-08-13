import { HistoryItem, HistoryList } from '@pantrychef/design-system';

export const Cooked = () => (
  <HistoryList>
    <HistoryItem name="Courgette & feta orzo" stars={5} comment="weeknight saviour" />
    <HistoryItem name="Lemon garlic butter beans" stars={4} comment="needed more lemon" />
    <HistoryItem name="Chickpea shakshuka" stars={3} />
  </HistoryList>
);

export const Empty = () => (
  <HistoryList emptyMessage="Nothing cooked yet. Snap a photo and grade your first recipe — Basil will remember." />
);
