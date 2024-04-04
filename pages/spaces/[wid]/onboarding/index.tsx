import React, { ReactElement, useEffect } from 'react';

import PageLayout from '@/layouts/PageLayout';
import SidebarLayout from '@/layouts/SidebarLayout';
import NavigationBox from '@/components/NavigationBox';
import { Stack } from '@mui/material';

const OnboardingPage = () => {
  return (
    <PageLayout pageHeadTitle="Onboarding" title="" displayButton={false}>
      <Stack sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <NavigationBox label="Track accurarte analytics by sending events to GA4" redirectRoute="/catalog" />
        <NavigationBox label="Track accurarte analytics by sending events to GA4" redirectRoute="/catalog" />
        <NavigationBox label="Track accurarte analytics by sending events to GA4" redirectRoute="/catalog" />
        <NavigationBox label="Track accurarte analytics by sending events to GA4" redirectRoute="/catalog" />
        <NavigationBox label="Track accurarte analytics by sending events to GA4" redirectRoute="/catalog" />
      </Stack>
    </PageLayout>
  );
};

OnboardingPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default OnboardingPage;
