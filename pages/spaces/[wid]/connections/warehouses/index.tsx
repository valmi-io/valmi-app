/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, May 4th 2023, 9:25:36 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement } from 'react';

import SidebarLayout from '@/layouts/SidebarLayout';
import { NextPageWithLayout } from '../../../../_app';
import {
  ConnectionType,
  ConnectionsPageTitle,
  CreateConnectionTitle
} from '@/content/Connections/ConnectionModel';
import constants from '@/constants';
import ConnectionLayout from '../../../../../src/content/Connections/ConnectionsLayout';

const Warehouses: NextPageWithLayout = () => {
  return (
    <ConnectionLayout
      pageHeadTitle={constants.connections.CONNECTIONS_TITLE}
      title={ConnectionsPageTitle.SRC}
      buttonTitle={CreateConnectionTitle.SRC}
      connection_type={ConnectionType.SRC}
    />
  );
};

Warehouses.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Warehouses;
