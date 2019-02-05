import moment from 'moment';
import { mySettings } from './electronInterface';
import string from './../lang';

const language = mySettings.language;
const { momentLocales } = string;

moment.locale(language, {
  months: momentLocales.months.split('_'),
  monthsShort: momentLocales.monthsShort.split('_'),
  monthsParseExact: true,
  weekdays: momentLocales.weekdays.split('_'),
  weekdaysShort: momentLocales.weekdaysShort.split('_'),
  weekdaysMin: momentLocales.weekdaysMin.split('_'),
  weekdaysParseExact: true,
  relativeTime: momentLocales.relativeTime
});

const getTimeLocal = time => {
  const timeUTC = moment.utc(time);
  return moment(timeUTC).local();
};

export const defineTimeByToday = time => {
  const timeLocal = getTimeLocal(time);
  const todayStartTime = moment().endOf('day');
  const timeStartLocal = getTimeLocal(time).endOf('day');

  const diffDays = todayStartTime.diff(moment(timeStartLocal), 'days');
  if (diffDays < 1) {
    return moment(timeLocal).format('h:mm A');
  } else if (diffDays < 2) {
    return moment(timeLocal).format(`[${momentLocales.yesterdayText}]`);
  } else if (diffDays < 7) {
    return moment(timeLocal).format('dddd');
  }
  return moment(timeLocal).format('MMM DD');
};

export const defineLargeTime = time => {
  return moment(getTimeLocal(time)).format(
    `ddd, D MMM YYYY [${momentLocales.atText}] h:mm A`
  );
};

export const defineLastDeviceActivity = time => {
  return moment(getTimeLocal(time)).fromNow();
};

export const parseRateLimitBlockingTime = secondsString => {
  let seconds = Number(String(secondsString));
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  return `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}min` : ''}`;
};
