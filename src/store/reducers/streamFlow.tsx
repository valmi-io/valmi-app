// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PayloadAction } from '@reduxjs/toolkit';

type StreamState = {
    editing: boolean | null | undefined;
    streamId: string | null | undefined;
};

const initialState: StreamState = {
  editing: false,
  streamId: ''
};

export const streamFlowSlice = createSlice({
  name: 'streamFlow',
  initialState,
  reducers: {
    setStreamFlowState(state, action: PayloadAction<{}>) {
      state.editing = action.payload.editing;
      state.streamId = action.payload.streamId;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.streamFlow
      };
    });
  }
});

export const { setStreamFlowState } = streamFlowSlice.actions;

export default streamFlowSlice.reducer;
