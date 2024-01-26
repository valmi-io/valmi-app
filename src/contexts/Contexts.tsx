/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, November 14th 2023, 7:38:22 pm
 * Author: Nagendra S @ valmi.io
 */

import { createContext } from 'react';

type SyncRunContext = {
  isPromisePending: boolean;
  setIsPromisePending: any;
};

type SyncRunRootContext = {
  updateLastSync: any;
  handleAlertDialog: any;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyncRunContext = createContext<SyncRunContext>(
  {} as SyncRunContext
);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SyncRunRootContext = createContext<SyncRunRootContext>(
  {} as SyncRunRootContext
);
