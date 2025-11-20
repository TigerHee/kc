/**
 * Owner: harry.lai@kupotech.com
 */
const MAX_LIMIT_SHOW_LENGTH = 30;
const ZERO_NUMBER = 0;

/** 生成当前tab 外显总条数值 */
export const generateOpenOrderTabCounterNum = (
  { key, namespace },
  { currentTotalNum, stopTotalNum, twapOrderTotalNum },
) => {
  const totalNumbers = {
    common: {
      current: currentTotalNum,
      stop: stopTotalNum,
    },
    orderTwap: twapOrderTotalNum,
  };

  let totalNumber = namespace === 'orderTwap' ? totalNumbers[namespace] : totalNumbers.common[key];

  // 限制显示的最大数量
  totalNumber = totalNumber > MAX_LIMIT_SHOW_LENGTH ? `${MAX_LIMIT_SHOW_LENGTH}+` : totalNumber;
  return totalNumber ?? ZERO_NUMBER;
};
