/**
 * Owner: willen@kupotech.com
 */
import { reduce, isNaN } from 'lodash';
import Decimal from 'decimal.js';
import { useResponsive } from '@kufox/mui';

export function transData(data, numInRow) {
  const len = data.length;
  const willAdd = len % numInRow ? numInRow - (len % numInRow) : 0;
  const _data = data.concat(new Array(willAdd));
  return reduce(
    _data,
    (pre, item, i) => {
      const curRow = Math.floor(i / numInRow);
      if (!pre[curRow]) {
        pre[curRow] = [];
      }
      pre[curRow].push(item);
      return pre;
    },
    [],
  );
}

// 乘
export const multiply = (a, b) => {
  if (!a || !b) {
    return 0;
  }
  if (+b === 0) {
    // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
    return 0;
  }
  if (isNaN(parseFloat(a)) || isNaN(parseFloat(b))) {
    return 0;
  }

  return new Decimal(a).mul(b).valueOf();
};

export const generateFAQSEOData = (list) => {
  return {
    ['@context']: window.location.href,
    ['@type']: 'FAQPage',
    mainEntity: list.map((item) => {
      return {
        ['@type']: 'Question',
        name: item.question,
        acceptedAnswer: {
          ['@type']: 'Answer',
          text: item.answer,
        },
      };
    }),
  };
};

export const PurchaseTypeEnum = {
  auction: 1,
  sale: 2,
  mystery: 3,
  token: 4,
};

export const useIsMobile = () => {
  const { sm, md, lg } = useResponsive(); // 判断当前屏幕尺寸是否满足条件
  return sm && !md && !lg;
};
