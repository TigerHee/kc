import {useMemoizedFn} from 'ahooks';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {showToast} from '@krn/bridge';

import {RouterNameMap} from 'constants/router-name-map';
import useGoBack from 'hooks/useGoBack';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import {
  useAccountTotalEquityMutation,
  useApplyRevertLeaderMutation,
  useSubmitRevertReasonMutation,
} from '.';

const validateForm = (formValue, _t) => {
  const {cancelReasonIds} = formValue || {};
  // 检查 cancelReasonIds 是否不为空且数组长度大于 0
  if (!cancelReasonIds?.length > 0) {
    showToast(_t('b9e7a2909ee14800a6b4'));
    return false;
  }

  return true;
};

export const useSubmitHandler = ({formMethods, setConfirmShow}) => {
  const {getValues} = formMethods;
  const goBack = useGoBack();
  const {replace} = usePush();
  const {_t} = useLang();
  const {configId: leadConfigId, uid: subUID} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  const {
    mutateAsync: queryEquity,
    isLoading: isPullEquityLoading,
    data: equityDataResp,
  } = useAccountTotalEquityMutation();
  const {mutateAsync: submitReason, isLoading: isSubmitReasonLoading} =
    useSubmitRevertReasonMutation();
  const {mutateAsync: applyRevertLeader, isLoading: isApplyRevertLoading} =
    useApplyRevertLeaderMutation();
  const equityInfo = useMemo(
    () => ({
      // 剩余资金
      remainingFunds: equityDataResp?.data,
      //未结算分润 本次不支持暂无数据
      unsettledProfits: '',
    }),
    [equityDataResp],
  );

  const onUndo = useMemoizedFn(async () => {
    const formValue = getValues();
    const isPass = validateForm(formValue, _t);
    if (!isPass) return;
    await queryEquity({leadConfigId});

    setConfirmShow(true);
  });

  const onFeedback = useMemoizedFn(async () => {
    const formValue = getValues();
    const isPass = validateForm(formValue, _t);
    if (!isPass) return;
    await submitReason({...formValue, leadConfigId});
    showToast(_t('bff1e22c62e94000a508'));
    setTimeout(() => {
      goBack();
    }, 500);
  });

  const onFinalSubmit = useMemoizedFn(async () => {
    const formValue = getValues();
    await submitReason({...formValue, leadConfigId});

    await applyRevertLeader({
      leadConfigId,
      subUID,
    });

    setConfirmShow(false);

    replace(RouterNameMap.UndoIdentitySuccessResult);
  });

  return {
    onUndo,
    onFeedback,
    onFinalSubmit,
    equityInfo,
    loading: {
      isPullEquityLoading,
      isSubmitReasonLoading,
      isApplyRevertLoading,
    },
  };
};
