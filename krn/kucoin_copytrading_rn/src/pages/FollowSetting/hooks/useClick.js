import {useLockFn, useMemoizedFn} from 'ahooks';
import {isEmpty} from 'lodash';
import {useMemo, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {showToast} from '@krn/bridge';

import {useMutation} from 'hooks/react-query';
import useGoBack from 'hooks/useGoBack';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {updateCopyConfig} from 'services/copy-trade';
import showError from 'utils/showError';
import {
  convertFormValue2Payload,
  convertFormValue2stopTakeDetailVOList,
  validateFormValueTPSLExistError,
} from '../presenter/helper';
import {useGetFormSceneStatus} from './useGetFormSceneStatus';
import {useGetTraderPositionSummaryInfo} from './useGetTraderPositionSummaryInfo';
import {useRewriteFormDetail} from './useRewriteFormDetail';
/** 更新跟单设置 账户止盈止损比例与当前收益率冲突 Code */
const UPDATE_COPY_CONFIG_TP_SL_EXPIRED_CODE = 400612;

export const useClick = ({tabValue, leadBizNo}) => {
  const followConfirmRef = useRef();
  const {onClickTrack} = useTracker();
  const dispatch = useDispatch();
  const {refetch: refetchTraderPositionSummaryInfo} =
    useGetTraderPositionSummaryInfo();
  const goBack = useGoBack();
  const {isReadonly} = useGetFormSceneStatus();

  const {_t} = useLang();
  const {mutateAsync, isLoading: isUpdateConfigLoading} = useMutation({
    mutationFn: updateCopyConfig,
    onSuccess: () => {
      // 保存成功后返回
      showToast(_t('dfc42366b0a54000ac21'));
      setTimeout(() => {
        goBack();
      }, 400);
    },
    onError: e => {
      // 异常后刷新收益率接口 触发校验更新
      if (+e?.code === UPDATE_COPY_CONFIG_TP_SL_EXPIRED_CODE) {
        refetchTraderPositionSummaryInfo();
        showToast(_t('51a2f7423dcc4000aa4e'));
        return;
      }
      showError(e, dispatch);
    },
    onSettled: (data, err) => {
      const {success, code, msg} = data || err || {};
      onClickTrack({
        blockId: 'button',
        locationId: 'updateCopyConfigButton',
        properties: {
          is_success: success,
          fail_reason: success ? 'none' : `${code || ''}:${msg || ''}`,
          fail_reason_code: success ? 'none' : code || '',
        },
      });
    },
  });

  const {data: configInfo} = useRewriteFormDetail();
  const saveAndTriggerConfirm = useMemoizedFn(formValue => {
    if (
      !formValue ||
      isEmpty(formValue) ||
      validateFormValueTPSLExistError(formValue)
    )
      return;
    const payload = convertFormValue2Payload({
      formValue,
      tabValue,
      leadBizNo,
    });

    try {
      onClickTrack({
        blockId: 'copy',
        locationId: 'copyButton',
        properties: {
          config: JSON.stringify(payload),
        },
      });
    } catch (error) {
      console.error('mylog ~ follow-setting track ~ error:', error);
    }

    followConfirmRef.current.open(payload);
  });

  const editCopyConfig = useMemoizedFn(async formValue => {
    if (
      !formValue ||
      isEmpty(formValue) ||
      validateFormValueTPSLExistError(formValue)
    )
      return;

    await mutateAsync({
      copyConfigId: configInfo?.copyConfigId,
      stopTakeDetailVOList: convertFormValue2stopTakeDetailVOList(formValue),
    });
  });
  const lockEditCopyConfig = useLockFn(editCopyConfig);

  const submitFollowConfig = useMemo(
    () => (!isReadonly ? saveAndTriggerConfirm : lockEditCopyConfig),
    [lockEditCopyConfig, isReadonly, saveAndTriggerConfirm],
  );
  return {
    followConfirmRef,
    submitFollowConfig,
    isLoading: isReadonly && isUpdateConfigLoading,
  };
};
