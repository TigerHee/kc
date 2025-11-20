import {useMemoizedFn} from 'ahooks';
import Decimal from 'decimal.js';
import {useGetTraderPositionSummaryInfo} from 'pages/FollowSetting/hooks/useGetTraderPositionSummaryInfo';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useFormContext, useWatch} from 'react-hook-form';

import useLang from 'hooks/useLang';
import {isUndef, numberFixed} from 'utils/helper';
import {
  dividedBy,
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
  lessThanOrEqualTo,
  minus,
  multiply,
  percentage,
  plus,
} from 'utils/operation';
import {CAN_SET_SL_LIMIT_MAP, CAN_SET_TP_LIMIT_MAP} from '../constant';
import {useSyncFieldExistErrors} from './useSyncFieldExistErrors';

export const useProjectTPSLValidate = ({
  isCheckSwitch,
  value,
  onChange,
  configInfo,
}) => {
  const {_t} = useLang();
  const {control} = useFormContext();

  const [errors, setErrors] = useState({
    stopLossRatio: '',
    takeProfitRatio: '',
  });
  const [predictTips, setPredictTips] = useState({
    stopLossRatio: '',
    takeProfitRatio: '',
  });

  const {data: traderPositionSummaryInfoResp} =
    useGetTraderPositionSummaryInfo();
  const {totalPnl} = traderPositionSummaryInfoResp?.data || {};

  const copyAmount = useWatch({
    control,
    name: 'maxAmount',
  });

  const totalPnlRate = useMemo(
    () => dividedBy(totalPnl)(copyAmount),
    [copyAmount, totalPnl],
  );

  const isCopyAmountZeroOrNegative = useMemo(
    () => lessThanOrEqualTo(copyAmount)(0),
    [copyAmount],
  );

  // 同步校验结果到外层表单值 提交校验
  useSyncFieldExistErrors({errors, onChange, value});

  /**
   * 获取验证规则
   * @param {Object} formValue - 表单值
   */
  const getValidationRules = useCallback(
    formValue => {
      const errors = {};
      const predictTips = {};

      const {stopLossRatio, takeProfitRatio} = formValue || value || {};

      // 规则1校验: 如果跟单金额为零或负数，设置错误信息并返回
      if (isCopyAmountZeroOrNegative) {
        setErrors({
          takeProfitRatio: _t('3340e2f6bdb64000aed6'),
        });

        return;
      }

      /* 规则2校验: 止盈止损是否超出最大可设限制 */
      if (!isUndef(takeProfitRatio)) {
        if (
          lessThan(+takeProfitRatio)(CAN_SET_TP_LIMIT_MAP.min) ||
          greaterThan(+takeProfitRatio)(CAN_SET_TP_LIMIT_MAP.max)
        ) {
          errors.takeProfitRatio = _t('ae11eb7de8104000a95a', {
            '1_num': CAN_SET_TP_LIMIT_MAP.min,
            '2_num': CAN_SET_TP_LIMIT_MAP.max,
          });
        }
      }
      if (!isUndef(stopLossRatio)) {
        if (
          lessThan(+stopLossRatio)(CAN_SET_SL_LIMIT_MAP.min) ||
          greaterThan(+stopLossRatio)(CAN_SET_SL_LIMIT_MAP.max)
        ) {
          errors.stopLossRatio = _t('ae11eb7de8104000a95a', {
            '1_num': CAN_SET_SL_LIMIT_MAP.min,
            '2_num': CAN_SET_SL_LIMIT_MAP.max,
          });
        }
      }

      /* 规则3校验: 止盈止损是否与 当前收益率互斥 */
      // 止盈校验
      if (
        takeProfitRatio &&
        !errors.takeProfitRatio &&
        greaterThanOrEqualTo(totalPnlRate)(0)
      ) {
        const showMinProfitRatio = numberFixed(
          `${percentage(totalPnlRate)}`,
          2,
        );
        if (lessThanOrEqualTo(takeProfitRatio)(percentage(totalPnlRate))) {
          const isCurPnlLargeMaxSupportTP = greaterThanOrEqualTo(
            percentage(totalPnlRate),
          )(CAN_SET_TP_LIMIT_MAP.max);
          if (isCurPnlLargeMaxSupportTP) {
            errors.takeProfitRatio = _t('47388313c5c14000a36e', {
              '1_num': `${showMinProfitRatio}%`,
              '2_percentage': `${CAN_SET_TP_LIMIT_MAP.max}%`,
            });
          } else {
            errors.takeProfitRatio = _t('34029b6a80ce4000a4ec', {
              rate: `${showMinProfitRatio}%`,
              range: `${showMinProfitRatio}% - ${CAN_SET_TP_LIMIT_MAP.max}%`,
            });
          }
        }
      }

      // 止损校验
      if (stopLossRatio && !errors.stopLossRatio && lessThan(totalPnlRate)(0)) {
        const totalPnlRateDec = new Decimal(totalPnlRate);
        // 计算绝对值
        const absLossRatio = totalPnlRateDec.abs();
        const minLossRatio = Decimal.max(absLossRatio, new Decimal(0));
        const showMinLossRatio = numberFixed(`${percentage(minLossRatio)}`, 2);

        if (lessThanOrEqualTo(stopLossRatio)(percentage(absLossRatio))) {
          const isCurPnlLargeMaxSupportTP = greaterThanOrEqualTo(
            percentage(absLossRatio),
          )(CAN_SET_SL_LIMIT_MAP.max);
          if (isCurPnlLargeMaxSupportTP) {
            errors.takeProfitRatio = _t('424769a64b0a4000a7bc', {
              '1_num': `${showMinLossRatio}%`,
              '2_percentage': `${CAN_SET_SL_LIMIT_MAP.max}%`,
            });
          } else {
            errors.stopLossRatio = _t('a92303e7f34d4000a6b6', {
              rate: `-${showMinLossRatio}%`,
              range: `${showMinLossRatio}% - ${CAN_SET_SL_LIMIT_MAP.max}%`,
            });
          }
        }
      }

      // 设置预测提示
      if (!errors.takeProfitRatio && takeProfitRatio) {
        predictTips.takeProfitRatio = {
          depositAmount: multiply(plus(1)(dividedBy(takeProfitRatio)(100)))(
            copyAmount,
          ),
          profitAmount: multiply(dividedBy(takeProfitRatio)(100))(copyAmount),
        };
      }

      if (!errors.stopLossRatio && stopLossRatio) {
        predictTips.stopLossRatio = {
          depositAmount: multiply(minus(1)(dividedBy(stopLossRatio)(100)))(
            copyAmount,
          ),
          profitAmount: multiply(
            multiply(dividedBy(stopLossRatio)(100))(copyAmount),
          )(-1),
        };
      }

      // 设置错误信息
      setErrors(errors);

      // 设置预测提示
      setPredictTips(predictTips);
    },
    [value, isCopyAmountZeroOrNegative, totalPnlRate, _t, copyAmount],
  );

  const validateValue = useMemoizedFn(getValidationRules);

  useEffect(() => {
    /** 表单回显数据更新，开关跟单账户止盈止损，跟单金额变化，总收益率变化时 触发 更新校验  */
    getValidationRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copyAmount, isCheckSwitch, configInfo, totalPnlRate]);

  return {
    validateValue,
    predictTips,
    errors,
    isCopyAmountZeroOrNegative,
  };
};
