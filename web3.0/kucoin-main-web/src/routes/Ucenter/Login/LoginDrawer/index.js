/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { useQueryParams } from 'components/Entrance/hookTool';
import { push } from 'utils/router';
import { message } from 'components/Toast';
import { $loginKey } from 'components/Entrance/const';
import { _t } from 'tools/i18n';
import { LoginDrawer } from '@kucoin-biz/entrance';

export default () => {
  const dispatch = useDispatch();
  const { loginOpen } = useSelector((state) => state.app);

  const { back, isThird } = useQueryParams();

  const closeDrawer = useCallback(() => {
    dispatch({
      type: 'app/update',
      payload: {
        loginOpen: false,
      },
    });
  }, [dispatch]);

  const openForgetPwd = useCallback(() => {
    dispatch({
      type: 'app/update',
      payload: {
        forgetPwdOpen: true,
      },
    });
  }, [dispatch]);

  return (
    <LoginDrawer
      loginKey={$loginKey}
      open={loginOpen}
      showLoginSafeWord
      anchor="right"
      onClose={() => {
        closeDrawer();
      }}
      onSuccess={(data) => {
        message.success(_t('operation.succeed'));

        if (isThird) {
          window.location.href = back;
        } else {
          const { finishUpgrade } = data;
          if (finishUpgrade) {
            window.location.reload(true);
          } else {
            push('/utransfer');
          }
        }
        closeDrawer();
      }}
      onForgetPwdClick={() => {
        closeDrawer();
        openForgetPwd();
      }}
      verifyCanNotUseClick={(key, token) => {
        const pathMap = {
          GFA: `/ucenter/reset-g2fa/${token}`,
          SMS: `/ucenter/rebind-phone/${token}`,
        };
        // if (key === 'GFA' && finishUpgrade === false) {
        //   return window.open(G2FALinks[currentLang] || G2FALinks.default, '_blank');
        // }
        push(pathMap[key]);
        closeDrawer();
      }}
      signOrDownClick={() => {
        push('/ucenter/signup');
        closeDrawer();
      }}
      BoxProps={{
        maxWidth: 528,
        width: '100%',
        p: 8,
        pb: 5,
        height: '100%',
      }}
    />
  );
};
