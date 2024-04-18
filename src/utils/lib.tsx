// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { setCookie } from '@/lib/cookies';
import { HOUR, MIN } from '@content/SyncFlow/Schedule/scheduleManagement';

import { v4 as uuidv4 } from 'uuid';

export const stringAvatar = (name: string) => {
  return {
    children: `${name.split(' ')[0][0]}`
  };
};

export const capitalizeFirstLetter = (str) => {
  return typeof str !== 'object' && str !== '' && str && str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const checkIfPropExistsInObject = (obj, prop) => {
  return obj && obj.hasOwnProperty([prop]) ? true : false;
};

export const convertDurationToMinutesOrHours = (milliseconds) => {
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (hours >= 1) {
    return hours + ' ' + capitalizeFirstLetter(HOUR) + (hours > 1 ? 's' : '');
  }
  return minutes + ' ' + capitalizeFirstLetter(MIN) + (minutes > 1 ? 's' : '');
};

export const convertUTCDateToLocalDate = (date, offset = true) => {
  const newDate = new Date(date);

  if (offset) {
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
  }

  return newDate;
};

export const getTimeDifference = (fromDate, toDate) => {
  const runAt = new Date(fromDate);
  const currentDate = new Date(toDate);

  // Calculate the time difference in milliseconds
  const timeDiff = currentDate.getTime() - runAt.getTime();

  // Convert time difference to hours, minutes, and seconds
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  return `${hours} hrs ${minutes} min ${seconds} s`;
};

export const isObject = (value) => {
  return typeof value === 'object' && value !== null && !isArray(value);
};

export const isObjectEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

export const connectorTypes = {
  SRC: 'SRC',
  DEST: 'DEST',
  SOURCE: 'Warehouse',
  DESTINATION: 'Destination'
};

export const getConnectorImage = (connectorType) => {
  return `/connectors/${connectorType.toLowerCase()}.svg`;
};

export const signOutUser = async (router) => {
  try {
    setCookie('AUTH', '', {
      expires: new Date(0),
      sameSite: 'strict',
      path: '/'
    });
  } catch (err) {
  } finally {
    router.replace('/login');
  }
};

export const splitNumberByCommas = (number) => {
  return number.toLocaleString();
};

export function isTrue(val) {
  try {
    return !!JSON.parse(val);
  } catch {
    return false;
  }
}

export function getBaseRoute(wid: string) {
  return `/spaces/${wid}`;
}

export function getRoute(pathname: string) {
  return pathname?.split('/').slice(-1)[0];
}

export const getBrowserRoute = (path: string) => {
  const route = path.split('/');

  const widIndex = route.indexOf('[wid]');
  if (widIndex !== -1) {
    return { route: route[widIndex + 1], subRoute: route[widIndex + 2] };
  }
  return { route: '', subRoute: '' };
};

export const isDataEmpty = (data: any) => {
  return (!data.ids || data.ids.length === 0) && (!data.entities || Object.entries(data.entities ?? {}).length === 0);
};

export const generateUUID = () => {
  return uuidv4();
};

export const isArray = (val) => {
  return Array.isArray(val);
};

export const copy = (val) => {
  navigator.clipboard.writeText(JSON.stringify(val, null, 4));
};

export const getFormattedUTC = (date: any, offset = true) => {
  const timestamp = convertUTCDateToLocalDate(new Date(date), offset);

  const timestampDisplay =
    timestamp.toDateString() +
    ' ' +
    timestamp.getHours().toString().padStart(2, '0') +
    ':' +
    timestamp.getMinutes().toString().padStart(2, '0');
  return timestampDisplay;
};

export function flattenObjectValuesToArray<T>(obj: Record<string, T[]>): T[] {
  if (!obj) return [];
  const result: T[] = [];

  Object.values(obj).forEach((value) => {
    result.push(...value);
  });

  return result;
}

export const getCombinedConnectors = (data) => {
  if (data && data.SRC && data.DEST) {
    return [...data.SRC, ...data.DEST];
  }
};

export function deepFlattenToObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      Object.assign(acc, deepFlattenToObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}
