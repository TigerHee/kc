/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useRef, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'dva';
import classname from 'classname';
import { throttle } from 'lodash';
import { Button } from '@kufox/mui';
import { message } from 'antd';
import PosterShare from '../../MarketCommon/Share';
import { handleLogin, BANNER_CONFIG } from '../config';
import siteConfig from 'utils/siteConfig';
import { addLangToPath } from 'utils/lang';
import styles from './style.less';
import logoImg from 'assets/luckydrawTurkey/logo.svg';
import shareImg from 'assets/luckydrawTurkey/share.svg';
import ellipseImg1 from 'assets/luckydrawTurkey/ellipse1.svg';
import ellipseImg2 from 'assets/luckydrawTurkey/ellipse2.svg';
import ellipseImg3 from 'assets/luckydrawTurkey/ellipse3.svg';
import ellipseImg4 from 'assets/luckydrawTurkey/ellipse4.svg';

const Banner = ({ namespace = 'luckydrawTurkey' }) => {
  const dispatch = useDispatch();
  const { isInApp, supportCookieLogin } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);
  const { isReg, inviteCode } = useSelector(state => state[namespace]);
  const loading = useSelector(state => state.loading.effects[`${namespace}/activityReg`]);
  const shareRef = useRef(null);
  const content = BANNER_CONFIG[namespace];

  useEffect(() => {
    return () => {
      shareRef.current = null;
    };
  }, []);

  const handleJoin = throttle(async () => {
    if (isLogin) {
      const { data } = await dispatch({
        type: `${namespace}/activityReg`,
        payload: { activityName: content.activityName },
      });
      if (!!data && content.regToast[data]) {
        message[content.regToast[data].type](content.regToast[data].msg);
        dispatch({
          type: `${namespace}/getRegStatus`,
          payload: { activityName: content.activityName },
        });
      }
    } else {
      handleLogin(isInApp, supportCookieLogin, content.loginBackUrl, content.utmSource);
    }
  }, 1000);

  const handleShare = () => {
    if (isLogin) {
      if (shareRef.current) {
        shareRef.current.goShare();
      }
    } else {
      handleLogin(isInApp, supportCookieLogin, content.loginBackUrl, content.utmSource);
    }
  };

  return (
    <div className={styles.banner} inspector="banner">
      {content.showFlashLight ? (
        <Fragment>
          <img className={styles.ellipseImg1} src={ellipseImg1} alt="" />
          <img className={styles.ellipseImg2} src={ellipseImg2} alt="" />
          <img className={styles.ellipseImg3} src={ellipseImg3} alt="" />
          <img className={styles.ellipseImg4} src={ellipseImg4} alt="" />
        </Fragment>
      ) : null}
      <div className={styles.inner}>
        {isInApp ? null : (
          <a
            href={
              content.homeUrl || addLangToPath(`${siteConfig.KUCOIN_HOST}${window.location.search}`)
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.logoImg} src={logoImg} alt="logo" />
          </a>
        )}
        <div className={styles.content}>
          <div className={styles.contentLeft}>
            <h1 className={styles.title} inspector="title">
              {content.title}
            </h1>
            <p className={styles.subTitle} inspector="sub_title">
              {content.subTitle}
            </p>
            <div inspector="btn_group" className={styles.btnGroup}>
              <Button
                className={classname(styles.joinBtn, { [styles.joinBtnDisable]: !!isReg })}
                disabled={!!isReg}
                onClick={handleJoin}
                loading={loading}
              >
                <span>{content.joinText[!!isReg]}</span>
              </Button>
              <Button variant="outlined" className={styles.shareBtn} onClick={handleShare}>
                <img className={styles.shareImg} src={shareImg} alt="share" />
                <span>{content.shareText}</span>
              </Button>
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
      <PosterShare ref={shareRef} namespace={namespace} shareUrl={content.shareUrl(inviteCode)} />
    </div>
  );
};

export default Banner;
