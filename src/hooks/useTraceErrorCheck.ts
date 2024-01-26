/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, October 17th 2023, 2:40:29 pm
 * Author: Nagendra S @ valmi.io
 */

import { isObject } from '@utils/lib';

export const useTraceErrorCheck = (data: any) => {
  let traceError = null;

  if (data && isObject(data)) {
    if (data.hasOwnProperty('trace')) {
      const trace = data['trace'];

      if (trace.hasOwnProperty('error')) {
        traceError =
          trace['error']['message'] ||
          trace['error']['stack_trace'] ||
          'Unknown Error';
      }
    }
  }

  return traceError;
};
