import { Chip, ChipGroup } from '@pantrychef/design-system';

export const Detected = () => (
  <ChipGroup label="Ingredients detected">
    <Chip>Courgette</Chip>
    <Chip>Feta</Chip>
    <Chip>Orzo</Chip>
    <Chip>Lemon</Chip>
    <Chip>Garlic</Chip>
    <Chip>Olive oil</Chip>
  </ChipGroup>
);

export const NothingRecognised = () => (
  <ChipGroup label="Ingredients detected">
    <Chip muted>No items recognised</Chip>
  </ChipGroup>
);
