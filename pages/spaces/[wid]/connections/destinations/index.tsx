/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 9:26:47 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Destinations Page Component
 * This component represents a page for displaying destinations and creating new destination.
 */

import { ReactElement } from 'react';

import { NextPageWithLayout } from '@/pages_app';

import SidebarLayout from '@layouts/SidebarLayout';

import {
  ConnectionType,
  ConnectionsPageTitle,
  CreateConnectionTitle
} from '@content/Connections/ConnectionModel';
import Connections from '@content/Connections';

import constants from '@constants/index';

const Destinations: NextPageWithLayout = () => {
  return (
    <Connections
      pageHeadTitle={constants.connections.CONNECTIONS_TITLE}
      title={ConnectionsPageTitle.DEST}
      buttonTitle={CreateConnectionTitle.DEST}
      connectionType={ConnectionType.DEST}
    />
  );
};

Destinations.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Destinations;
