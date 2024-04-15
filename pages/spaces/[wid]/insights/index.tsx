import React, { ReactElement } from 'react';

import PageLayout from '@/layouts/PageLayout';
import SidebarLayout from '@/layouts/SidebarLayout';

const InsightsPage = () => {
  return (
    <PageLayout pageHeadTitle="insights" title="" displayButton={false}>
      <></>
    </PageLayout>
  );
};

InsightsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default InsightsPage;
