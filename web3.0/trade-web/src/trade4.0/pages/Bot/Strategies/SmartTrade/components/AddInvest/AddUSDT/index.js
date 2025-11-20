/**
 * Owner: mike@kupotech.com
 */
/* eslint-disable */
import React, { useCallback, useRef, useState } from 'react';
import { withForm } from 'Bot/components/Common/CForm';
import Investment from 'SmartTrade/components/Investment';
import SubmitSureActionSheet from 'SmartTrade/components/SubmitSureActionSheet';
import useStateRef from '@/hooks/common/useStateRef';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import { trackClick } from 'utils/ga';
import { timesPercent100 } from 'SmartTrade/util';
import { _t, _tHTML } from 'Bot/utils/lang';
import HintText from 'Bot/components/Common/HintText';
import { UpdateBotParams, toOrderSure, getOtherCoinsRatio } from 'SmartTrade/services';
import { Text } from 'Bot/components/Widgets';
import { formatNumber } from 'Bot/helper';
import {
  composeChange,
  maxAutoSell,
  symbolInfo,
  minInvestment,
  filterTargets,
} from 'SmartTrade/config';

// 获取币种的具体使用了多少
const fetchOtherCoinsRatio = (taskId, limitAsset) => {
  if (!limitAsset) return Promise.reject();
  const submitData = {
    taskId,
    totalValue: limitAsset,
    useMultipleInvestment: true,
  };
  // 过滤出分配到大于50USDT 符合条件的
  return getOtherCoinsRatio(submitData).then(({ data }) =>
    data.filter((el) => +el.balance > 0 && el.isAvailable),
  );
};

/**
 * @description: 追加USDT表单主体
 * @return {*}
 */
const AddUSDT = withForm()(({ actionSheetRef, item, form, sureRef, setOptions }) => {
  // 参数修改页面直接使用targets, 运行中用currencyInfo
  const coins = item.targets ? timesPercent100(item.targets) : filterTargets(item.currencyInfo); // 目标仓位
  const useDataRef = useStateRef({
    coins,
    form,
    taskId: item.id,
    item,
  });

  const onConfirm = useCallback(() => {
    const { coins, form, taskId, item } = useDataRef.current;
    form.validateFields().then(async (values) => {
      const { useOtherCoins, limitAsset } = values;
      const isOverMax = Number(item.totalCost) + Number(limitAsset) > maxAutoSell;
      const params = {
        ...values,
        investments: [{ currency: 'USDT', balance: limitAsset }], // 默认没有使用多币种
        change: [],
        // method: dropNull(item.method),
        lossProfit: {
          stopLoss: item.stopLoss,
          // 如果超过10w, 就设置自动卖出false
          isSellOnStopLoss: isOverMax ? false : item.isSellOnStopLoss,

          stopProfit: item.stopProfit,
          // 如果超过10w, 就设置自动卖出false
          isSellOnStopProfit: isOverMax ? false : item.isSellOnStopProfit,
        },
        // 现在投资总额大于10w 并且之前设置了自动卖出，就提示
        isShowOverMaxHint: isOverMax && (item.isSellOnStopLoss || item.isSellOnStopProfi),
      };
      // 变化前后提交数据
      const submitSureData = {
        totalInvestmentUsdt: limitAsset,
        useMultipleInvestment: useOtherCoins,
        investments: params.investments,
        taskId,
      };
      actionSheetRef.current.updateBtnProps({
        okButtonProps: {
          loading: true,
        },
      });
      // 先获取币种的具体使用了多少
      if (useOtherCoins) {
        try {
          const investments = await fetchOtherCoinsRatio(taskId, limitAsset);
          params.investments = investments;
          submitSureData.investments = investments;
        } catch (error) {}
      }

      try {
        const { data: dataSure } = await toOrderSure(submitSureData);
        if (dataSure) {
          // 转换数据
          params.change = composeChange(dataSure?.beforeOverview?.snapshots, coins);
          setOptions(params);
          sureRef.current.toggle();
        }
      } catch (error) {
      } finally {
        actionSheetRef.current.updateBtnProps({
          okButtonProps: {
            loading: false,
          },
        });
      }
    });
  }, []);

  useBindDialogButton(actionSheetRef, {
    onConfirm,
  });
  return (
    <div className="bot-update-form">
      <Text as="div" color="text60" fs={14}>
        {_t('smart.addinversthint')}
      </Text>
      <Investment
        symbolInfo={symbolInfo}
        formData={{
          minInverstment: minInvestment,
          coins,
        }}
        form={form}
        inverstLabel={_t('smart.addinverst')}
        inverstError={_t('placeholder.addInverst')}
      />
    </div>
  );
});
/**
 * @description: 追加USDT表单，二次确认wrap
 * @return {*}
 */
export default ({ actionSheetRef, onFresh, item }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [options, setOptions] = useState({});
  const sureRef = useRef();
  const useDataRef = useStateRef({
    options,
    confirmLoading,
    taskId: item.id,
    onFresh,
  });
  const onSureConfirm = useCallback(() => {
    const { options, confirmLoading, taskId, onFresh } = useDataRef.current;
    trackClick(['AddInvestmentConfirm', '4'], {
      MultiCoinsSwitch: options.useOtherCoins ? 1 : 0,
    });
    if (confirmLoading) return;
    setConfirmLoading(true);
    UpdateBotParams({
      taskId,
      totalInvestmentUsdt: options.limitAsset,
      investments: options.investments,
      ...options.lossProfit,
    })
      .then(({ data }) => {
        // 关闭所有
        sureRef.current.toggle();
        actionSheetRef.current.toggle();
        if (typeof data === 'object') {
          // 实际追加成功的USDT
          data.totalInvestmentUsdt = +data.totalInvestmentUsdt;
          if (data.totalInvestmentUsdt > 0) {
            onFresh && onFresh();
            // 部分成功
            if (!data.isAllInvestmentSuccess) {
              data.investments = data.investments
                .map((coin) => {
                  return formatNumber(coin.balance) + coin.currency;
                })
                .join('+');

              showNotAllSuccDialog({
                limitAsset: options.limitAsset,
                totalInvestmentUsdt: data.totalInvestmentUsdt,
                investments: data.investments,
              });
            } else {
              message.success(_t('smart.zuijisuccess'));
              onFresh && onFresh();
            }
          }
        }
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  }, []);

  // 提示投资额超过10w，不自动设置止盈止损卖出
  const submitSureAppend = <HintText simple>{_t('over10wuhint')}</HintText>;
  return (
    <>
      <AddUSDT
        item={item}
        actionSheetRef={actionSheetRef}
        sureRef={sureRef}
        setOptions={setOptions}
      />
      <SubmitSureActionSheet
        dialogRef={sureRef}
        title={_t('gridwidget5')}
        confirmLoading={confirmLoading}
        onConfirm={onSureConfirm}
        options={options}
        append={options.isShowOverMaxHint ? submitSureAppend : null}
        desc={_t('smart.zuijiainverst', { num: `${options.limitAsset}USDT` })}
      />
    </>
  );
};

/**
 * @description: 弹窗提示追加部分成功
 * @param {*} limitAsset
 * @param {*} totalInvestmentUsdt
 * @param {*} investments
 * @return {*}
 */
const showNotAllSuccDialog = ({ limitAsset, totalInvestmentUsdt, investments }) => {
  DialogRef.info({
    title: _t('gridwidget5'),
    content: _tHTML('smart.zhuijianotperfect', {
      value: `${formatNumber(limitAsset)} USDT`,
      realValue: `${formatNumber(totalInvestmentUsdt ?? 0)} USDT`,
      layout: investments,
    }),
    okText: _t('confirm'),
    cancelText: null,
    maskClosable: true,
  });
};
