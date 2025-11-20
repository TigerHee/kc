/**
 * Owner: melon@kupotech.com
 */
import { PREFIX } from './config';

export const namespace = `${PREFIX}_box`;

const initialValue = {
  isShowDownloadBanner: null, // 下载模块展示状态，false为不显示 true为显示
  downloadBannerHeight: 0, // 下载模块高度
};

export default {
  namespace,
  state: initialValue,
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {},
};
