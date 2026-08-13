import { BrandRow, DemoLabel, TextButton } from '@pantrychef/design-system';

export const TwoControls = () => (
  <BrandRow left={<TextButton>← Retake</TextButton>} right={<TextButton>My dishes</TextButton>} />
);

export const WithBadge = () => (
  <BrandRow left={<TextButton>← Back</TextButton>} right={<DemoLabel />} />
);
