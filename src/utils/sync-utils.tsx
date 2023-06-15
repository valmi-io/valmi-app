/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

interface Step {
  label: string;
}

export const SyncFlowSteps: Step[] = [
  {
    label: 'Warehouse'
  },
  {
    label: 'Destination'
  },
  {
    label: 'Mapping'
  },
  {
    label: 'Schedule'
  }
];

export const EditSyncFlowSteps: Step[] = [
  {
    label: 'Mapping'
  },
  {
    label: 'Schedule'
  }
];
