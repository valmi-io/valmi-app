import moment from 'moment';

export const getLastNthDate = (n: number) => {
  return moment().subtract(n, 'days').format('DD-MM-YYYY');
};

export const getTimeAt = (date: Date) => {
  return moment(date).format('YYYY-MM-DD');
};

export const getTimeAgo = (date: Date | '') => {
  const now = moment();
  if (date === '') {
    return '--';
  } else {
    const diff = now.diff(date, 'days');

    if (diff === 0) {
      return 'Today';
    } else if (diff === 1) {
      return '1 day ago';
    } else {
      return diff + ' days ago';
    }
  }
};
