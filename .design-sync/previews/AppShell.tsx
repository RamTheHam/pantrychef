import {
  AppShell,
  BrandRow,
  CameraButton,
  CheckboxRow,
  ControlRow,
  IconButton,
  MascotPrompt,
  RecipeCard,
  RecipeList,
  ResultsHero,
  Screen,
  SideButton,
  SiteFooter,
  TextButton,
  TextField,
  TopBar,
} from '@pantrychef/design-system';

export const ResultsScreen = () => (
  <AppShell>
    <Screen variant="results">
      <BrandRow
        left={<TextButton>← Retake</TextButton>}
        right={<TextButton>My dishes</TextButton>}
      />
      <ResultsHero
        kicker="✦ What I see on your counter"
        title={
          <>
            <span>2</span> dinners from your ingredients.
          </>
        }
        ingredients={['Courgette', 'Feta', 'Orzo', 'Lemon', 'Garlic']}
      />
      <RecipeList>
        <RecipeCard
          featured
          name="Courgette & feta orzo"
          description="Salty, green and on the table before the kettle has cooled."
          timeMinutes={18}
          serves={2}
          match="exact"
          usedCount={6}
        />
        <RecipeCard
          name="Lemon garlic butter beans"
          description="Ten minutes, one pan, and the lemon does most of the work."
          timeMinutes={10}
          serves={2}
          match="exact"
          usedCount={4}
        />
      </RecipeList>
      <SiteFooter>Memory stays on your phone · see what&rsquo;s shared in ⚙ settings</SiteFooter>
    </Screen>
  </AppShell>
);

export const CameraScreen = () => (
  <AppShell>
    <Screen variant="camera">
      <TopBar actions={<IconButton icon="⚙" label="Settings" />} />
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
  </AppShell>
);
