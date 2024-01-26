/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 5th 2023, 11:38:22 am
 * Author: Nagendra S @ valmi.io
 */

import { setAppState } from '@store/reducers/appFlow';

export const initialiseAppState = (dispatch, workspaceId) => {
  dispatch(
    setAppState({
      workspaceId: workspaceId,
      currentRoute: 'syncs'
    })
  );
};
