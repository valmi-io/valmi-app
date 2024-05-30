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
    const diffDays = now.diff(date, 'days');
    const diffHours = now.diff(date, 'hours');

    if (isNaN(diffDays)) {
      return '--';
    } else if (diffDays === 0) {
      return diffHours + ' hr ago';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else {
      return diffDays + ' days ago';
    }
  }
};
