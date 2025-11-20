/**
 * @owner: Clyne@kupotech.com
 */
import { useSelector } from 'dva';
import React from 'react';
import { LoginWrapper } from 'src/trade4.0/pages/Fund/style';
import getMainsiteLink from 'src/utils/getMainsiteLink';
import { _tHTML } from 'src/utils/lang';

const LoginPanel = ({ children }) => {
  const { registerUrl } = getMainsiteLink();
  const isLogin = useSelector((state) => state.user.isLogin);

  if (!isLogin) {
    return <LoginWrapper>{_tHTML('trd.form.login.reg', { registerUrl })}</LoginWrapper>;
  }

  return children;
};

export default LoginPanel;
