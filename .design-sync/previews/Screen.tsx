import {
  BrandRow,
  Button,
  ActionStack,
  CameraButton,
  CheckboxRow,
  ControlRow,
  DemoLabel,
  MascotPrompt,
  PageTitle,
  Screen,
  SideButton,
  SummaryList,
  TextButton,
  TextField,
} from '@pantrychef/design-system';

export const Camera = () => (
  <Screen variant="camera">
    <ControlRow>
      <SideButton icon="🖼" label="Library" />
      <CameraButton />
      <SideButton icon="⊕" label="x2" />
    </ControlRow>
    <MascotPrompt>Just photograph your ingredients</MascotPrompt>
    <TextField placeholder="Anything else? (optional — what do you fancy?)" maxLength={120} />
    <CheckboxRow defaultChecked>
      Assume basics — salt, pepper, herbs, butter or oil
    </CheckboxRow>
  </Screen>
);

export const Settings = () => (
  <Screen variant="settings">
    <BrandRow left={<TextButton>← Back</TextButton>} right={<DemoLabel>Settings</DemoLabel>} />
    <PageTitle subtitle="This is the only data that leaves your phone. It has no name, no location, no photos — just your taste and your own words.">
      What Basil knows about you
    </PageTitle>
    <SummaryList
      items={[
        { label: 'Mascot', value: 'Basil' },
        { label: 'You like', value: 'courgette, feta, lemon' },
        { label: 'You avoid', value: '—' },
      ]}
    />
    <ActionStack>
      <Button>Download my data (JSON)</Button>
      <Button variant="danger">Erase everything on this phone</Button>
    </ActionStack>
  </Screen>
);
