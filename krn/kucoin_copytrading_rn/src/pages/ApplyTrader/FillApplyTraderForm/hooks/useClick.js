import {useLockFn} from 'ahooks';
import {useDispatch, useSelector} from 'react-redux';
import {showToast} from '@krn/bridge';

import {BUS_RESP_CODE_MAP} from 'constants/businessType';
import {AGREEMENT_SCENE_TYPE} from 'constants/index';
import {RouterNameMap} from 'constants/router-name-map';
import {
  useAgreementListQuery,
  useDoSignAgreementMutation,
} from 'hooks/copyTrade/queries/useAgreementListCenter';
import {useMutation} from 'hooks/react-query';
import useKyc from 'hooks/useKyc';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {applyLeadTraders} from 'services/copy-trade';
import showError from 'utils/showError';
import {convertFormValueToPayload} from '../helper';

export const useClick = ({isAgree}) => {
  const {onClickTrack} = useTracker();
  const {
    isSignPass,
    isFetched,
    isLoading: isPullAgreementLoading,
  } = useAgreementListQuery({scene: AGREEMENT_SCENE_TYPE.LEAD_TRADE});

  const {replace} = usePush();
  const userInfo = useSelector(state => state.app.userInfo);
  const {_t} = useLang();
  const {validateAndOpenKycInfo} = useKyc();
  const dispatch = useDispatch();

  const {mutateAsync, isLoading: isSubmitLoading} = useMutation({
    mutationFn: async payload => await applyLeadTraders(payload),
    onSuccess: () => {
      // 进入 申请成功结果页
      replace(RouterNameMap.ApplySuccessResult);
    },
    onError: e => {
      if (+e?.code === BUS_RESP_CODE_MAP.EditNickNameReplyError) {
        showToast(_t('0049cd3755f74000a32b'));
        return;
      }
      showError(e, dispatch);
    },
  });
  const doApply = useLockFn(mutateAsync);

  const {doSignTerms} = useDoSignAgreementMutation({
    scene: AGREEMENT_SCENE_TYPE.LEAD_TRADE,
  });

  const receiveFormSubmit = async formValues => {
    const isPassKyc = await validateAndOpenKycInfo();
    onClickTrack({
      blockId: 'button',
      locationId: 'applyButton',
      fail_reason: `isAgree:${isAgree}, isPassKyc:${isPassKyc}`,
    });

    if (!isPassKyc) return;

    if (!isAgree && !isSignPass && isFetched) {
      return showToast(_t('05650c67ccd84000a2bc'));
    }

    !isSignPass && (await doSignTerms());
    doApply(convertFormValueToPayload(formValues, userInfo));
  };

  return {
    isPullAgreementLoading,
    isSubmitLoading,
    receiveFormSubmit,
  };
};
