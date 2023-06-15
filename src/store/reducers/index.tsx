/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

import { user } from './user';
import { connectionFlow } from './connectionFlow';
import { syncFlow } from './syncFlow';
import { appFlow } from './appFlow';

const rootReducer = combineReducers({
  [appFlow.name]: appFlow.reducer,
  [user.name]: user.reducer,
  [connectionFlow.name]: connectionFlow.reducer,
  [syncFlow.name]: syncFlow.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
