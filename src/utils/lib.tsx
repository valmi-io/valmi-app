// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import { HOUR, MIN } from '../content/SyncFlow/Schedule/scheduleManagement';

export const stringAvatar = (name: string) => {
  return {
    children: `${name.split(' ')[0][0]}`
  };
};

export const capitalizeFirstLetter = (str) => {
  return (
    str !== '' &&
    str &&
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  );
};

export const checkIfPropExistsInObject = (obj, prop) => {
  return obj && obj.hasOwnProperty([prop]) ? true : false;
};

export const convertDurationToMinutesOrHours = (milliseconds) => {
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (hours >= 1) {
    return hours + ' ' + capitalizeFirstLetter(HOUR) + 's';
  }
  return minutes + ' ' + capitalizeFirstLetter(MIN) + (minutes > 1 ? 's' : '');
};

export const convertUTCDateToLocalDate = (date) => {
  const newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
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
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

export const signOutUser = (authStorage, dispatch, router) => {
  //dispatch(resetStore());
  authStorage.destroy();
  router.replace('/login');
  // router.push('/login');
};

export const splitNumberByCommas = (number) => {
  return number.toLocaleString();
};
