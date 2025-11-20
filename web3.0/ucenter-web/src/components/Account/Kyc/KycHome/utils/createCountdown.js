/**
 * Owner: vijay.zhou@kupotech.com
 */
import moment from 'moment';

export const createCountdown = ({ seconds, callback }) => {
  const end = Date.now() + seconds * 1000;

  const timer = setInterval(() => {
    const now = Date.now();
    if (end <= now) {
      clearInterval(timer);
      callback({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
    } else {
      const duration = moment.duration(end - now, 'milliseconds');
      callback({
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
        done: false,
      });
    }
  }, 1000);

  return {
    cancel: () => clearInterval(timer),
  };
};
