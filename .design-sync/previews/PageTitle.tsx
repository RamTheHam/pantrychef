import { PageTitle } from '@pantrychef/design-system';

export const WithSubtitle = () => (
  <PageTitle subtitle="This is the only data that leaves your phone. It has no name, no location, no photos — just your taste and your own words. Saved only on this device.">
    What Basil knows about you
  </PageTitle>
);

export const WithCount = () => <PageTitle meta="4 dishes cooked">Dishes I&rsquo;ve made</PageTitle>;
