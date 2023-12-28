/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:44:22 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement } from 'react';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

const CreateDestination = () => {
  return (
    <PageLayout
      pageHeadTitle={'Create destination'}
      title={'Create a new destination'}
      displayButton={false}
    >
      <></>
    </PageLayout>
  );
};

CreateDestination.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateDestination;
