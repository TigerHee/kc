/*
 * @owner: borden@kupotech.com
 */

import { useDispatch, useSelector } from 'dva';
import { track } from 'src/utils/ga';
import { _t } from 'src/utils/lang';
import { isFromTMA } from 'utils/tma/isFromTMA';
import { APMCONSTANTS } from 'src/utils/apm/apmConstants';
import { TRADE_TYPES_CONFIG, checkIsMargin } from '@/meta/tradeTypes';
import { commonSensorsFunc } from '@/meta/sensors';
import usePair from '@/hooks/common/usePair';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import { useTradeType } from '@/hooks/common/useTradeType';
import voice from '@/utils/voice';
import { siteCfg } from 'config';
import { SPOT } from '@/meta/const';
import { TRADE_SIDE_MAP } from '../config';
import useOrderType from './useOrderType';

const plainObj = {};

export default function useSubmitHandle(config) {
  const dispatch = useDispatch();
  const tradeType = useTradeType();
  const { orderType, orderTypeConfig } = useOrderType(config?.orderType);
  const user = useSelector((state) => state.user.user) || plainObj;
  const sensorsInstance = useSelector(
    (state) => state.collectionSensorsStore.sensorsInstance,
  );
  const { symbol: currentSymbol, baseInfo, quoteInfo } = usePair();
  const { currencyName: quoteName } = quoteInfo;
  const { currency: base, currencyName: baseName } = baseInfo;

  const { getTradeResult } = TRADE_TYPES_CONFIG[tradeType] || {};

  const isXkucoin = isFromTMA();

  // 生成notification默认的description
  const genNotificationDesc = (side) => {
    const symbolName = `${baseName}/${quoteName}`;
    const orderTypeLabel = orderTypeConfig.label();
    const sideLabel = TRADE_SIDE_MAP[side].label();
    return `${orderTypeLabel} ${sideLabel} ${symbolName}`;
  };
  // 下单结果反馈
  const pushNotification = ({ type = 'error', side, message, description }) => {
    description = description || genNotificationDesc(side);
    voice.notify(type === 'error' ? 'order_fail' : 'order_success');
    dispatch({
      type: 'notice/feed',
      payload: {
        type: `notification.${type}`,
        message,
        extra: {
          description,
        },
        groupName: 'trade',
      },
    });
  };
  // 下单埋点上报
  const trackTradeResult = ({ res, side, apiDiffTime }) => {
    const { success } = res || {};
    // const { getTradeResult } = TRADE_TYPES_CONFIG[tradeType] || {};

    const tradeResultForSensors = {
      trade_pair: currentSymbol,
      trade_currency: base,
      trade_type: side,
      pricing_type: orderTypeConfig.sensorKey || '',
    };
    if (success) {
      tradeResultForSensors.is_success = true;
      tradeResultForSensors.fail_reason = 'none';
      tradeResultForSensors.fail_reason_code = 'none';
    } else {
      tradeResultForSensors.is_success = false;
      tradeResultForSensors.fail_reason_code = res?.code;
      tradeResultForSensors.fail_reason = res
        ? `${res.code}：${res.msg || '-'}`
        : 'none';
    }
    /**
     * add sendSensorApm by owen
     * params:tradeResultForSensors | getTradeResult
     */
    try {
      if (sensorsInstance[APMCONSTANTS.TRADE_ORDER_ANALYSE]) {
        const basePayload = {
          network_path: '',
          is_success: tradeResultForSensors?.is_success,
          fail_reason: tradeResultForSensors?.fail_reason,
          api_duration_order: apiDiffTime,
        };
        const others = {
          trade_pair: tradeResultForSensors?.trade_pair || '',
          trade_currency: tradeResultForSensors?.trade_currency || '',
          trade_type: tradeResultForSensors?.trade_type || '',
          pricing_type: tradeResultForSensors?.pricing_type || '',
          leverage_multiplier:
            tradeResultForSensors?.leverage_multiplier || '',
          trade_service_type:
            (getTradeResult &&
              getTradeResult(tradeResultForSensors)?.trade_service_type) ||
            '',
        };
        if (tradeType === SPOT && isXkucoin) {
          others.remark = 'miniApp';
        }
        sensorsInstance[APMCONSTANTS.TRADE_ORDER_ANALYSE].sendSensorApm(
          basePayload,
          others,
        );
      }
    } catch (e) {
      console.error(e, 'sensorsAPMReportError');
    }
    if (getTradeResult) {
      track('trade_results', getTradeResult(tradeResultForSensors));
    }
  };

  return useMemoizedFn(
    ({ side, values: { volume, params, ...values }, ...rest }) => {
      const startApiTime = new Date();
      return dispatch({
        type: 'tradeForm/createConsignation',
        payload: {
          coinPair: currentSymbol,
          formValues: {
            side,
            tradeType: orderType,
            ...values,
          },
          params,
          remark: tradeType === SPOT && isXkucoin ? 'miniApp' : undefined, // 目前只标识现货
          ...rest,
        },
      })
        .then((res) => {
          const endApiTime = new Date();
          const apiDiffTime = Number(endApiTime - startApiTime);
          trackTradeResult({ res, side, apiDiffTime });
          if (res?.success) {
            const isOnce = window.localStorage.getItem(`trade_once_${side}`);
            // 如果高级设置是一次性使用，使用过后清除该设置
            if (isOnce && values.showAdvanced !== false) {
              window.localStorage.removeItem(`trade_once_${side}`);
              window.localStorage.removeItem(
                `${user.referralCode || '_'}advance_modal_${side}`,
              );
              dispatch({
                type: 'tradeForm/update',
                payload: {
                  [`advanceSettings_${side}`]: {},
                },
              });
            }
            pushNotification({
              side,
              type: 'success',
              message: _t('trade.placeOrder.success'),
            });
          } else {
            // 平台统一处理主账号、子账号问题
            if (res.code === '400303' || res.code === '400304') {
              dispatch({
                type: 'user/queryPassiveNotice',
                payload: {
                  status: 'KYC_LIMIT',
                },
              }).then((data) => {
                const { content, title, buttonAgree, buttonAgreeWebUrl } = data;
                const { trade_category } = TRADE_TYPES_CONFIG[tradeType] || {};
                const tradeResultForSensors = {
                  trade_pair: currentSymbol,
                  trade_currency: base,
                  trade_type: side,
                  pricing_type: orderTypeConfig.sensorKey || '',
                };
                // 在交易页（APP对应币种详情，Web对应交易大厅），用户下单调用KYC校验接口时，如果校验未通过，即上报
                if (getTradeResult) {
                  track('trade_KYC_intercept', getTradeResult(tradeResultForSensors));
                }
                // kyc弹窗曝光时上报
                if (trade_category) {
                  commonSensorsFunc(['kyc', 'modalClose', 'expose'], {
                    trade_category,
                    symbol: currentSymbol,
                  });
                }
                dispatch({
                  type: 'dialog/openDialog',
                  payload: {
                    // 一分钟解锁更多产品与服务
                    content,
                    // 请您完成身份认证
                    title,
                    // 立即认证
                    buttonText: buttonAgree,
                    buttonLink: buttonAgreeWebUrl,
                    // 点击确认跳转时上报
                    confirmAction: () => {
                      if (trade_category) {
                        commonSensorsFunc(['kyc', 'modalConfirm', 'click'], { trade_category });
                      }
                    },
                    // 点击取消时上报（一般是在子账号情况下）
                    cancelAction: () => {
                      if (trade_category) {
                        commonSensorsFunc(['kyc', 'modalCancel', 'click'], { trade_category });
                      }
                    },
                    // 点击关闭按钮时上报
                    closeAction: () => {
                      if (trade_category) {
                        commonSensorsFunc(['kyc', 'modalClose', 'click'], {
                          trade_category,
                          symbol: currentSymbol,
                        });
                      }
                    },
                  },
                });
              });
              return;
            }
            // 印度PAN码拦截
            if ([600000].includes(+res?.code)) {
              dispatch({
                type: 'dialog/updateTaxInfoCollectDialogConfig',
                payload: {
                  open: true,
                  source: checkIsMargin(tradeType) ? 'margin' : 'Spot1.0',
                },
              });
              return;
            }
            // 交易页特殊交易对国别限制
            if (+res?.code === 400500 || +res?.code === 200008) {
              const { MAINSITE_HOST } = siteCfg;
              const [coin] = currentSymbol.split('-');
              dispatch({
                type: 'dialog/openDialog',
                payload: {
                  // 您当前所在国家/地区不支持该交易对，可以点击下方按钮完成提币
                  content: _t('wgUkgw8Mjwn2nkH2JVu4SR'),
                  // 通知
                  title: _t('6y8QtbhDyEnXe1EnDGsPZK'),
                  // 去提币
                  buttonText: _t('rTyzrwUy6atZrCxEy3JzFE'),
                  buttonLink: `${MAINSITE_HOST}/assets/withdraw/${coin}`,
                  cancelText: _t('cancel'),
                },
              });
              return;
            }
            // 交易对无效, 重新拉取币服交易对配置
            if ([400600].includes(+res?.code)) {
              dispatch({ type: 'symbols/pullSymbols' });
            }
            // 系统维护, 重新拉取系统维护状态
            if ([200001, 200002].includes(+res?.code)) {
              dispatch({ type: 'tradeForm/queryMaintenanceStatus' });
            }
            pushNotification({
              side,
              description: res?.msg,
              message: _t('trade.placeOrder.failed'),
            });
          }
          return res;
        })
        .catch((e) => {
          const { msg } = e || {};
          pushNotification({
            side,
            message: msg,
          });
        });
    },
  );
}
