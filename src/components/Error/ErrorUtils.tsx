/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 10:25:52 am
 * Author: Nagendra S @ valmi.io
 */

import { checkIfPropExistsInObject } from '../../utils/lib';

export const hasErrorsInData = (data: any) => {
  // checking if data has any trace errors.
  if (data.hasOwnProperty('trace')) return true;
  return false;
};

export const getErrorsInData = (data: any) => {
  // trace error
  if (data.hasOwnProperty('trace')) {
    return data['trace'].hasOwnProperty('error')
      ? data['trace']['error']['message']
      : data['trace']['error']['stack_trace'];
  }
  return 'TRACE_ERROR';
};

export const getErrorsInErrorObject = (error: any) => {
  if (error && error.hasOwnProperty('name')) {
    if (error.name === 'AbortError') {
      const errorMessage = checkIfPropExistsInObject(error, 'message')
        ? error.message
        : error.name;
      return {
        status: errorMessage,
        message: errorMessage
      };
    }
  } else if (error && checkIfPropExistsInObject(error, 'data')) {
    let errorMessage = extractErrorFromDataObject(error.data);
    return {
      status: error.status ? error.status : 'unknown status code',
      message: errorMessage
    };
  } else if (error && checkIfPropExistsInObject(error, 'error')) {
    return {
      status: error.status ? error.status : 'uknown status code',
      message: error.error
    };
  }
  return {
    status: 'unknown status code',
    message: 'Unknown error'
  };
};

const extractErrorFromDataObject = (data: any): any => {
  if (typeof data === 'string') {
    return data;
  } else if (Array.isArray(data)) {
    if (data.length > 0) {
      return extractErrorFromDataObject(data[0]);
    }
  } else if (typeof data === 'object' && data !== null) {
    if ('msg' in data) {
      return extractErrorFromDataObject(data['msg']);
    } else if ('message' in data) {
      return extractErrorFromDataObject(data['message']);
    } else {
      const keys = Object.keys(data);
      if (keys.length > 0) {
        const firstKey = keys[0];
        return extractErrorFromDataObject(data[firstKey]);
      }
    }
  }

  return 'unknown error'; // If no string value is found
};
