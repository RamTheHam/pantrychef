import { Tag } from '@pantrychef/design-system';

export const Tones = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Tag tone="match">Exact match</Tag>
    <Tag tone="time">18 min</Tag>
    <Tag tone="serve">Serves 2</Tag>
    <Tag tone="diet">Vegetarian</Tag>
  </div>
);

export const RecipeMeta = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Tag tone="match">Closest</Tag>
    <Tag tone="time">25 min</Tag>
    <Tag tone="serve">Serves 3</Tag>
  </div>
);
