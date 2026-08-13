import { Chip, ChipGroup } from '@pantrychef/design-system';

export const Wrapping = () => (
  <ChipGroup label="Ingredients detected">
    <Chip>Courgette</Chip>
    <Chip>Feta</Chip>
    <Chip>Orzo</Chip>
    <Chip>Lemon</Chip>
    <Chip>Garlic</Chip>
    <Chip>Olive oil</Chip>
    <Chip>Butter beans</Chip>
    <Chip>Flat-leaf parsley</Chip>
  </ChipGroup>
);

export const Single = () => (
  <ChipGroup label="Ingredients detected">
    <Chip>Courgette</Chip>
  </ChipGroup>
);
