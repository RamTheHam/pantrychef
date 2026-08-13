import { CameraButton, ControlRow, SideButton } from '@pantrychef/design-system';

export const Default = () => (
  <ControlRow>
    <SideButton icon="🖼" label="Library" />
    <CameraButton />
    <SideButton icon="⊕" label="x2" />
  </ControlRow>
);

export const MultiShotEngaged = () => (
  <ControlRow>
    <SideButton icon="🖼" label="Library" />
    <CameraButton />
    <SideButton icon="⊕" label="x2" active />
  </ControlRow>
);
