/**
 * Owner: kevyn.yu@kupotech.com
 */
import getIntervalSeconds from './getIntervalSeconds';

const continueBars = (resolution: string, bars: any[] = []) => {
  const diffTime = getIntervalSeconds(resolution) / 1000;

  const storeBars: any[] = [];
  bars.forEach((item, index) => {
    const { time } = item;

    // 保存当前item
    storeBars.push(item);
    const nextItem = bars[index + 1];
    if (nextItem) {
      const timeLimit = nextItem.time / 1000;

      let currentTime = time;
      let nextTime = currentTime + diffTime;
      while (timeLimit > nextTime) {
        // 补缺失的时间
        storeBars.push({
          time: nextTime,
          open: item.close,
          close: item.close,
          high: item.close,
          low: item.close,
          volume: 0,
        });
        currentTime = nextTime;
        nextTime = currentTime + diffTime;
      }
    }
  });

  return storeBars;
};

export default continueBars;
