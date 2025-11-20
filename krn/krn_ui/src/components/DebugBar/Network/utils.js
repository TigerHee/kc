let networkList = [];
import { MAX_NETWORK_COUNT } from "../config";

export const setStorageRequest = (item) => {
  if (item.body) {
    item.body =
      item.body.length > 5000
        ? item.body.slice(0, 5000) + "（最多展示5000个字符）"
        : item.body;
  }
  networkList.unshift(item);
  // 只保留最近30条请求
  networkList.length = Math.min(networkList.length, MAX_NETWORK_COUNT);
};

export const getStorageRequest = () => {
  return networkList || [];
};

export const clearStorageRequest = () => {
  networkList = [];
};
