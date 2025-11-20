/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { styled } from '@kufox/mui/emotion';
import { useLogin } from 'src/hooks';
import { _t } from 'utils/lang';
import CupCommonDialog from 'components/$/CryptoCup/common/CupCommonDialog';
import { cryptoCupTrackClick, cryptoCupExpose, getAppLoginParams } from '../config';
import Components from './Common';

const { OkButton, CancelButtonBox, CancelButton } = Components;

const OkButtonNew = styled(OkButton)`
  margin-top: 16px;
`;

const LoginModal = () => {
  const dispatch = useDispatch();
  const { handleLogin } = useLogin();
  const { helpModalName } = useSelector(state => state.cryptoCup);
  const open = helpModalName === 'login';

  const handleCancel = useCallback(
    () => {
      dispatch({
        type: 'cryptoCup/update',
        payload: {
          helpModalName: '',
        },
      });
    },
    [dispatch],
  );

  const goLogin = useCallback(
    () => {
      handleCancel();
      handleLogin(getAppLoginParams());
      cryptoCupTrackClick(['helplogin', '1']);
    },
    [handleLogin, handleCancel],
  );

  useEffect(
    () => {
      if (open) {
        cryptoCupExpose(['helplogin', '1']);
      }
    },
    [open],
  );

  return (
    <CupCommonDialog open={open} title={_t('pozPyJjP5vwdLo9epPq97G')} onCancel={handleCancel}>
      <OkButtonNew fullWidth onClick={goLogin}>
        {_t('qHgev3CjfcsfWUM72T5uSe')}
      </OkButtonNew>
      <CancelButtonBox>
        <CancelButton onClick={handleCancel}>{_t('sJBJSCy6Wd7hN7r3LHWqZ9')}</CancelButton>
      </CancelButtonBox>
    </CupCommonDialog>
  );
};

export default LoginModal;
