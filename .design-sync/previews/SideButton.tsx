import { SideButton } from '@pantrychef/design-system';

export const Library = () => <SideButton icon="🖼" label="Library" />;

export const MultiShotActive = () => <SideButton icon="⊕" label="x2" active />;

export const Pair = () => (
  <div style={{ display: 'flex', gap: 30 }}>
    <SideButton icon="🖼" label="Library" />
    <SideButton icon="⊕" label="x2" active />
  </div>
);
