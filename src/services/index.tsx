/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, January 20th 2024, 4:59:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@/components/Error/ErrorUtils';

type QueryHandlerprops = {
  query: any;
  payload: any;
  successCb: (data: any) => void;
  errorCb: (error: any) => void;
};

export const queryHandler = async ({ query, payload, successCb, errorCb }: QueryHandlerprops) => {
  try {
    const result = await query(payload).unwrap();

    if (hasErrorsInData(result)) {
      const traceError = getErrorsInData(result);
      errorCb(traceError);
    } else {
      successCb(result);
    }
  } catch (error) {
    const errors = getErrorsInErrorObject(error);
    const { message = 'unknown' } = errors || {};
    errorCb(message);
  }
};
