import moment from 'moment';

export const getLastNthDate = (n: number) => {
  return moment().subtract(n, 'days').format('DD-MM-YYYY');
};
