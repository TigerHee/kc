/**
 * Owner: jesse.shao@kupotech.com
 */
import moment from 'moment';
import { toNumber, isEmpty, isObject, isArray, map, last, orderBy } from 'lodash';

/**
 * 返回 格式化时区后的数字型时间戳
 * @param {*} time 需要格式化的时间 默认 undefined
 * @param {*} utc 时区 默认是 0 时区
 *
 * @return Number
 */
export const getUtcUnixNumber = (time = undefined, utc = 0) => {
  if (!moment(time).isValid()) {
    return undefined;
  }
  return toNumber(
    moment(time)
      .utcOffset(utc)
      .format('x'),
  );
};

/**
 * 将数组array分成长度为subGroupLength的小数组并返回新数组
 * @param {*} array
 * @param {*} subGroupLength
 * @return []
 */
export const group = (array, subGroupLength) => {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
};

/**
 * 获取日历数据
 * @param {*} param0 start 开始时间， end 结束时间
 *
 * @returns []
 */
export const getCalendarData = ({ start, end }) => {
  if (!moment(start).isValid()) {
    return [];
  }
  // 比较相差天数
  const day = moment.utc(end).diff(moment.utc(start), 'days');

  // 获取天数
  const data = Array.from({ length: day + 1 || 0 }, (i, index) => {
    const startTime = moment
      .utc(start)
      .startOf('day')
      .add(index, 'days');
    const startUnix = startTime.valueOf();
    const endTime = moment
      .utc(start)
      .endOf('day')
      .add(index, 'days');
    const endUnix = endTime.valueOf();
    return {
      startUnix: toNumber(startUnix),
      endUnix: toNumber(endUnix),
      startText: startTime.format('YYYY/MM/DD HH:mm:ss'),
      endText: endTime.format('YYYY/MM/DD HH:mm:ss'),
      weekText: startTime.format('ddd'),
      text: startTime.format('DD'),
    };
  });
  // 按五个一组分为二维数组
  const calendarData = group(data, 6);
  return calendarData;
};
/**
 * 格式化场次时间信息 可以用于格式化活动配置和单场竞猜场次的时间
 * @param {*} activity  活动信息
 *
 */
export const formatDateSchedule = (activity = {}) => {
  let inProcessing = false; // 本轮竞猜是否进行中
  let notStart = false; // 活动是否整体开始
  let isEnd = false; // 活动是否整体结束
  let startText = undefined; // 开始格式化
  let endText = undefined; // 结束格式化
  let nowText = undefined; // 当前格式化
  let closeTimeText = null; // 竞猜价格场次提醒时间
  if (!isEmpty(activity) && isObject(activity)) {
    const { start: activityStart, end: activityEnd, now: serverTime, closeTime } = activity; // 活动的整体开始时间 和 结束时间
    inProcessing = serverTime <= activityEnd && serverTime >= activityStart; // 本轮竞猜是否进行中
    notStart = serverTime < activityStart; // 活动是否整体开始
    isEnd = serverTime > activityEnd; // 活动是否整体结束
    startText = moment.utc(activityStart).format('YYYY-MM-DD HH:mm:ss');
    endText = moment.utc(activityEnd).format('YYYY-MM-DD HH:mm:ss');
    nowText = moment.utc(serverTime).format('YYYY-MM-DD HH:mm:ss');
    closeTimeText = closeTime ? moment.utc(closeTime).format('HH:mm:ss') : undefined;
  }
  return {
    ...(activity || {}),
    inProcessing,
    notStart,
    isEnd,
    startText,
    endText,
    nowText,
    closeTimeText,
    bigPrize: (activity?.prizes || []).find(i => i.bizType === 'big_award') || {},
    luckyPrize: (activity?.prizes || []).find(i => i.bizType === 'sunshine_award') || {},
  };
};

/**
 * 获取模块Ids
 * @param {*} scheduleList
 */
export const getScheduleIds = (scheduleList = []) => {
  let data = [];
  if (!isEmpty(scheduleList) && isArray(scheduleList)) {
    data = map(scheduleList, ({ id }) => id);
  }
  return data;
};

/**
 * 格式化模块场次数组信息
 * @param {*} scheduleList
 */
export const formatScheduleList = (scheduleList = []) => {
  let data = [];
  if (!isEmpty(scheduleList) && isArray(scheduleList)) {
    data = map(scheduleList, i => formatDateSchedule(i));
  }
  return orderBy(data, i => i.start);
};

/**
 *
 * @param {*} searchUnix 搜索时间戳
 * @param {*} scheduleList 竞猜模块数组
 */
export const getScheduleIdBySearchUnix = (searchUnix, scheduleList = [], { start, end }) => {
  const inProcessingSchedule = scheduleList.find(({ inProcessing }) => inProcessing); // 进行中的场次
  let id;
  if (!isEmpty(inProcessingSchedule)) {
    id = inProcessingSchedule?.id;
  } else {
    let targetData = orderBy(scheduleList, i => i.start).find(({ end, start }) => {
      return start <= searchUnix && end >= searchUnix;
    });
    let targets = {};
    if (searchUnix < start) {
      // 未开始
      targets = scheduleList[0];
    } else if (searchUnix > end) {
      targets = last(scheduleList);
    } else {
      targets = targetData || {};
    }
    const target = targets ? targets : {};
    id = target?.id || scheduleList[0]?.id;
  }

  return id;
};

/**
 * 获取0时区格式化时间
 * @param {传入时间} time
 * @param {格式化格式} format
 */
export const getUtcZeroTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (moment(time).isValid()) {
    return moment.utc(time).format(format);
  }
  return '';
};
