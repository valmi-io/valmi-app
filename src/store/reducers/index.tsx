/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { combineReducers } from '@reduxjs/toolkit';

import { apiSlice } from '@store/api/apiSlice';
import { connectionFlow } from '@store/reducers/connectionFlow';
import { syncFlow } from '@store/reducers/syncFlow';
import { appFlow } from '@store/reducers/appFlow';
import { streamFlowSlice } from '@store/reducers/streamFlow';
import { destinationFlowSlice } from '@store/reducers/destinationFlow';
import { trackFlowSlice } from './trackFlow';
import { connectionDataFlow } from '@/store/reducers/connectionDataFlow';

const rootReducer = combineReducers({
  [appFlow.name]: appFlow.reducer,
  [connectionFlow.name]: connectionFlow.reducer,
  [syncFlow.name]: syncFlow.reducer,
  [streamFlowSlice.name]: streamFlowSlice.reducer,
  [connectionDataFlow.name]: connectionDataFlow.reducer,

  [destinationFlowSlice.name]: destinationFlowSlice.reducer,
  [trackFlowSlice.name]: trackFlowSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
