//@ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, January 24th 2024, 1:17:53 pm
 * Author: Nagendra S @ valmi.io
 */

import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { PayloadAction } from '@reduxjs/toolkit';

type OAuthState = {
  editing: boolean | null | undefined;
};

const initialState: OAuthState = {
  editing: false
};

export const oAuthFlowSlice = createSlice({
  name: 'oAuthFlow',
  initialState,
  reducers: {
    setOAuthFlowState(state, action: PayloadAction<{}>) {
      state.editing = action.payload.editing;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.oAuthFlow
      };
    });
  }
});

export const { setOAuthFlowState } = oAuthFlowSlice.actions;

export default oAuthFlowSlice.reducer;
