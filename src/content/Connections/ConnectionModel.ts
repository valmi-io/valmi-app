/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { Step } from '../../components/Stepper';
import constants from '../../constants';

export enum ConnectionType {
  SRC = 'SRC',
  DEST = 'DEST'
}

export type ConnectorType =
  | 'Webhook'
  | 'Google Sheets'
  | 'Customer.io | Facebook Ads';

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

export const ConnectionSteps: Step[] = [
  {
    label: constants.connections.SELECT_CONNECTOR_TITLE
  },
  {
    label: constants.connections.CONFIGURE_CONNECTOR_TITLE
  },
  {
    label: constants.connections.TEST_CONNECTOR_TITLE
  }
];
