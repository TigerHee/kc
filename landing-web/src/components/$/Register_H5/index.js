/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Helmet } from 'react-helmet';
import { ThemeProvider } from '@kufox/mui';
import Notice from './Notice';
import Header from './Header';
import Banner from './Banner';
import Content from './Content';
import Bonus from './Bonus';
import Footer from './Footer';
import { trackFbRegister, uet_report_conversion } from 'components/$/RegisterCommon/tool';
import DrawerSignUp from 'components/DrawerSignUp';
import { _t } from 'utils/lang';
import styles from './style.less';

// 注册召回：1代表落地注册页
const CAPTURE_WAY = 1;

const Register = () => {
  const dispatch = useDispatch();
  const {
    drawerSignUpTabKey,
    drawerSignUpInitEmail,
    drawerSignUpInitPhone,
    drawerSignUpOpen,
  } = useSelector(state => state.register);

  // 注册成功回调
  const afterSignUpCallback = useCallback((data) => {
    window.ym(84577030, 'reachGoal', 'registration');
    uet_report_conversion();
    trackFbRegister(data);
   
    window.location.href = '/referral';
  }, []);

  return (
    <ThemeProvider>
    <div className={styles.container}>
      <Helmet>
        <title>{_t('register.title')}</title>
        <meta name="description" content={_t('register.description')} />
      </Helmet>
      <Notice />
      <Header />
      <Banner />
      <Content />
      <Bonus />
      <Footer />
      <DrawerSignUp
        showDiscount
        recallType={CAPTURE_WAY}
        open={drawerSignUpOpen}
        tabKey={drawerSignUpTabKey}
        initEmail={drawerSignUpInitEmail}
        initPhone={drawerSignUpInitPhone}
        onClose={() => {
          dispatch({
            type: 'register/update',
            payload: {
              drawerSignUpOpen: false,
            },
          });
        }}
        onChange={afterSignUpCallback}
      />
    </div>
    </ThemeProvider>
  );
};

export default Register;
