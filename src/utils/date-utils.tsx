import moment from 'moment';

export const getLastNthDate = (n: number) => {
  return moment().subtract(n, 'days').format('DD-MM-YYYY');
};

export const getTimeAt = (date: Date) => {
  //@ts-ignore
  if (date === null || date === '') {
    return '--';
  } else return moment(date).format('YYYY-MM-DD');
};

export const getTimeAgo = (date: Date | '') => {
  const now = moment();
  if (date === null || date === '') {
    return '--';
  } else {
    const diff = now.diff(date, 'days');

    if (isNaN(diff)) {
      return '--';
    } else if (diff === 0) {
      return 'Today';
    } else if (diff === 1) {
      return '1 day ago';
    } else {
      return diff + ' days ago';
    }
  }
};
