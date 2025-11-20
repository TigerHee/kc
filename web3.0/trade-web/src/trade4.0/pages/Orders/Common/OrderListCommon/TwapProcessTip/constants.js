/*
 * @Author: harry.lai harry.lai@kupotech.com
 * @Date: 2024-05-13 10:29:59
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-14 12:15:30
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/OrderListCommon/TwapProcessTip/constants.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * Owner: harry.lai@kupotech.com
 */
import { _t } from 'utils/lang';

export const TIP_TEXT_STATUS_MAP = {
  PENDING: _t('eFctqPJCr38pB9gcg3NLAW'),
  PAUSED: _t('nrD3nBBeNx5m6bBYmvL19L'),
};

// TWAP状态
export const TWAP_INPROGRESS_STATUS = {
  PENDING: 'PENDING', // 委托中
  PAUSED: 'PAUSED', // 已暂停
};
