import { SummaryList } from '@pantrychef/design-system';

export const WhatBasilKnows = () => (
  <SummaryList
    items={[
      { label: 'Mascot', value: 'Basil' },
      { label: 'You like', value: 'courgette, feta, lemon' },
      { label: 'You avoid', value: 'anchovy' },
      { label: 'Last pantry', value: 'orzo, garlic, olive oil' },
      { label: 'Your note', value: 'something warm, not too heavy' },
      { label: 'Cooked', value: 'Courgette & feta orzo (5★)' },
    ]}
  />
);

export const Empty = () => (
  <SummaryList
    items={[
      { label: 'Mascot', value: 'Basil' },
      { label: 'You like', value: '—' },
      { label: 'You avoid', value: '—' },
      { label: 'Cooked', value: '—' },
    ]}
  />
);
