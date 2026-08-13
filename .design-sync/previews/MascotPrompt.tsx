import { MascotPrompt } from '@pantrychef/design-system';

export const CameraPrompt = () => <MascotPrompt>Just photograph your ingredients</MascotPrompt>;

export const MultiShot = () => (
  <MascotPrompt>Snap two photos — I&rsquo;ll combine what I see</MascotPrompt>
);

export const Large = () => <MascotPrompt size="lg">Got one — snap the second</MascotPrompt>;
