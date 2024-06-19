/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { Step } from '@components/Stepper';
import constants from '@constants/index';

export enum ConnectionType {
  SRC = 'SRC',
  DEST = 'DEST'
}

export type ConnectorType = 'Webhook' | 'Google Sheets' | 'Customer.io | Facebook Ads';

export enum ConnectionsPageTitle {
  SRC = 'Warehouses',
  DEST = 'Destinations'
}

export enum CreateConnectionTitle {
  SRC = 'Warehouse',
  DEST = 'Destination'
}

export interface ConnectionModel {
  id: string;
  connectionName: string;
  connector: ConnectorType;
}

export interface ConnectorModel {
  type: string;
  display_name: string;
}

export const EtlConnectionSteps: Step[] = [
  {
    label: constants.connections.CONFIGURE_SOURCE
  },
  {
    label: constants.connections.SELECT_STREAMS
  },
  {
    label: constants.connections.CONFIGURE_CONNECTION
  }
];

export const RetlConnectionSteps: Step[] = [
  {
    label: constants.connections.CONFIGURE_SOURCE
  },
  {
    label: constants.connections.SELECT_STREAMS
  },
  {
    label: constants.connections.CONFIGURE_CONNECTION
  }
];
