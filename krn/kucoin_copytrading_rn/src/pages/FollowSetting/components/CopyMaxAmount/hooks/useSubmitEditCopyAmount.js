import {useGetTraderPositionSummaryInfo} from 'pages/FollowSetting/hooks/useGetTraderPositionSummaryInfo';
import {useTransferCopyMaxAmount} from 'pages/FollowSetting/hooks/useTransferCopyMaxAmount';
import {getUpdateMaxAmountOperatorAndAdjustAmount} from 'pages/FollowSetting/presenter/helper';
import {useRef} from 'react';
import {getBaseCurrency} from 'site/tenant';

import {AmountDirectionType} from '../components/AddOrReduceSwitch';
import {determineWithTpSlRuleStrategy, STRATEGY_ENUM} from '../helper';

export const useSubmitEditCopyAmount = ({
  finalShowAmount,
  currentCopyMaxAmount,
  refetchMaxChangeInvestment,
  refetchRewriteFormDetail,
  setEditAmountDirection,
  onFinalSubmit,
  setAdjustAmount,
  configInfo,
  closePopup,
}) => {
  const {copyConfigId, AccountStopTake} = configInfo || {};
  const editCopyAmountPnSlConflictPopupRef = useRef(null);
  const {
    submit: transferCopyMaxAmount,
    isLoading: isTransferCopyMaxAmountLoading,
  } = useTransferCopyMaxAmount();

  const {refetch: refetchTraderPositionSummaryInfo} =
    useGetTraderPositionSummaryInfo();

  const submitEdit = async () => {
    const {direction, targetAdjustAmount} =
      getUpdateMaxAmountOperatorAndAdjustAmount({
        updateMaxAmount: finalShowAmount,
        originMaxAmount: currentCopyMaxAmount,
      });

    const doTransferAndRefreshData = async () => {
      await transferCopyMaxAmount({
        direction,
        amount: targetAdjustAmount,
        currency: getBaseCurrency(),
        copyConfigId: copyConfigId,
      });
      // 拉取表单新的止盈止损规则 与 可用额度
      await Promise.all([
        refetchRewriteFormDetail(),
        refetchMaxChangeInvestment(),
      ]);
      // 拉取收益率
      refetchTraderPositionSummaryInfo();

      onFinalSubmit({
        oldAmount: currentCopyMaxAmount,
        newAmount: finalShowAmount,
      });

      // 恢复表单默认状态
      setAdjustAmount('');
      setEditAmountDirection(AmountDirectionType.Add);
    };
    const {data} = await refetchTraderPositionSummaryInfo();
    const {currentAsset} = data?.data || {};

    const strategy = determineWithTpSlRuleStrategy({
      currentCopyMaxAmount,
      currentAsset,
      newCopyMaxAmount: finalShowAmount,
      takeProfitRatio: AccountStopTake?.takeProfitRatio,
      stopLossRatio: AccountStopTake?.stopLossRatio,
    });

    if (strategy === STRATEGY_ENUM.NO_ACTION) {
      doTransferAndRefreshData();
      return;
    }

    closePopup();
    editCopyAmountPnSlConflictPopupRef.current.open({
      onContinueSubmit: doTransferAndRefreshData,
      strategy,
    });
  };

  return {
    submitEdit,
    isTransferCopyMaxAmountLoading,
    editCopyAmountPnSlConflictPopupRef,
  };
};
