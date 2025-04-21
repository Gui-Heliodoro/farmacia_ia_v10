import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatTimeAgo = (dateString: string): string => {
  return dayjs(dateString).fromNow();
};

export const formatDate = (dateString: string): string => {
  const date = dayjs(dateString);
  const now = dayjs();
  
  if (date.isSame(now, 'day')) {
    return date.format('HH:mm');
  } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return 'Yesterday ' + date.format('HH:mm');
  } else if (date.isSame(now, 'year')) {
    return date.format('MMM D, HH:mm');
  } else {
    return date.format('MMM D, YYYY HH:mm');
  }
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  if (start.isSame(end, 'day')) {
    return start.format('MMMM D, YYYY');
  } else if (start.isSame(end, 'month')) {
    return `${start.format('MMMM D')} - ${end.format('D, YYYY')}`;
  } else if (start.isSame(end, 'year')) {
    return `${start.format('MMMM D')} - ${end.format('MMMM D, YYYY')}`;
  } else {
    return `${start.format('MMMM D, YYYY')} - ${end.format('MMMM D, YYYY')}`;
  }
};