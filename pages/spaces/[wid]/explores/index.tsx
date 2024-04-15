import React, { ReactElement } from 'react';

import PageLayout from '@/layouts/PageLayout';
import SidebarLayout from '@/layouts/SidebarLayout';

const ExploresPage = () => {
  return (
    <PageLayout pageHeadTitle="explores" title="" displayButton={false}>
      <></>
    </PageLayout>
  );
};

ExploresPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ExploresPage;
