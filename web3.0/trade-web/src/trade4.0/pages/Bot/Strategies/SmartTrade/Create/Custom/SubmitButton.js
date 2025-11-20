/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useState, useRef } from 'react';
import useStateRef from '@/hooks/common/useStateRef';
import { useDispatch } from 'dva';
import SubmitSureActionSheet from 'SmartTrade/components/SubmitSureActionSheet';
import { toOrderSure, getOtherCoinsRatio } from 'SmartTrade/services';
// import { couponSubmitCheck } from 'strategies/components/Coupon/util';
import { trackClick, gaExpose } from 'src/utils/ga';
import SubmitButton from 'Bot/components/Common/SubmitButton';
import { _t, _tHTML } from 'Bot/utils/lang';
import { useModel } from './model';
import { div100, formatNumber } from 'Bot/helper';
import {
  submitData,
  sureSubmitData,
  maxAutoSell,
  showNotSupportBigSell,
  composeChange,
} from 'SmartTrade/config';

// 获取币种的具体使用了多少
export const fetchOtherCoinsRatio = (coins, limitAsset, useOtherCoins) => {
  if (!coins.length || !limitAsset) return Promise.reject();
  const mSubmitData = {
    targets: coins.map((coin) => ({
      currency: coin.currency,
      percent: div100(coin.value),
    })),
    totalValue: limitAsset,
    useMultipleInvestment: useOtherCoins,
  };
  // 过滤出分配到大于50USDT 符合条件的
  return getOtherCoinsRatio(mSubmitData).then(({ data }) =>
    data.filter((el) => +el.balance > 0 && el.isAvailable),
  );
};

/**
 * @description: 检查止损，止盈的自动卖出是否超过10W, 弹窗提示
 * @param {*} lossProfit 止盈 止损比例
 * @param {*} investment 总投资额
 * @return {Boolean}
 */
const checkAutoSellIsOk = (lossProfit, investment) => {
  investment = +investment;
  const { stopLoss, isSellOnStopLoss, stopProfit, isSellOnStopProfit } = lossProfit;
  if (stopLoss && isSellOnStopLoss) {
    if (investment > maxAutoSell) {
      showNotSupportBigSell({
        contentKey: 'notsupportbignumberloss',
        rate: lossProfit.stopLoss,
      });
      return true;
    }
  }

  if (stopProfit && isSellOnStopProfit) {
    if (investment > maxAutoSell) {
      showNotSupportBigSell({
        contentKey: 'notsupportbignumberprofit',
        rate: lossProfit.stopProfit,
      });
      return true;
    }
  }
  return false;
};

export default React.memo(() => {
  const dispatch = useDispatch();
  // 创建按钮
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  // 弹窗按钮
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [options, setOptions] = useState({
    method: {},
  });
  // 弹窗ref
  const actionSheetRef = useRef();
  const { coinRatioRef, templateId, stra, formData, form, clearCoupon, clear } = useModel();

  // 提交校验函数
  const submitHandlerRef = useStateRef(() => {
    // 点击运行埋点
    trackClick(['confirmCreate', '2'], {
      clickPosition: 'confirm',
      resultType: 'rebalance',
      yesOrNo: !!coupon,
    });
    // 提交校验函数
    if (coinRatioRef.current) {
      // 校验币种是否100%配比,至少一个币种
      coinRatioRef.current.validate().then((effectiveCoins) => {
        // 校验投入资产
        form.validateFields().then(async (values) => {
          const { limitAsset, method, lossProfit, coupon, useOtherCoins } = formData;
          const coins = effectiveCoins;
          const params = {
            templateId,
            limitAsset,
            coins,
            method,
            lossProfit,
            coupon,
            createWay: formData.createWay,
            investments: [{ currency: 'USDT', balance: limitAsset }], // 默认没有使用多币种
          };

          // 检查止损，止盈的自动卖出是否超过10W
          if (checkAutoSellIsOk(lossProfit, limitAsset)) {
            return;
          }
          // 校验卡券
          if (coupon) {
            // 校验投资额 交易对 和卡券的规则
            // const valid = await couponSubmitCheck(
            //   { stra, symbol: undefined, inverst: limitAsset, coupon },
            //   () => {
            //     // 清空卡券数据
            //     clearCoupon(null);
            //     setTimeout(() => {
            //       // 再次发起校验提交
            //       submitHandlerRef.current();
            //     }, 50);
            //   },
            // );
            // if (!valid) {
            //   return;
            // }
          }

          setSubmitBtnLoading(true);

          // 如果使用了多币种
          if (useOtherCoins) {
            try {
              // 先获取币种的具体使用了多少
              const investments = await fetchOtherCoinsRatio(coins, limitAsset, true);
              params.investments = investments;
            } catch (error) {
              return;
            }
          }
          // 弹窗需要的数据
          const mOptions = {
            ...params,
            submitData: submitData(params),
            sureSubmitData: sureSubmitData(params),
            change: coins.map((coin) => {
              // 变化多少字段, 默认没有使用多币种，那变化前都为0
              return {
                triggerPrice: coin.triggerPrice,
                base: coin.currency,
                before: 0,
                after: coin.value,
                changer: coin.value,
              };
            }),
          };
          try {
            // 下单确认接口
            const { data } = await toOrderSure(mOptions.sureSubmitData);

            setSubmitBtnLoading(false);
            // 合成数据
            mOptions.change = composeChange(data?.beforeOverview?.snapshots, coins);
            setOptions(mOptions);
            actionSheetRef.current.toggle();
            gaExpose(['confirmCreate', '1'], {
              resultType: 'rebalance',
              yesOrNo: !!coupon,
            });
          } catch (error) {
            setSubmitBtnLoading(false);
          }
        });
      });
    }
  });
  // 二次提交函数
  const onConfirm = useCallback(() => {
    if (confirmLoading) return;
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'confirm',
      resultType: 'rebalance',
      yesOrNo: !!coupon,
    });
    setConfirmLoading(true);
    dispatch({
      type: 'BotRunning/runMachine',
      payload: options.submitData,
    })
      .then((taskId) => {
        if (taskId) {
          actionSheetRef.current.close();
          clear();
        }
      })
      .finally((_) => {
        setConfirmLoading(false);
      });
  }, [options]);

  const { coupon } = formData;
  const onCancel = useCallback(() => {
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'close',
      resultType: 'rebalance',
      yesOrNo: !!coupon,
    });
  }, [coupon]);

  return (
    <>
      <SubmitButton loading={submitBtnLoading} onClick={submitHandlerRef.current}>
        {_t('gridwidget11')}
      </SubmitButton>
      <SubmitSureActionSheet
        dialogRef={actionSheetRef}
        confirmLoading={confirmLoading}
        onConfirm={onConfirm}
        onCancel={onCancel}
        options={options}
        coupon={coupon}
        desc={_tHTML('smart.ordersure', {
          num: ` ${formatNumber(options.limitAsset)} `,
        })}
      />
    </>
  );
});
