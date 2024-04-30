/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Saturday, January 20th 2024, 4:59:31 pm
 * Author: Nagendra S @ valmi.io
 */

import { getErrorsInData, getErrorsInErrorObject, hasErrorsInData } from '@/components/Error/ErrorUtils';
import axios from 'axios';

type QueryHandlerprops = {
  query: any;
  payload: any;
  successCb: (data: any) => void;
  errorCb: (error: any) => void;
};

type TPostRequestHandlerprops = {
  route: string;
  url: string;
  method?: string;
  payload: any;
  successCb: (data: any) => void;
  errorCb: (error: any) => void;
};

// rtk query handler
export const queryHandler = async ({ query, payload = {}, successCb, errorCb }: QueryHandlerprops) => {
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

// http handler
export const httpPostRequestHandler = async ({
  route, // nextjs api endpoint - /api
  url, // valmi-app-backend endpoint
  method = 'POST',
  payload = {},
  errorCb,
  successCb
}: TPostRequestHandlerprops) => {
  try {
    const response = await axios.post(route, {
      url,
      method,
      data: payload
    });
    const result = response?.data ?? {};
    if (hasErrorsInData(result)) {
      const traceError = getErrorsInData(result);
      errorCb(traceError);
    } else {
      successCb(result);
    }
  } catch (error: any) {
    const errors = getErrorsInErrorObject(error);
    const { message = '' } = errors || {};
    errorCb(message);
  }
};
