/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useState, Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classname';
import { Button, Input, Dialog } from '@kufox/mui';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import DrawerSignUp from 'components/DrawerSignUp';
import { REGEXP } from 'components/DrawerSignUp/const';
import { getHomeUrl, PROMOTION_UTM_SOURCE, useIsMobile } from 'components/$/MarketCommon/config';
import { _tHTML, addLangToPath } from 'utils/lang';
import { KUCOIN_HOST } from 'utils/siteConfig';
import JsBridge from 'utils/jsBridge';
import systemDynamic from 'utils/systemDynamic';
import styles from './style.less';
import bannerImg from 'assets/consensus/banner.png';

const SignUpNoLayout = systemDynamic('@remote/entrance', 'SignUpNoLayout');

const Banner = () => {
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { isInApp } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('sign.email.tab');
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [mobileVisible, setMobileVisible] = useState(false);

  const handleChange = e => {
    setInputValue(e.target.value);
  };

  const handleSignUp = () => {
    const isPhone = REGEXP.phone.test(inputValue);

    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/user/register?${encodeURIComponent(
            `isPhone=${isPhone ? 'true' : 'false'}&data=${inputValue}&phoneCode=+1`,
          )}`,
        },
      });
      return;
    }

    if (!inputValue) {
      setTabKey('sign.email.tab');
      setEmail(null);
      setPhone(null);
    } else if (isPhone) {
      setTabKey('sign.phone.tab');
      setPhone(inputValue);
      setEmail(null);
    } else {
      setTabKey('sign.email.tab');
      setEmail(inputValue);
      setPhone(null);
    }

    if (isMobile) {
      setMobileVisible(true);
    } else {
      setVisible(true);
    }
  };

  // H5注册成功回调
  const afterSignUpCallback = () => {
    message.success('Registration successful!');
    // 关闭注册弹窗
    setMobileVisible(false);
    window.location.reload();
  };

  const goHome = useCallback((e)=>{
    e.preventDefault();
    const url = getHomeUrl(PROMOTION_UTM_SOURCE);
    window.open(url,"_blank");
  }, []);

  const renderLogo = useMemo(() => {
    return isInApp ? null : (
      <a href={addLangToPath(KUCOIN_HOST)} onClick={goHome} target="_blank" rel="noopener noreferrer">
        <img className={styles.logoImg} src={window._BRAND_LOGO_} alt="logo" fetchpriority="low" />
      </a>
    );
  }, [isInApp]);

  return (
    <Fragment>
      <div>{renderLogo}</div>
      <div className={styles.content}>
        <div className={styles.conItems}>
          <h1 className={styles.title}>
            Find the Next <span>Crypto Gem</span> on {window._BRAND_NAME_}
          </h1>
          <p className={styles.subTitle}>1 Out of 4 Crypto Holders Worldwide Is with {window._BRAND_NAME_}</p>
          <div className={styles.btnGroup}>
            <Input
              classNames={{
                container: styles.inputContainer,
                input: styles.inputContent,
              }}
              placeholder="Email / Phone number"
              onChange={handleChange}
            />
            <Button
              className={classnames(styles.btnStyle, { [styles.btnDisable]: !!isLogin })}
              disabled={isLogin}
              onClick={handleSignUp}
            >
              Sign up
            </Button>
          </div>
        </div>
        <div className={classnames(styles.conItems, styles.conHeight)}>
          <img className={styles.banner} src={bannerImg} alt="banner" fetchpriority="high" />
        </div>
      </div>

      <div>
        {visible && !isInApp ? (
          <Dialog
            open={true}
            title={null}
            footer={null}
            onCancel={() => setVisible(false)}
            className={styles.diaStyle}
          >
            <SignUpNoLayout
              agreeJSX={_tHTML('term.user.agree')}
              tabKey={tabKey}
              initEmail={email}
              initPhone={phone}
              onChange={data => {
                message.success('Registration successful!');
                setVisible(false);
                window.location.reload();
              }}
             />
          </Dialog>
        ) : null}
      </div>

      <div>
        {isMobile && !isInApp && mobileVisible ? (
          <DrawerSignUp
            showDiscount
            open
            tabKey={tabKey}
            initEmail={email}
            initPhone={phone}
            onClose={() => setMobileVisible(false)}
            onChange={afterSignUpCallback}
          />
        ) : null}
      </div>
    </Fragment>
  );
};

export default Banner;
