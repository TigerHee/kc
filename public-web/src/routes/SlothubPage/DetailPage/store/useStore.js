/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-18 11:26:19
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-18 16:47:10
 */
import { useContext } from 'react';
import { SlotDetailContext } from './index';

export const useStore = () => {
  const store = useContext(SlotDetailContext);
  if (store === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};
