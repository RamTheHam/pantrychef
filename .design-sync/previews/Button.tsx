import { ActionStack, Button } from '@pantrychef/design-system';

export const Variants = () => (
  <ActionStack>
    <Button variant="primary">Download my data (JSON)</Button>
    <Button variant="secondary">Copy to clipboard</Button>
    <Button variant="danger">Erase everything on this phone</Button>
  </ActionStack>
);

export const Disabled = () => (
  <ActionStack>
    <Button variant="primary" disabled>
      Download my data (JSON)
    </Button>
  </ActionStack>
);
