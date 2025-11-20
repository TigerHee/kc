/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import classname from 'classname';
import { throttle, get } from 'lodash';
import { Button } from '@kufox/mui';
import LangSelector from 'components/Header/LangSelector';
import { LANDING_HOST_COM, KUCOIN_HOST } from 'utils/siteConfig';
import { addLangToPath } from 'utils/lang';
import { kcsensorsClick } from 'utils/ga';
import logoImg from 'assets/luckydrawTurkey/logo.svg';
import shareImg from 'assets/luckydrawTurkey/share.svg';
import ellipseImg1 from 'assets/luckydrawTurkey/ellipse1.svg';
import ellipseImg2 from 'assets/luckydrawTurkey/ellipse2.svg';
import ellipseImg3 from 'assets/luckydrawTurkey/ellipse3.svg';
import ellipseImg4 from 'assets/luckydrawTurkey/ellipse4.svg';
import PosterShare from '../../MarketCommon/Share';
import { BANNER_CONFIG } from '../config';
import { handleLogin, handleSignup } from '../../MarketCommon/luckydrawCommon';

import styles from './style.less';

const Banner = ({ namespace = 'newCoinCarnival', round = 'one' }) => {
  const dispatch = useDispatch();
  const { isInApp, supportCookieLogin, currentLang } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);
  const { isReg, inviteCode, config } = useSelector(state => state[namespace]);
  const loading = useSelector(state => state.loading.effects[`${namespace}/activityReg`]);
  const shareRef = useRef(null);
  const content = BANNER_CONFIG[namespace];
  const shareLink = {
    one: addLangToPath(`${LANDING_HOST_COM}/treasure-coin-carnival?rcode=${inviteCode}`),
    two: addLangToPath(`${LANDING_HOST_COM}/treasure-coin-carnival-r2?rcode=${inviteCode}`),
  };
  const bannerUrl = get(config, 'param.iconUrl', '');
  const isZh = currentLang === 'zh_CN' || currentLang === 'zh_HK';
  const roundText = {
    two: isZh ? '第二轮' : 'Round 2',
  };

  useEffect(() => {
    return () => {
      shareRef.current = null;
    };
  }, []);

  const clickJoin = useCallback(
    throttle(async () => {
      kcsensorsClick(['join', '1']);
      if (isLogin) {
        const { data, code } = await dispatch({
          type: `${namespace}/activityReg`,
          payload: { activityName: content.activityName[round] },
        });
        if (!!data || code === '200200') {
          dispatch({
            type: `${namespace}/update`,
            payload: {
              dialogConfig: {
                show: true,
                content: <div className={styles.toastText}>{content.regToast[data || code]}</div>,
              },
            },
          });
          dispatch({
            type: `${namespace}/getRegStatus`,
            payload: { activityName: content.activityName[round] },
          });
        }
      } else {
        round === 'two'
          ? handleSignup(isInApp, supportCookieLogin, content.loginBackUrl[round])
          : handleLogin(isInApp, supportCookieLogin, content.loginBackUrl[round]);
      }
    }, 1000),
    [isLogin, namespace, isInApp, supportCookieLogin, dispatch],
  );

  const handleShare = () => {
    kcsensorsClick(['share', '1']);
    if (isLogin) {
      if (shareRef.current) {
        shareRef.current.goShare();
      }
    } else {
      round === 'two'
        ? handleSignup(isInApp, supportCookieLogin, content.loginBackUrl[round])
        : handleLogin(isInApp, supportCookieLogin, content.loginBackUrl[round]);
    }
  };

  return (
    <div className={styles.banner} inspector="banner">
      <img className={styles.ellipseImg1} src={ellipseImg1} alt="" />
      <img className={styles.ellipseImg2} src={ellipseImg2} alt="" />
      <img className={styles.ellipseImg3} src={ellipseImg3} alt="" />
      <img className={styles.ellipseImg4} src={ellipseImg4} alt="" />
      <div className={styles.inner}>
        <div>
          {isInApp ? null : (
            <div className={styles.bannerTop}>
              <a
                href={addLangToPath(`${KUCOIN_HOST}${window.location.search}`)}
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
              {window._BRAND_NAME_}
              <br />
              <span inspector="slogan">{content.title}</span>
              <br />
              <span>
                {round === 'two' ? (
                  <span className={styles.roundText}>{roundText[round]}</span>
                ) : null}
              </span>
              <div className={styles.newUserBox}>
                <div className={styles.newUserLeft} />
                <div className={styles.newUserRight}>{content.newUser}</div>
              </div>
            </h1>
            <div className={styles.subTitle}>{content.subTitle}</div>
            <div className={styles.btnGroup}>
              <Button
                className={classname(styles.joinBtn, { [styles.joinBtnDisable]: !!isReg })}
                disabled={!!isReg}
                onClick={clickJoin}
                loading={loading}
                name="inspector-join-button"
              >
                <span>{content.joinText[!!isReg]}</span>
              </Button>
              <Button
                name="inspector-share-button"
                variant="outlined"
                className={styles.shareBtn}
                onClick={handleShare}
              >
                <img className={styles.shareImg} src={shareImg} alt="share" />
                <span>{content.shareText}</span>
              </Button>
            </div>
          </div>
          <div className={styles.contentRight}>
            {bannerUrl ? <img src={bannerUrl} alt="banner" /> : null}
          </div>
        </div>
      </div>
      <PosterShare
        ref={shareRef}
        namespace={namespace}
        shareUrl={shareLink[round]}
        shareConfigure={{ round, currentLang }}
      />
    </div>
  );
};

export default Banner;
