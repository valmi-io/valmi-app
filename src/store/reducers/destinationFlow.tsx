// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PayloadAction } from '@reduxjs/toolkit';

type DestinationState = {
    editing: boolean | null | undefined;
    id: string | null | undefined;
    type: string | null | undefined;
    supertype: string | null | undefined;
};

const initialState: DestinationState = {
  editing: false,
  id: '',
  type: '',
  supertype: '',
};

export const destinationFlowSlice = createSlice({
  name: 'destinationFlow',
  initialState,
  reducers: {
    setDestinationFlowState(state, action: PayloadAction<{}>) {
      state.editing = action.payload.editing;
      state.id = action.payload.id;
      state.type = action.payload.type;
      state.supertype = action.payload.supertype;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.destinationFlow
      };
    });
  }
});

export const { setDestinationFlowState } = destinationFlowSlice.actions;

export default destinationFlowSlice.reducer;
