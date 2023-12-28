/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 6:59:53 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement } from 'react';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';

const CreateTrack = () => {
  return (
    <PageLayout
      pageHeadTitle={'Create track'}
      title={'Create a new link'}
      displayButton={false}
    >
      <></>
    </PageLayout>
  );
};

CreateTrack.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateTrack;
