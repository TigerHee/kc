/*
 * owner: june.lee@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useSnackbar, useEventCallback } from '@kux/mui';
import loadable from '@loadable/component';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from '@tools/i18n';
import { getInnerUrl } from '../utils/tools';
import { confirmUserAgreement } from '../services/convert';
import { NAMESPACE } from '../config';
import useContextSelector from '../hooks/common/useContextSelector';

const AgreeDialogEntry = loadable(() => import('../components/common/AgreeDialog'));

const AgreeDialogRender = () => {
  const { message } = useSnackbar();
  const { t: _t } = useTranslation('convert');
  const dispatch = useDispatch();
  const isLogin = useContextSelector((state) => {
    console.log('state.user', state.user);
    return Boolean(state.user);
  });
  const isSub = useContextSelector((state) => state.user?.isSub);
  const agreeDialogOpen = useSelector((state) => state[NAMESPACE].agreeDialogOpen);
  const agreementUrl = useSelector((state) => state[NAMESPACE].agreementUrl);

  useEffect(() => {
    if (isLogin) {
      dispatch({
        type: `${NAMESPACE}/checkConvertOpen`,
      });
    }
  }, [dispatch, isLogin]);

  const onCancel = useCallback(() => {
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        agreeDialogOpen: false,
      },
    });
  }, [dispatch]);

  const onSuccess = useEventCallback(() => {
    // 直接关闭弹窗
    onCancel();
  });

  const onFail = useEventCallback((e) => {
    message.error(e.msg || e.message);
  });

  const openLink = (e) => {
    e.preventDefault();
    if (e.target?.nodeName === 'A') {
      const tragetUrl = getInnerUrl(agreementUrl);
      const newPage = window.open(tragetUrl, '_blank');
      if (newPage?.opener) newPage.opener = null;
    }
  };

  return (
    <AgreeDialogEntry
      isSub={isSub}
      onFail={onFail}
      onCancel={onCancel}
      postFn={confirmUserAgreement}
      open={agreeDialogOpen}
      onSuccess={onSuccess}
      id="option_agree_dialog"
      title={_t('3ff86053d4284800aae1')}
      describe={_t('4141671aee324800a9ab')}
      acceptText={
        <span onClick={openLink}>
          <Trans
            i18nKey="d04114b063764000a887"
            ns="convert"
            values={{ href: getInnerUrl(agreementUrl) }}
            components={{
              a: (
                // eslint-disable-next-line jsx-a11y/control-has-associated-label
                <a href={getInnerUrl(agreementUrl)} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          />
        </span>
      }
    />
  );
};

export default AgreeDialogRender;
