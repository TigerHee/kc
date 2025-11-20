/*
 * @owner: borden@kupotech.com
 */
import { STATUS } from '@/meta/margin';
import { ACCOUNT_CODE } from '@/meta/const';
import { formatNumber } from '@/utils/format';

/**
 *
 * @param {*} status
 * @returns 是否支持一键平仓
 */
export const checkIsSupportClosePosition = (status) => {
  return Boolean(STATUS[ACCOUNT_CODE.ISOLATED]?.[status]?.isSupportClosePosition);
};

/**
 *
 * @param {*} status
 * @returns 是否支持取消一键平仓
 */
export const checkIsSupportCancelClosePosition = ({ status, statusBizType }) => {
  return Boolean(STATUS[ACCOUNT_CODE.ISOLATED]?.[status]?.isSupportCancelClosePosition) &&
  statusBizType === 'ONE_CLICK_LIQUIDATION';
};
/**
 *
 * @param {*} v
 * @returns 格式化显示仓位信息
 */
export const format = v => formatNumber(v, {
  pointed: true,
  dropZ: true,
}).toString();
