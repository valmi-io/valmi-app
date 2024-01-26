// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PayloadAction } from '@reduxjs/toolkit';

type TrackState = {
  editing: boolean | null | undefined;
  id: string | null | undefined;
};

const initialState: TrackState = {
  editing: false,
  id: ''
};

export const trackFlowSlice = createSlice({
  name: 'trackFlow',
  initialState,
  reducers: {
    setEventFlowState(state, action: PayloadAction<{}>) {
      state.editing = action.payload.editing;
      state.id = action.payload.id;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.trackFlow
      };
    });
  }
});

export const { setEventFlowState } = trackFlowSlice.actions;

export default trackFlowSlice.reducer;
