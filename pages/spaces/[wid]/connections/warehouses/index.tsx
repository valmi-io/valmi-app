/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 9:25:36 pm
 * Author: Nagendra S @ valmi.io
 */

/*
 * Warehouses Page Component
 * This component represents a page for displaying warehouses and creating new warehouse.
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

const Warehouses: NextPageWithLayout = () => {
  return (
    <Connections
      pageHeadTitle={constants.connections.CONNECTIONS_TITLE}
      title={ConnectionsPageTitle.SRC}
      buttonTitle={CreateConnectionTitle.SRC}
      connectionType={ConnectionType.SRC}
    />
  );
};

Warehouses.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Warehouses;
