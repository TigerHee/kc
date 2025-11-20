/**
 * Owner: garuda@kupotech.com
 * 计算方法以及校验方法
 */
import { map } from 'lodash';

import { lessThan, greaterThan, minus } from 'utils/operation';

// 校验输入杠杆值
export const validateLeverage = ({ _t, value, minLeverage, maxLeverage }) => {
  // eslint-disable-next-line eqeqeq
  if (value == 0) {
    return Promise.reject(_t('leverage.greaterThan.zero'));
  }

  if (!+value) {
    return Promise.reject(_t('reducer.margin.input.required'));
  }

  if (lessThan(value)(minLeverage)) {
    return Promise.reject(_t('leverage.lessThan.min', { leverage: minLeverage }));
  }

  if (greaterThan(value)(maxLeverage)) {
    return Promise.reject(_t('leverage.greaterThan.max', { leverage: maxLeverage }));
  }

  return Promise.resolve();
};

// marks生成
export const sliderMarks = (maxLex, isZero) => {
  const _marks = { 1: '1x' };
  let isMake = false;

  if (isZero) {
    _marks[0] = `${0}x`;
  }

  if (maxLex && maxLex % 3 === 0) {
    isMake = true;
    const step = maxLex / 3;
    map(Array(3), (item, index) => {
      const mark = step * (index + 1);
      _marks[mark] = `${mark}x`;
    });

    return _marks;
  }

  if (maxLex && maxLex % 4 === 0) {
    isMake = true;
    const step = maxLex / 4;
    map(Array(4), (item, index) => {
      const mark = step * (index + 1);
      _marks[mark] = `${mark}x`;
    });

    return _marks;
  }

  if (maxLex && maxLex % 5 === 0) {
    isMake = true;
    const step = maxLex / 5;
    map(Array(5), (_, index) => {
      const mark = step * (index + 1);
      _marks[mark] = `${mark}x`;
    });
    return _marks;
  }

  // 如果上面条件都不满足，开启一个兜底分割，按 3 来分割
  if (!isMake) {
    const remainderValue = maxLex % 3;
    if (remainderValue >= maxLex) {
      _marks[remainderValue] = `${remainderValue}x`;
      return _marks;
    }
    const step = (maxLex - remainderValue) / 3;
    map(Array(3), (item, index) => {
      const mark = step * (index + 1);
      if (greaterThan(minus(maxLex)(mark))(1)) {
        _marks[mark] = `${mark}x`;
      }
    });
    _marks[maxLex] = `${maxLex}x`;
    console.log('_marks --->', _marks);
  }

  return _marks;
};
