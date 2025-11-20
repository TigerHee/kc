import {useLockFn, useMemoizedFn} from 'ahooks';
import {useDispatch} from 'react-redux';
import {showToast} from '@krn/bridge';

import {useRestrictModalControl} from 'components/GlobalModal/MountGlobalModal/hooks/useRestrictModalControl';
import {BUS_RESP_CODE_MAP} from 'constants/businessType';
import {AGREEMENT_SCENE_TYPE} from 'constants/index';
import {RouterNameMap} from 'constants/router-name-map';
import {useDoSignAgreementMutation} from 'hooks/copyTrade/queries/useAgreementListCenter';
import {useMutation} from 'hooks/react-query';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {createCopyConfig} from 'services/copy-trade';
import {removeUndefinedProperties} from 'utils/helper';
import showError from 'utils/showError';

export const useSubmit = ({
  confirmPayload,
  closeConfirm,
  isAgree,
  isSignPass,
}) => {
  const {replace} = usePush();
  const {_t} = useLang();
  const {openModalByRestrictBusCode} = useRestrictModalControl();
  const dispatch = useDispatch();
  const {onClickTrack} = useTracker();
  const confirmConfirmConfig = removeUndefinedProperties(confirmPayload);
  const {doSignTerms} = useDoSignAgreementMutation({
    scene: AGREEMENT_SCENE_TYPE.COPY_TRADE,
  });

  const {mutateAsync, isLoading} = useMutation({
    mutationFn: () => createCopyConfig(confirmConfirmConfig),
    onSuccess: () => {
      closeConfirm();
      replace(RouterNameMap.FollowSuccessResult);
    },
    onError: e => {
      if (
        [
          BUS_RESP_CODE_MAP.restrictFail,
          BUS_RESP_CODE_MAP.restrictAreaLimit,
        ].includes(+e?.code)
      ) {
        closeConfirm();
        openModalByRestrictBusCode(e.code);
        return;
      }
      showError(e, dispatch);
    },
    onSettled: (data, err) => {
      const {success, code, msg} = data || err || {};
      try {
        onClickTrack({
          blockId: 'copy',
          locationId: 'confirm',
          properties: {
            is_success: success,
            fail_reason: success ? 'none' : `${code || ''}:${msg || ''}`,
            fail_reason_code: success ? 'none' : code || '',
            config: JSON.stringify(confirmConfirmConfig),
          },
        });
      } catch (error) {
        console.error('mylog ~ follow-setting track ~ error:', error);
      }
    },
  });

  const submitConfigForm = useLockFn(mutateAsync);

  const submit = useMemoizedFn(async () => {
    if (!isSignPass) {
      if (!isAgree) {
        return showToast(_t('05650c67ccd84000a2bc'));
      }
      await doSignTerms();
    }
    submitConfigForm();
  });

  return {submit, isLoading};
};
