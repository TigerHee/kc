/**
 * Owner: mcqueen@kupotech.com
 */
import storage from 'gbiz-next/storage';
import moment from 'moment';

export const BET_MAP = {
  0: 'GROWTH',
  1: 'FALL',
};

export const STORAGE_NAME = 'bet_storage';

const invalidTime = moment().utc().startOf('day').valueOf();

export const betTimeValid = () => {
  const data = storage.getItem(STORAGE_NAME);
  if (data && data.time && data.time < invalidTime) {
    storage.removeItem(STORAGE_NAME);
  }
};
