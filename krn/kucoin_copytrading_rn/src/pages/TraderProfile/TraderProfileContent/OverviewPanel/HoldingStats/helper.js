export const getScatterXLabelByLabelValue = (value, _t) => {
  const map = {
    1000: _t('6aaad199cbab4000a436', {num: 1}),
    2000: _t('c5e9e3712e584000a2b7', {num: 1}),
    3000: _t('c5e9e3712e584000a2b7', {num: 24}),
    4000: _t('8bed57fe463e4000a194', {num: 5}),
    5000: _t('8bed57fe463e4000a194', {num: 15}),
  };
  return map[value];
};

const timeSlots = [
  {name: '1分钟', durationMs: 60 * 1000, scale: 1000},
  {name: '1小时', durationMs: 60 * 60 * 1000, scale: 1000},
  {name: '24小时', durationMs: 24 * 60 * 60 * 1000, scale: 1000},
  {name: '5天', durationMs: 5 * 24 * 60 * 60 * 1000, scale: 1000},
  {name: '15天', durationMs: 15 * 24 * 60 * 60 * 1000, scale: 1000},
  {name: '180天', durationMs: 180 * 24 * 60 * 60 * 1000, scale: 1000},
];

export const getScaledValue = timestamp => {
  if (!timestamp) return;
  let totalDuration = 0;

  for (let i = 0; i < timeSlots.length; i++) {
    const currentSlot = timeSlots[i];
    const nextSlot = timeSlots[i + 1] || {};

    totalDuration += currentSlot.durationMs;

    if (!nextSlot || timestamp < totalDuration + nextSlot.durationMs) {
      const slotOffset = timestamp - totalDuration + currentSlot.durationMs;
      const slotScaleValue =
        (slotOffset / nextSlot.durationMs) * nextSlot.scale;
      const scaleValue = (i + 1) * currentSlot.scale + slotScaleValue;
      return scaleValue;
    }
  }
};

/**
 * transform continuous to scatter ratio value
 * @param time, millisecond
 * @param max, xAxis max value
 * @returns {*}, transformed value
 */
export const transformX = (time, max) => {
  const number = Number(time);
  const M1 = 60 * 1000;
  const H24 = M1 * 60 * 24;
  const D5 = H24 * 5;
  const D15 = H24 * 15;
  const getX = (left, right, basis) => {
    const SPAN = right - left;
    const PASS = number - left;
    const value = (PASS / SPAN) * 1000;
    return Math.ceil(value) + basis;
  };
  if (number < M1) {
    return getX(0, M1, 0);
  }
  if (M1 <= number && number < H24) {
    return getX(M1, H24, 1000);
  }
  if (H24 <= number && number < D5) {
    return getX(H24, D5, 2000);
  }
  if (D5 <= number && number < D15) {
    return getX(D5, D15, 3000);
  }
  return getX(D15, max, 4000);
};

/**
 * 根据毫秒时间戳返回时间差描述。
 * 如果时间差未满1天，返回“x小时y分钟”的格式；
 * 如果超过1天，则返回“x天y小时”的格式。
 *  未满 1分钟 返回 0 分钟 x 秒
 *
 * @param {number} timestamp 毫秒时间戳
 * @return {string} 时间差描述
 */
export const formatDuration = (timestamp, _t) => {
  // 计算各时间单位
  const days = Math.floor(timestamp / (1000 * 60 * 60 * 24)); // 计算天数
  const hours = Math.floor(
    (timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  ); // 计算小时数
  const minutes = Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60)); // 计算分钟数
  const seconds = Math.floor((timestamp % (1000 * 60)) / 1000); // 计算秒数

  // 根据不同情况返回时间格式
  if (days > 0) {
    // `${days} 天 ${hours} 小时`;
    return _t('7bcfebad06824000a979', {
      day: days,
      hour: hours,
    });
  } else if (hours > 0) {
    //  小时 ${minutes} 分钟`;
    return _t('4208bb0ee8274000a413', {
      hour: hours,
      minute: minutes,
    });
  } else if (minutes > 0) {
    // 分钟 ${seconds} 秒`;
    return _t('b916d25934984000ad4c', {
      minute: minutes,
      second: seconds,
    });
  } else {
    // `0 分钟 ${seconds} 秒`;
    return _t('b916d25934984000ad4c', {
      minute: 0,
      second: seconds,
    });
  }
};
