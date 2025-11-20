/**
 * Owner: borden@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import Script from 'react-load-script';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'dva';
import { useResponsive, useSnackbar } from '@kux/mui';
import { searchToJson, getJWTPath } from 'helper';
import storage from 'src/utils/storage';
import { _t, addLangToPath } from 'src/utils/lang';
import { isRTLLanguage } from 'src/utils/langTools';
import systemDynamic from 'src/utils/systemDynamic';
import { siteCfg } from 'config';

const { MAINSITE_HOST } = siteCfg;
const LoginDrawer = systemDynamic('@kucoin-biz/entrance', 'LoginDrawer');

export const G2FALinks = {
  zh_CN: 'https://support.kucoin.plus/hc/zh-cn/requests/new',
  en_US: 'https://support.kucoin.plus/hc/en-us/requests/new',
  default: 'https://support.kucoin.plus/hc/en-us/requests/new',
};

export default () => {
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const { message } = useSnackbar();
  const { currentTheme } = useTheme();
  const { open, currentLang } = useSelector(state => state.app);
  const isRTL = useMemo(() => isRTLLanguage(currentLang), [currentLang]);
  const drawerAnchor = !sm ? 'bottom' : (isRTL ? 'left' : 'right');

  const closeDrawer = useCallback(() => {
    dispatch({
      type: 'app/update',
      payload: {
        open: false,
      },
    });
  }, []);

  const openForgetPwd = useCallback(() => {
    dispatch({
      type: 'app/update',
      payload: {
        showForgetPwd: true,
      },
    });
  }, []);

  return (
    <React.Fragment>
      {/* 验证只需要在登录时需要 */}
      {open && (
        <Script
          url="https://www.recaptcha.net/recaptcha/api.js?render=explicit"
          defer
        />
      )}
      <LoginDrawer
        data-inspector="tradeV4_loginDrawer"
        loginKey={storage.getItem('login_key', 'kucoinv2')}
        showLoginSafeWord
        show={open}
        anchor={drawerAnchor}
        onClose={() => {
          closeDrawer();
        }}
        trackingConfig={{
          source: 'B5trading',
        }}
        onSuccess={(data) => {
          message.success(_t('operation.succeed'));
          const query = searchToJson();
          const { jwtLogin, return_to, back } = query || {};
          if (jwtLogin && return_to) {
            window.location.href = getJWTPath('zendesk', jwtLogin, return_to);
          } else if (back && window._CHECK_BACK_URL_IS_SAFE_(back)) {
            window.location.href = back;
          } else {
            const { finishUpgrade } = data;
            if (finishUpgrade) {
              window.location.reload(true);
            } else {
              window.location.href = addLangToPath(
                `${MAINSITE_HOST}/utransfer`,
              );
            }
          }
          closeDrawer();
        }}
        verifyCanNotUseClick={(key, token, finishUpgrade) => {
          const pathMap = {
            GFA: `${MAINSITE_HOST}/ucenter/reset-g2fa/${token}`,
            SMS: `${MAINSITE_HOST}/ucenter/rebind-phone/${token}`,
          };
          if (key === 'GFA' && finishUpgrade === false) {
            return window.open(
              G2FALinks[currentLang] || G2FALinks.default,
              '_blank',
            );
          }
          window.location.href = addLangToPath(`${pathMap[key]}`);
          closeDrawer();
        }}
        onForgetPwdClick={() => {
          closeDrawer();
          openForgetPwd();
        }}
        signOrDownClick={() => {
          window.location.href = addLangToPath(
            `${MAINSITE_HOST}/ucenter/signup`,
          );
          closeDrawer();
        }}
        theme={currentTheme}
      />
    </React.Fragment>
  );
};
