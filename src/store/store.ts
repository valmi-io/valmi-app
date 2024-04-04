/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, June 14th 2023, 3:18:05 pm
 * Author: Nagendra S @ valmi.io
 */

import { createWrapper } from 'next-redux-wrapper';

import { configureStore, ThunkAction, Action, AnyAction, createAsyncThunk } from '@reduxjs/toolkit';

import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import storage from 'redux-persist/lib/storage';

import { apiSlice } from '@store/api/apiSlice';
import rootReducer from '@store/reducers';

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true
  });

const reducerProxy = (state: any, action: AnyAction) => {
  if (action.type === 'RESET_STORE') {
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

export const makeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return makeConfiguredStore();
  } else {
    // we need it only on client side

    const persistConfig = {
      key: 'app',
      blacklist: [apiSlice.reducerPath],
      whitelist: [
        'appFlow',
        'user',
        'connectionFlow',
        'connectionDataFlow'
        // 'syncFlow'
      ], // make sure it does not clash with server keys,

      storage
    };

    const persistedReducer = persistReducer(persistConfig, reducerProxy);
    let store: any = configureStore({
      reducer: persistedReducer,
      devTools: process.env.NODE_ENV !== 'production',
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
          }
        }).concat(apiSlice.middleware)
    });

    store.__persistor = persistStore(store);

    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = ReturnType<AppStore['dispatch']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);
