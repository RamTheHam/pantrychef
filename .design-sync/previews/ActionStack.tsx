import { ActionStack, Button } from '@pantrychef/design-system';

export const SettingsActions = () => (
  <ActionStack>
    <Button variant="primary">Download my data (JSON)</Button>
    <Button variant="secondary">Copy to clipboard</Button>
    <Button variant="danger">Erase everything on this phone</Button>
  </ActionStack>
);

export const SingleAction = () => (
  <ActionStack>
    <Button variant="primary">Snap another photo</Button>
  </ActionStack>
);
