/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { connect } from 'dva';
import loadable from '@loadable/component';
import { useIsMobile } from 'components/Responsive';
import useLayzComponent from 'src/hooks/useLayzComponent';

const loadableFunc = () =>
  loadable(() => System.import('@remote/entrance'), {
    resolveComponent: (module) => {
      return module.ForgetPwdDrawer;
    },
  });


function ForgetPwd({ dispatch, showForgetPwdDrawer, onClickForgetBack }) {
  const isMobile = useIsMobile();

  const closeForgetPwd = useCallback(() => {
    dispatch({
      type: 'user/update',
      payload: {
        showForgetPwdDrawer: false,
        onClickForgetBackFromLogin: undefined,
      },
    });
  }, [dispatch]);

  const openLogin = useCallback(() => {
    dispatch({
      type: 'user/update',
      payload: {
        showLoginDrawer: true,
      },
    });
  }, [dispatch]);

  const BoxProps = isMobile ? {
    width: '100vw',
    p: 3,
  } : undefined;

  const ForgetPwdDrawer = useLayzComponent({
    show: !!showForgetPwdDrawer,
    loadableFunc,
  });

  if (!ForgetPwdDrawer) return null;
  return (
      <ForgetPwdDrawer
        anchor="right"
        onClose={closeForgetPwd}
        open={showForgetPwdDrawer}
        onSuccess={() => {
          closeForgetPwd();
          openLogin();
        }}
        BoxProps={BoxProps}
        onBack={onClickForgetBack || undefined}
      />
  );
}

export default connect(({ app, user }) => {
  return {
    showForgetPwdDrawer: user.showForgetPwdDrawer,
    onClickForgetBack: user.onClickForgetBackFromLogin,
    currentLang: app.currentLang,
  };
})(ForgetPwd);
