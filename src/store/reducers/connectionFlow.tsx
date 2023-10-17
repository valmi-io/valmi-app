// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { HYDRATE } from 'next-redux-wrapper';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ConnectionType } from '@content/Connections/ConnectionModel';

type ConnectionFlowState = {
  flowState: {
    connection_type?: any;
    steps?: any;
    currentStep?: any;
    isEditableFlow?: boolean;
    selected_connector?: any;
    connector_spec?: any;
    connection_title?: string;
    connector_config?: any;
    oauth_params?: any;
    lastStep?: boolean;
    selected_file?: any;
    oauth_error?: string;
  };
};

const initialState: ConnectionFlowState = {
  flowState: {
    connection_type: ConnectionType.SRC,
    steps: 0,
    currentStep: 0,
    isEditableFlow: false
  }
};

export const connectionFlow = createSlice({
  name: 'connectionFlow',
  initialState,
  reducers: {
    setConnectionFlow(state, action: PayloadAction<any>) {
      state.flowState = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.connectionFlow
      };
    });
  }
});

export const { setConnectionFlow } = connectionFlow.actions;

export default connectionFlow.reducer;
