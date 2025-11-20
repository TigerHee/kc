/*
 * @Date: 2024-05-27 14:36:02
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 14:47:18
 */
/**
 * Owner: willen@kupotech.com
 */
import { useSnackbar } from '@kufox/mui';
import loadable from '@loadable/component';
import { $loginKey } from 'components/Entrance/const';
import { useQueryParams } from 'components/Entrance/hookTool';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { addLangToPath, _t } from 'tools/i18n';
import { push } from 'utils/router';

const LoginDrawer = loadable(() => System.import('@kucoin-biz/entrance'), {
  resolveComponent: (module) => module.LoginDrawer,
});

export default () => {
  const dispatch = useDispatch();
  const { loginOpen } = useSelector((state) => state.entranceDrawer);
  const { message } = useSnackbar();

  const { back, isThird } = useQueryParams();

  const closeDrawer = useCallback(() => {
    dispatch({
      type: 'entranceDrawer/update',
      payload: {
        loginOpen: false,
      },
    });
  }, [dispatch]);

  return (
    loginOpen && (
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
              window.location.href = addLangToPath(`${window.location.origin}/utransfer`);
            }
          }
          closeDrawer();
        }}
        onForgetPwdClick={() => {
          closeDrawer();
          push('/ucenter/reset-password');
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
    )
  );
};
