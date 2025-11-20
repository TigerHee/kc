/**
 * Owner: mike@kupotech.com
 */
import { NOW, WEEKS } from './config';
import { localDateTimeFormat } from 'Bot/helper';
import moment from 'moment';
import { _t } from 'Bot/utils/lang';

/**
 * @description: 首次下单显示处理函数
 * @param {array} time
 * @return {*}
 */
export const firstOrderTimeFormat = ({ executeTime, dayOfWeek, interval }) => {
  if (!executeTime || !executeTime.length || executeTime?.[0] === NOW) {
    return _t('auto.noworder');
  }

  let [h, m] = executeTime;
  h = (`0${ h}`).slice(-2);
  m = (`0${ m}`).slice(-2);

  let dateSuffix = '';
  // 选周 定投日
  if (isSelectWeek(interval)) {
    dateSuffix = formatDayOfWeek(dayOfWeek);
  } else {
    // 今天或者明天
    const diff = moment({ hour: h, minute: m }).valueOf() - Date.now();
    dateSuffix = _t(diff >= 0 ? 'auto.today' : 'tomorrow');
  }
  return `${dateSuffix} ${_t('auto.todayorder', { h, m })}`;
};

/**
 * @description: value to label
 * @param {*} day
 * @return {*}
 */
export const formatDayOfWeek = day => {
  day = Array.isArray(day) ? day[0] : day;
  const weeks = WEEKS();
  return weeks.find(week => week.value === Number(day))?.label;
};
/**
 * @description: 获取今天星期
 * @return {*}
 */
export const getCurrentDayOfWeek = () => {
  const day = new Date().getDay();
  if (day === 0) {
    return 7;
  }
  return day;
};
export const getDayOfWeek = (val) => {
  return Array.isArray(val) ? val[0] : val;
};
/**
 * @description: 是否选择的周
 * @param {*} interval
 * @return {*}
 */
export const isSelectWeek = interval => {
  interval = Array.isArray(interval) ? interval[0] : interval;
  return ['W1', 'W2'].includes(interval);
};

/**
 * @description: 格式化 下次投资的时间
 * @param {array} executeTime
 * @param {array} dayOfWeek
 * @param {array} interval
 * @return {dateTime}
 */
export const getFirstTimeInvest = ({ executeTime, dayOfWeek, interval }) => {
  let [h, m] = executeTime;
  h = (`0${ h}`).slice(-2);
  m = (`0${ m}`).slice(-2);
  let dateTime;
  const diff = moment({ hour: h, minute: m }).valueOf() - Date.now();
  // 选周 定投日
  if (isSelectWeek(interval)) {
    const selectDay = getDayOfWeek(dayOfWeek);
    const currentDay = getCurrentDayOfWeek();

    let addDays = 0;
    let diffDays = 0;
    if (selectDay > currentDay) {
      addDays = selectDay - currentDay;
    } else if (selectDay === currentDay) {
      // 选择的当天, 但是时间点在当前时间之前, 那也是下周
      addDays = diff >= 0 ? 0 : 7;
    } else if (selectDay < currentDay) {
      diffDays = currentDay - selectDay;
      addDays = 7;
    }
    // 当前星期之前的天, 就加7,即下周这个时候
    dateTime = moment({ hour: h, minute: m })
      .subtract(diffDays, 'days')
      .add(addDays, 'days')
      .valueOf();
  } else {
    // 今天或者明天
    dateTime = moment({ hour: h, minute: m })
      .add(diff >= 0 ? 0 : 1, 'days')
      .valueOf();
  }
  return dateTime;
};
/**
 * @description: 格式化 下次投资的时间
 * @param {array} executeTime
 * @param {array} dayOfWeek
 * @param {array} interval
 * @return {localdateTime} // 时间里面含有 逗号分隔
 */
export const formatFirstTimeInvest = ({ executeTime, dayOfWeek, interval }) => {
  if (!executeTime || !executeTime.length || executeTime?.[0] === NOW) {
    return _t('nowafterrun');
  }
  const dateTime = getFirstTimeInvest({ executeTime, dayOfWeek, interval });
  return localDateTimeFormat(dateTime, { second: undefined, hourCycle: 'h23' });
};
/**
 * @description:格式化提交, 转换成毫秒
 * @param {array} executeTime
 * @param {array} dayOfWeek
 * @param {array} interval
 * @return {datetimediff}
 */
export const formatExecuteTime = ({ executeTime, dayOfWeek, interval }) => {
  if (executeTime?.[0] !== NOW) {
    // 传递当前时间距离下次定投的时间差值
    const dateTime = getFirstTimeInvest({ executeTime, dayOfWeek, interval });
    return moment(dateTime).valueOf() - Date.now();
  }
  // 立刻下单 传空
  return null;
};

/**
 * @description: 检查 定投日如果不是今天, 首次下单时间就不能选择立刻下单, 就设置当前时间最近的5倍时间
 * @param {array} executeTime 首次下单时间
 * @param {array} dayOfWeek  定投日
 * @return {object}
 */
export const checkExecuteTime = ({ executeTime = [], dayOfWeek = [] }) => {
  if (getCurrentDayOfWeek() !== getDayOfWeek(dayOfWeek) && executeTime[0] === NOW) {
    const date = new Date();
    let hour = date.getHours();
    let minites = date.getMinutes();

    const rest = date.getMinutes() % 5;
    if (rest !== 0) {
      minites = date.getMinutes() - rest + 5;
      if (minites >= 60) {
        // 可能形成 17: 60这样的时间
        minites = 0;
        hour += 1;
        hour = hour >= 24 ? 0 : hour;
      }
    }
    return {
      dayOfWeek,
      executeTime: [hour, minites],
    };
  }
  return { dayOfWeek };
};
