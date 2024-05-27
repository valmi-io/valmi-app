// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export type AppFlowUserState = {
  email: string;
  name: string;
  image: string;
};

type AppState = {
  workspaceId: string;
  loginFlowState?: any;
  user?: AppFlowUserState;
};

export type AppFlowState = {
  appState: AppState;
};

const initialState: AppFlowState = {
  appState: {
    workspaceId: '',
    user: {
      name: '',
      email: '',
      image: ''
    }
  }
};

export const appFlow = createSlice({
  name: 'appFlow',
  initialState,
  reducers: {
    setAppState(state, action: PayloadAction<any>) {
      state.appState = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.appFlow
      };
    });
  }
});

export const { setAppState } = appFlow.actions;

export default appFlow.reducer;
