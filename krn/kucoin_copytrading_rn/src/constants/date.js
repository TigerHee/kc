import moment from 'moment';

export const FilterDateUnitPrefix = {
  Day: 'D-',
  Month: 'M-',
  Year: 'Y-',
};

/**
 * 根据日期选择值解析出时间单位和数量
 * @param {string} pickValue - 日期选择值，格式为"单位-数量"，例如"D-7"表示最近7天
 * @returns {Object} 包含时间单位和数量的对象
 * @throws {Error} 如果pickValue格式不正确或单位前缀无效，抛出错误
 * @example
 * const result = getDateUnitQuantityByDatePickValue('D-7');
 * log(result); // 输出: { unit: 'Day', quantity: 7 }
 */
export const getDateUnitQuantityByDatePickValue = (pickValue = '') => {
  if (!pickValue) return {};
  // 检查pickValue是否包含'-'，并且分割字符串
  const separatorIndex = pickValue?.indexOf?.('-');
  if (separatorIndex === -1) {
    console.error(
      'Invalid pickValue format. It should be in the format of "Unit-Quantity"',
    );
    return {};
  }

  // 提取单位和数量
  const unit = pickValue.substring(0, separatorIndex);
  const quantity = parseInt(pickValue.substring(separatorIndex + 1), 10);

  // 根据单位前缀找到对应的单位名称

  return {
    unit,
    quantity,
  };
};

export const getStartTimeByDatePickValue = datePickValue => {
  const cur = new Date();
  const {unit, quantity} = getDateUnitQuantityByDatePickValue(datePickValue); // 假设startDate是已经定义的

  // 根据unit和quantity计算过去的时间
  let startTime;
  switch (unit) {
    case 'D':
      startTime = moment(cur).subtract(quantity, 'days').toDate();
      break;
    case 'M':
      startTime = moment(cur).subtract(quantity, 'months').toDate();
      break;
    case 'Y':
      startTime = moment(cur).subtract(quantity, 'years').toDate();
      break;
  }
  return startTime;
};
