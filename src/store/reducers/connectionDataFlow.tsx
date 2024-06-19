/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Thursday, March 28th 2024, 5:13:12 pm
 * Author: Nagendra S @ valmi.io
 */

import { HYDRATE } from 'next-redux-wrapper';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TData } from '@/utils/typings.d';

const initialState: TData = {
  ids: [], // list of steps ['selected_connector','source_credential','source_catalog','schedule']
  entities: {} // step data (object)
};

export const connectionDataFlow = createSlice({
  name: 'connectionDataFlow',
  initialState,
  reducers: {
    setIds(state, action: PayloadAction<any>) {
      state.ids = action.payload;
    },
    setEntities(state, action: PayloadAction<any>) {
      state.entities = action.payload;
    },
    clearConnectionFlowState(state) {
      state.ids = [];
      state.entities = {};
    },
    setConnectionFlowState(state, action: PayloadAction<any>) {
      state.ids = action.payload.ids;
      state.entities = action.payload.entities;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        // @ts-ignore
        ...action?.payload.connectionDataFlow
      };
    });
  }
});

export const { setIds, setEntities, clearConnectionFlowState, setConnectionFlowState } = connectionDataFlow.actions;

export default connectionDataFlow.reducer;
