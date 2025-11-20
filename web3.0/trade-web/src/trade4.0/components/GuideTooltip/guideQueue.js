/*
 * @owner: borden@kupotech.com
 */
import { isNil } from 'lodash';
import storage from 'utils/storage';
import { CONFIG, CONFIG_MAP, STORAGE_KEY } from './config';

const getOldStorageValue = (code) => {
  const { oldStorageKey } = CONFIG_MAP[code];
  const value = Boolean(storage.getItem(oldStorageKey));
  storage.removeItem(oldStorageKey);
  const newValue = storage.getItem(STORAGE_KEY);
  storage.setItem(STORAGE_KEY, {
    ...newValue,
    [code]: value,
  });
  return value;
};

class GuideQueue {
  constructor() {
    const initStatus = storage.getItem(STORAGE_KEY);
    this.queue = CONFIG.filter(({ code, oldStorageKey }) => {
      if (oldStorageKey && isNil(initStatus?.[code])) {
        return getOldStorageValue(code);
      }
      return !initStatus?.[code];
    });
    this.activeCodes = {};
    this.isInitialized = false;
    this.currentSequence = undefined;
  }
  changeActiveStatus(code, activeStatus, callback) {
    if (CONFIG_MAP[code]) {
      this.activeCodes[code] = activeStatus;
      if (
        activeStatus &&
        this.isInitialized &&
        typeof callback === 'function' &&
        this.currentSequence === undefined &&
        this.queue.find(v => v.code === code)
      ) {
        callback(this.getCurrentSequence());
      }
    }
  }
  removeSequence(sequence) {
    if (sequence !== undefined) {
      const updateData = {};
      this.queue = this.queue.filter((v) => {
        const result = v.sequence === sequence;
        if (result) {
          updateData[v.code] = true;
        }
        return !result;
      });
      const initStatus = storage.getItem(STORAGE_KEY);
      storage.setItem(STORAGE_KEY, {
        ...initStatus,
        ...updateData,
      });
    }
  }
  getCurrentSequence() {
    this.isInitialized = true;
    this.currentSequence = this.queue.find(
      v => this.activeCodes[v.code],
    )?.sequence;
    return this.currentSequence;
  }
  getNextSequence() {
    this.removeSequence(this.currentSequence);
    return this.getCurrentSequence();
  }
}

const guideQueue = new GuideQueue();

export default guideQueue;
