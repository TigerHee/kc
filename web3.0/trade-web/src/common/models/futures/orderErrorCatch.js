/**
 * Owner: garuda@kupotech.com
 */
import { evtEmitter as eventEmmiter } from 'helper';

import { _t } from 'utils/lang';

import {
  ACCOUNT_BALANCE_INSUFFICIENT,
  PRICE_WORSE_THAN_LIQUIDATION_PRICE,
  PRICE_WORSE_THAN_BANKRUPT_PRICE,
  TOO_MANY_ACTIVE_ORDER,
  TOO_MANY_STOP_ORDER,
  UNLEGAL_PRICE,
  POSITION_EMPTY_REDUCE,
  // AREA_LIMIT_CODE,
  // KYC_AUTH_CODE,
  // KYC_AUTH_CODE_SUB,
  RISK_LIMIT_LOW,
  MAX_ORDER_SIZE_LIMIT,
  MARGIN_MODE_ERROR,
  // TRIAL_FUND_INSUFFICIENT,
} from '@/meta/futures';

const eventHandle = eventEmmiter.getEvt();

export default {
  effects: {
    *orderCatch({ payload: { error } }, { put }) {
      const { code, msg } = error;

      switch (code) {
        case ACCOUNT_BALANCE_INSUFFICIENT:
        case MAX_ORDER_SIZE_LIMIT:
          eventHandle.emit('event/order@balanceInsufficient');
          break;
        case PRICE_WORSE_THAN_LIQUIDATION_PRICE:
        case PRICE_WORSE_THAN_BANKRUPT_PRICE:
        case TOO_MANY_ACTIVE_ORDER:
        case TOO_MANY_STOP_ORDER:
        case UNLEGAL_PRICE:
        case POSITION_EMPTY_REDUCE:
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'notification.error',
              message: _t('trade.notice.failedTitle'),
              extra: {
                description: msg,
              },
            },
          });
          break;
        // 交易大厅有单独的提示
        // case AREA_LIMIT_CODE:
        //   yield put({ type: 'app/update', payload: { showAreaPolicy: true } });
        //   break;
        // case KYC_AUTH_CODE:
        // case KYC_AUTH_CODE_SUB:
        //   yield put({ type: 'app/update', payload: { kycLimitVisible: true } });
        //   break;
        case RISK_LIMIT_LOW:
          yield put({
            type: 'futuresForm/updateShowLowQuota',
            payload: {
              dialogState: true,
              riskLimitErrorMsg: msg,
            },
          });
          break;
        case MARGIN_MODE_ERROR:
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'notification.error',
              message: _t('trade.notice.failedTitle'),
              extra: {
                description: msg,
              },
            },
          });
          yield put({ type: 'grayScale/getCrossGrayScale' });
          yield put({ type: 'futuresMarginMode/getMarginModes' });
          break;
        default:
          throw error;
      }
    },
  },
};
