/**
 * Owner: kevyn.yu@kupotech.com
 */
const getIntervalSeconds = (i: string) => {
  const interval = i.toUpperCase();
  const resolution = +interval;

  let second = 0;
  if (!isNaN(resolution)) {
    second = resolution * 60;
  } else if (interval.indexOf('D') > -1) {
    if (interval === 'D') {
      second = 24 * 60 * 60;
    } else {
      second = +interval.replace('D', '') * 24 * 60 * 60;
    }
  } else if (interval.indexOf('W') > -1) {
    if (interval === 'W') {
      second = 7 * 24 * 60 * 60;
    } else {
      second = +interval.replace('W', '') * 7 * 24 * 60 * 60;
    }
  }
  return second * 1000;
};

export default getIntervalSeconds;
