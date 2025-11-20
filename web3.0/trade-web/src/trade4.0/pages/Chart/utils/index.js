/**
 * Owner: borden@kupotech.com
 */
import storage from 'utils/storage.js';
import { getSingleModule } from '@/layouts/utils';

const { getItem, setItem, setDiffItem } = storage;
const { isSingle } = getSingleModule();

// k线模块单开时，不进行存储
export default {
  getItem,
  setItem: (key, data, prefix) => {
    if (isSingle) return;

    setItem(key, data, prefix);
  },
  setDiffItem: (key, data, prefix) => {
    // k线模块单开时，不进行存储
    if (isSingle) return false;

    return setDiffItem(key, data, prefix);
  },
};
