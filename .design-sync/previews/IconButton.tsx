import { IconButton } from '@pantrychef/design-system';

export const Settings = () => <IconButton icon="⚙" label="Settings" />;

export const Row = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    <IconButton icon="⚙" label="Settings" />
    <IconButton icon="✕" label="Close" />
    <IconButton icon="?" label="Help" />
  </div>
);
