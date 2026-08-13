import { TextField } from '@pantrychef/design-system';

export const NoteField = () => (
  <TextField placeholder="Anything else? (optional — what do you fancy?)" maxLength={120} />
);

export const Filled = () => <TextField defaultValue="something warm, not too heavy" />;

export const CommentField = () => (
  <TextField size="sm" placeholder="one word if you like…" maxLength={80} />
);
