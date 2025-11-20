/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'dva';
import loadable from '@loadable/component';
import { getSpm } from 'utils/sensors';
import { getPageId } from 'utils/ga';
import { addLangToPath } from 'utils/lang';
import useLayzComponent from 'src/hooks/useLayzComponent';
import { useIsMobile } from 'components/Responsive';
import { commonInterfaceCache, commonInterfaceCacheExpireTime } from 'config';
import { KUCOIN_HOST } from 'utils/siteConfig';
import storage, { kucoinStorage } from 'utils/storage';

const loadableFunc = () =>
  loadable(() => System.import('@remote/entrance'), {
    resolveComponent: (module) => {
      return module.LoginDrawer;
    },
  });


const _loginKey = () => {
  try {
    const val = kucoinStorage.getItem('login_key');
    return val || '';
  } catch (e) {
    return '';
  }
};

// 未迁移用户在谷歌不可用时跳转链接不一样
export const G2FALink = `${KUCOIN_HOST}/support/requests`;

export default connect(({ app, user }) => {
  return {
    showLoginDrawer: user.showLoginDrawer,
    reloadWhenLoginSuccess: user.reloadWhenLoginSuccess,
    signDownClickProps: user.signDownClickProps,
    source: user.source,
    currentLang: app.currentLang,
  };
})(
  ({
    dispatch,
    showLoginDrawer,
    source,
    currentLang,
    signDownClickProps,
    reloadWhenLoginSuccess,
  }) => {
    const isMobile = useIsMobile();

    const closeDrawer = useCallback(
      (shouldReOpenLogin = false) => {
        const payload = {
          showLoginDrawer: false,
        };
        if (!shouldReOpenLogin) {
          payload.signDownClickProps = null;
        }
        dispatch({
          type: 'user/update',
          payload,
        });
      },
      [dispatch],
    );

    const openLoginFromForgetPwd = useCallback(() => {
      dispatch({
        type: 'user/update',
        payload: {
          showForgetPwdDrawer: false,
          onClickForgetBackFromLogin: undefined,
          showLoginDrawer: true,
        },
      });
    }, [dispatch]);

    const openForgetPwd = useCallback(
      (shouldReOpenLogin = false) => {
        dispatch({
          type: 'user/update',
          payload: {
            showForgetPwdDrawer: true,
            onClickForgetBackFromLogin: shouldReOpenLogin ? openLoginFromForgetPwd : undefined,
          },
        });
      },
      [dispatch, openLoginFromForgetPwd],
    );

    const [_pageId, updatePageId] = useState('');
    useEffect(() => {
      const init = async () => {
        const id = await getPageId();
        updatePageId(id);
      };
      init();
    }, []);

    const BoxProps = isMobile
      ? {
          width: '100vw',
          p: 3,
        }
      : undefined;
    
    const LoginDrawer = useLayzComponent({
      loadableFunc,
      show: showLoginDrawer,
    });
    if (!LoginDrawer) return null;

    return (
      <LoginDrawer
        loginKey={_loginKey() || ''}
        trackingConfig={{ source }}
        open={showLoginDrawer}
        showLoginSafeWord
        anchor="right"
        onClose={() => {
          closeDrawer();
        }}
        onSuccess={() => {
          storage.removeItem(commonInterfaceCacheExpireTime);
          storage.removeItem(commonInterfaceCache);
          if (reloadWhenLoginSuccess) {
            window.location.reload();
            return;
          }
          dispatch({
            type: 'user/update',
            payload: { showLoginDrawer: false, signDownClickProps: null },
          });
          dispatch({ type: 'app/initApp' });
        }}
        onForgetPwdClick={() => {
          const { pageId } = signDownClickProps || {};
          const shouldReOpenLogin = pageId && _pageId === pageId;
          closeDrawer(shouldReOpenLogin);
          openForgetPwd(shouldReOpenLogin);
        }}
        verifyCanNotUseClick={(key, token, finishUpgrade) => {
          const pathMap = {
            GFA: `/ucenter/reset-g2fa/${token}`,
            SMS: `/ucenter/rebind-phone/${token}`,
          };

          if (key === 'GFA' && finishUpgrade === false) {
            return (window.location.href = addLangToPath(G2FALink));
          }
          const path = pathMap[key];
          window.location.href = `${KUCOIN_HOST}${path}?lang=${currentLang}`;
          closeDrawer();
        }}
        signOrDownClick={async () => {
          const { pageId, signDownClick } = signDownClickProps || {};
          // 传入执行自定义的signDownClick方法
          if (pageId && _pageId === pageId && typeof signDownClick === 'function') {
            signDownClick();
          } else {
            const spm = await getSpm();
            const spmid = spm ? spm?.compose(['register', '1']) || '' : '';
            window.location.href = `${KUCOIN_HOST}/ucenter/signup?lang=${currentLang}&spm=${spmid}`;
            closeDrawer();
          }
        }}
        BoxProps={BoxProps}
      />
    );
  },
);
