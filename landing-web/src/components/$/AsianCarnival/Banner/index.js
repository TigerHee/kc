/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import classname from 'classname';
import { throttle } from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button } from '@kufox/mui';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import LangSelector from 'components/Header/LangSelector';
import { BANNER_CONFIG } from '../config';
import { handleLogin, handleJoin } from '../../MarketCommon/luckydrawCommon';
import siteConfig from 'utils/siteConfig';
import { addLangToPath, _t } from 'utils/lang';
import styles from './style.less';
import logoImg from 'assets/luckydrawTurkey/logo.svg';
import shareImg from 'assets/luckydrawTurkey/share.svg';
import ellipseImg1 from 'assets/luckydrawTurkey/ellipse1.svg';
import ellipseImg2 from 'assets/luckydrawTurkey/ellipse2.svg';
import ellipseImg3 from 'assets/luckydrawTurkey/ellipse3.svg';
import ellipseImg4 from 'assets/luckydrawTurkey/ellipse4.svg';

const Banner = ({ namespace = 'asianCarnival' }) => {
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const { isInApp, supportCookieLogin } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);
  const { isReg, inviteCode } = useSelector(state => state[namespace]);
  const loading = useSelector(state => state.loading.effects[`${namespace}/activityReg`]);
  const content = BANNER_CONFIG[namespace];
  const inviteLink = addLangToPath(
    `${siteConfig.LANDING_HOST_COM}/kucoin-asian-carnival-kok?rcode=${inviteCode}`,
  );
  const copyText = isLogin ? `${content.title} ${content.subTitle} ${inviteLink}` : ' ';

  const clickJoin = useCallback(
    throttle(() => {
      if (isLogin) {
        handleJoin({
          dispatch,
          namespace,
          activityName: content.activityName,
          regToast: content.regToast,
        });
      } else {
        handleLogin(isInApp, supportCookieLogin, content.loginBackUrl);
      }
    }, 1000),
    [isLogin, namespace, isInApp, supportCookieLogin, dispatch],
  );

  const handleShare = () => {
    if (isLogin) {
      message.success(_t('kok.share.tips'));
    } else {
      handleLogin(isInApp, supportCookieLogin, content.loginBackUrl);
    }
  };

  return (
    <div className={styles.banner}>
      <img className={styles.ellipseImg1} src={ellipseImg1} alt="" />
      <img className={styles.ellipseImg2} src={ellipseImg2} alt="" />
      <img className={styles.ellipseImg3} src={ellipseImg3} alt="" />
      <img className={styles.ellipseImg4} src={ellipseImg4} alt="" />
      <div className={styles.inner}>
        <div>
          {isInApp ? null : (
            <div className={styles.bannerTop}>
              <a
                href={addLangToPath(`${siteConfig.KUCOIN_HOST}${window.location.search}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className={styles.logoImg} src={logoImg} alt="logo" />
              </a>
              <LangSelector />
            </div>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.contentLeft}>
            <h1 className={styles.title} inspector="title">
              {content.title}
            </h1>
            <p className={styles.subTitle} inspector="sub_title">
              {content.subTitle}
            </p>
            <div className={styles.btnGroup} inspector="btn_group">
              <Button
                className={classname(styles.joinBtn, { [styles.joinBtnDisable]: !!isReg })}
                disabled={!!isReg}
                onClick={clickJoin}
                loading={loading}
              >
                <span>{content.joinText[!!isReg]}</span>
              </Button>
              <CopyToClipboard text={copyText} onCopy={handleShare}>
                <Button variant="outlined" className={styles.shareBtn}>
                  <img className={styles.shareImg} src={shareImg} alt="share" />
                  <span>{content.shareText}</span>
                </Button>
              </CopyToClipboard>
            </div>
          </div>
          <img
            inspector="banner_img"
            className={styles.contentRight}
            src={content.bannerBgImg}
            alt="banner"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
