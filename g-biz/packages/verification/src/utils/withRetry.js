/**
 * Owner: vijay.zhou@kupotech.com
 */
const withRetry = (fn, retryTime = 3) => async (...args) => {
  let currentTime = 0;
  while (true) {
    try {
      currentTime++;
      // eslint-disable-next-line no-await-in-loop
      return await fn(...args);
    } catch (err) {
      console.error(new Error(`Attempt ${currentTime} failed. Retrying...`));
      if (currentTime >= retryTime) {
        console.error('All retry attempts failed.');
        throw err;
      }
    }
  }
};

export default withRetry;
