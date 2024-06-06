import moment from 'moment';
import 'moment-timezone';

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
  const dateIST = moment.utc(date);

  if (date === null || date === '') {
    return '--';
  } else {
    const diffDays = now.diff(date, 'days');

    if (isNaN(diffDays)) {
      return '--';
    } else if (diffDays < 1) {
      const diffMinutes = now.diff(dateIST, 'minutes');
      if (diffMinutes < 1) {
        return 'Just now';
      } else if (diffMinutes < 60) {
        return diffMinutes + ' mins ago';
      } else {
        return Math.floor(diffMinutes / 60) + ' hr ago';
      }
    } else if (diffDays === 1) {
      return '1 day ago';
    } else {
      return diffDays + ' days ago';
    }
  }
};
