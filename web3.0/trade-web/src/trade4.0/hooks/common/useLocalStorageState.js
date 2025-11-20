/**
 * Owner: clyne@kupotech.com
 */
import storage from 'utils/storage';
import { createUseStorageState } from './createUseStorageState';

const useLocalStorageState = createUseStorageState(() => storage);

export default useLocalStorageState;
