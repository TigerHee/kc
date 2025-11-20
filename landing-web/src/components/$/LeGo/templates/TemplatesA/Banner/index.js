/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useRef, useEffect, useCallback, Fragment, useMemo } from 'react';
import { useDispatch } from 'dva';
import { useSelector } from 'hooks';

import qs from 'qs';
import { useHistory } from 'react-router';
import classname from 'classname';
import { throttle} from 'lodash';
import { Button } from '@kufox/mui';
import { addLangToPath } from 'utils/lang';
import { kcsensorsClick } from 'utils/ga';
import { getText } from 'components/$/LeGo/config';
import PosterShare from 'components/$/MarketCommon/Share';
import ActivityPeriod from 'components/$/LeGo/templates/TemplatesA/ActivityPeriod';
import ByVisible from 'components/$/LeGo/hocs/ByVisible';
import {
  getLinkByScene,
  getSignUpUrl,
  handleSignUp,
} from 'components/$/MarketCommon/config';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import shareImg from 'assets/lego/share.svg';
import ellipseImg1 from 'assets/lego/ellipse1.svg';
import ellipseImg2 from 'assets/lego/ellipse2.svg';
import ellipseImg3 from 'assets/lego/ellipse3.svg';
import ellipseImg4 from 'assets/lego/ellipse4.svg';
import { BANNER_CONFIG } from '../config';
import { isRTLLanguage } from 'utils/langTools';
import { SHARE_APP_HOST } from 'config';

import styles from './style.less';

const Banner = ({ content }) => {
  const {
    location: { pathname },
  } = useHistory();
  const dispatch = useDispatch();
  const { isInApp, supportCookieLogin, currentLang } = useSelector((state) => state.app);
  const { isLogin, user } = useSelector((state) => state.user);
  const { isReg, inviteCode, config, translate, isAe } = useSelector((state) => state.lego);
  const loading = useSelector((state) => state.loading.effects[`lego/activityReg`]);
  const shareRef = useRef(null);
  const { channelCode = '', legoNameEn = '', legoCode = '' } = config;
  // 过滤url不需要的参数
  // rcode utm_source 存储在storage中
  const rcode = queryPersistence.getPersistenceQuery('rcode');
  const utm_source = queryPersistence.getPersistenceQuery('utm_source');
  const queryValue = {
    rcode: rcode,
    utm_source: utm_source,
  };
  const queryParams = qs.stringify(queryValue);
  const query = queryParams ? `?${queryParams}` : '';
  // 分享链接
  const shareLink = getLinkByScene({
    rcode: inviteCode,
    utm_source: channelCode,
    scene: 'share',
    needConvertedUrl: addLangToPath(`${SHARE_APP_HOST}/promotions/${legoCode}${query}`),
  });
  // 是预览页
  const isPreview = pathname.includes('/promotions-preview/');
  // 副标题
  const subTitleMeta = getText(content.subTitle, translate);
  const temp1 = subTitleMeta.replace(/{/g, '<span>');
  const temp2 = temp1.replace(/}/g, '</span>');
  const subTitle = { __html: temp2 };
  // 分享图的副标题
  const shareSubTitle = temp2.replace(/<[^>]*>/g, '');
  // banner图
  const bannerUrl = content?.bannerImg && translate ? translate[content.bannerImg] : '';

  useEffect(() => {
    return () => {
      shareRef.current = null;
    };
  }, []);

  const clickJoin = useCallback(
    throttle(async () => {
      kcsensorsClick([`join_${legoNameEn}`, '1']);
      if (isPreview) return;
      if (isLogin) {
        const { data, code } = await dispatch({
          type: 'lego/activityReg',
          payload: { activityName: legoNameEn },
        });
        if (data || code === '110020') {
          dispatch({
            type: 'lego/update',
            payload: {
              dialogConfig: {
                show: true,
                content: (
                  <div className={styles.toastText}>{BANNER_CONFIG.regToast[data || code]}</div>
                ),
              },
            },
          });
          dispatch({
            type: 'lego/getRegStatus',
            payload: { activityName: legoNameEn },
          });
        }
      } else {
        handleSignUp(isInApp, supportCookieLogin, getSignUpUrl(channelCode));
      }
    }, 1000),
    [isInApp, isLogin, isPreview, legoNameEn, supportCookieLogin, channelCode, dispatch],
  );

  const handleShare = () => {
    kcsensorsClick([`share_${legoNameEn}`, '1']);
    if (isPreview) return;
    if (isLogin) {
      if (shareRef.current) {
        shareRef.current.goShare();
      }
    } else {
      handleSignUp(isInApp, supportCookieLogin, getSignUpUrl(channelCode));
    }
  };
  const isRTL = isRTLLanguage(currentLang);

  return (
    <Fragment>
      <div className={styles.banner} id="newPromotionsBanner">
        <img
          className={classname(styles.ellipseImg1, { [styles.arLeft]: isRTL })}
          src={ellipseImg1}
          alt=""
        />
        <img
          className={classname(styles.ellipseImg2, { [styles.arLeft]: isRTL })}
          src={ellipseImg2}
          alt=""
        />
        <img
          className={classname(styles.ellipseImg3, { [styles.arLeft]: isRTL })}
          src={ellipseImg3}
          alt=""
        />
        <img
          className={classname(styles.ellipseImg4, { [styles.arRight]: isRTL })}
          src={ellipseImg4}
          alt=""
        />
        <div className={styles.inner}>
          <div className={styles.content}>
            <div className={styles.contentLeft}>
              <h1 className={styles.title} data-title>
                {getText(content.title, translate)}
              </h1>
              <ByVisible visible={content.subTitleVisible}>
                <h2 className={styles.subTitle} data-subtitle>
                  <div dangerouslySetInnerHTML={subTitle} />
                </h2>
              </ByVisible>
              <ByVisible visible={content.subInfoVisible}>
                <h3 className={styles.subInfo} data-subinfo>
                  {getText(content.subInfo, translate)}
                </h3>
              </ByVisible>

              <div className={styles.btnGroup}>
                <ByVisible visible={content.joinVisible !== false}>
                  <Button
                    data-join
                    className={classname(styles.joinBtn, { [styles.joinBtnDisable]: !!isReg })}
                    disabled={!!isReg}
                    onClick={clickJoin}
                    loading={loading}
                  >
                    <span>{BANNER_CONFIG.joinText[!!isReg]}</span>
                  </Button>
                </ByVisible>
                <ByVisible visible={content.shareVisible !== false}>
                  <Button
                    data-share
                    variant="outlined"
                    className={classname(styles.shareBtn, {
                      [styles.shareBtnRever]: isAe,
                      [styles.shareBtnLeft]: content.joinVisible === false,
                    })}
                    onClick={handleShare}
                  >
                    <img className={styles.shareImg} src={shareImg} alt="share" />
                    <span>{BANNER_CONFIG.shareText}</span>
                  </Button>
                </ByVisible>
              </div>
            </div>
            <div className={styles.contentRight}>
              {bannerUrl ? <img data-banner src={bannerUrl} alt="banner" /> : null}
            </div>
          </div>
        </div>
        <PosterShare
          ref={shareRef}
          namespace="lego"
          shareUrl={shareLink}
          needQrCode
          shareConfigure={{
            title: getText(content.title, translate),
            subTitle: content.subTitleVisible ? shareSubTitle : '',
          }}
        />
      </div>
      <ByVisible visible={content.activityInfoVisible !== false}>
        <ActivityPeriod info={getText(content.activityInfo, translate)} currentLang={currentLang} />
      </ByVisible>
    </Fragment>
  );
};

export default React.memo(Banner);
