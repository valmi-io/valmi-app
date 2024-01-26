// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PayloadAction } from '@reduxjs/toolkit';

type SyncFlowState = {
  flowState: any;
};

const initialState: SyncFlowState = {
  flowState: {
    steps: [],
    currentStep: 0,
    isEditableFlow: false,
    editableFields: {}
  }
};

export const syncFlow = createSlice({
  name: 'syncFlow',
  initialState,
  reducers: {
    setFlowState(state, action: PayloadAction<any>) {
      state.flowState = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.syncFlow
      };
    });
  }
});

export const { setFlowState } = syncFlow.actions;

export default syncFlow.reducer;
