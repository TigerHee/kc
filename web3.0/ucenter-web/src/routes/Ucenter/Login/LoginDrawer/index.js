/**
 * Owner: willen@kupotech.com
 */
import { LoginDrawer } from '@kucoin-gbiz-next/entrance';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { useSnackbar, useTheme } from '@kux/mui';
import { $loginKey } from 'components/Entrance/const';
import { useQueryParams } from 'components/Entrance/hookTool';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';
import { push } from 'utils/router';

export default () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { loginOpen } = useSelector((state) => state.app);
  const { message } = useSnackbar();
  const { multiSiteConfig } = useMultiSiteConfig();

  const { back, isThird } = useQueryParams();

  const closeDrawer = useCallback(() => {
    dispatch({
      type: 'app/update',
      payload: {
        loginOpen: false,
      },
    });
  }, [dispatch]);

  return (
    loginOpen && (
      <LoginDrawer
        multiSiteConfig={multiSiteConfig}
        theme={theme.currentTheme}
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
        verifyCanNotUseClick={(token) => {
          push(addLangToPath(`/ucenter/reset-security/token/${token}`));
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
