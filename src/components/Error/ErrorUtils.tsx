/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, May 2nd 2023, 10:25:52 am
 * Author: Nagendra S @ valmi.io
 */
import { checkIfPropExistsInObject, isObjectEmpty } from '@utils/lib';

export const hasErrorsInData = (data: any) => {
  // checking if data has any trace errors.
  if (data && data.hasOwnProperty('trace')) return true;
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
      const errorMessage = checkIfPropExistsInObject(error, 'message') ? error.message : error.name;
      return {
        status: errorMessage,
        message: errorMessage
      };
    }
  } else if (error && checkIfPropExistsInObject(error, 'data')) {
    let errorMessage = extractErrorFromDataObject(error.data);
    return {
      status: error.status ? error.status : '',
      message: errorMessage
    };
  } else if (error && checkIfPropExistsInObject(error, 'error')) {
    return {
      status: error.status ? error.status : '',
      message: error.error
    };
  }
  return {
    status: '',
    message: ''
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
      if (!isObjectEmpty(data)) {
        const keys = Object.keys(data);
        const firstKey = keys[0];
        return extractErrorFromDataObject(data[firstKey]);
      }
    }
  }

  return 'unknown error'; // If no string value is found
};

export const handleAxiosError = (error: any, errorCb: (err: string) => void) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx

    const errors = getErrorsInErrorObject(error.response);
    const { message = '' } = errors || {};
    errorCb(message);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js

    if (error.code === 'ECONNREFUSED') {
      errorCb('Connection refused by the server');
    } else {
      errorCb(error.toJSON().message ?? '');
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    errorCb(error?.message ?? '');
  }
};

export enum Error {
  Configuration = 'Configuration',
  AccessDenied = 'AccessDenied',
  Verification = 'Verification',
  Default = 'Default',
  Callback = 'Callback'
}

export const errorMap = {
  [Error.Configuration]:
    'There was a problem when trying to authenticate. Please contact us if this error persists. Unique error code: Configuration',
  [Error.AccessDenied]:
    'You do not have permission to sign in. Please contact us if this error persists. Unique error code: AccessDenied',
  [Error.Verification]:
    'The token has expired or has already been used. Please contact us if this error persists. Unique error code: Verification',
  [Error.Default]: 'Please contact us if this error persists. Unique error code: Verification',
  [Error.Callback]: 'ECON REFUSED. Please contact us if this error persists. Unique error code: Callback'
};
