/**
 * Owner: mike@kupotech.com
 */
import moment from 'moment';
/**
 * @description: 补充套利中间时间的数据
 * @param {array} data
 * @param {array} hourKline
 * @return {array}
 */
export const makeUpData = (data = [], hourKline = []) => {
  const [from, to] = data;
  const fromTime = moment(from.time).valueOf();
  const toTime = moment(to.time).valueOf();
  const makeUp = [];
  hourKline.forEach((hour) => {
    const time = moment(hour.time).valueOf();
    if (fromTime <= time && toTime >= time) {
      makeUp.push({
        time: hour.time,
        value: hour.value,
      });
    }
  });
  return makeUp;
};

export const styleToString = (obj) => {
  const strArr = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      strArr.push(`${key}:${obj[key]}`);
    }
  }
  return strArr.join(';');
};

export const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
  day: '2-digit',
  month: '2-digit',
  year: undefined,
  second: undefined,
};
