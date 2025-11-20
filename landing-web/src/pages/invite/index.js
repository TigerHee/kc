/**
 * Owner: terry@kupotech.com
 */
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { useHistory } from 'react-router';
import { get } from 'lodash';
import { APP_HOST } from 'config';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { useIsMobile } from 'components/Responsive';
import DrawerSignUp from 'components/DrawerSignUp';
import Header from 'components/$/Invite/Header';
import Brand from 'components/$/Invite/Brand';
import Rewards from 'components/$/Invite/Rewards';
import Share from 'components/common/GbizShare';
import TipDialog from 'components/$/Invite/TipDialog';
import { useElementVisible } from 'src/hooks/useElementVisible';
import { backToLottery, getLotteryShareLink } from 'components/$/Invite/utils';
import { kcsensorsManualExpose } from 'utils/ga';
import { sensors } from 'utils/sensors';
import JsBridge from 'utils/jsBridge';
import { _t } from 'utils/lang';
import {
  Container,
  Wrapper,
  ContentWrapper,
  RewardsWrapper,
} from 'components/$/Invite/styles';

const shareTexts = [
  {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 5,
    wordSpace: 2,
    text: _t('2nSfUwshASZ99x3EVTfKbY'),
    x: 60,
    y: 615,
    firstWidth: 200,
    needCompute: true,
    newLine: true,
    independent: true,
  },
  {
    color: '#b8c6d8',
    fontSize: 14,
    fontWeight: '400',
    wordSpace: 2,
    text: _t('tTdJ285sQmv1dNrMq9FiFG'),
    x: 60,
    y: 645,
    needCompute: true,
    newLine: true,
    independent: true,
  },
];

const Invite = () => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { activityInfo } = useSelector((state) => state.invite);
  const { isInApp, appInfo, appVersion, currentLang } = useSelector((state) => state.app);
  const { isLogin } = useSelector(state => state.user);
  const [open, updateOpen] = useState(false);
  const openSignUp = () => updateOpen(true);
  const shareRef = useRef(null);
  const {
    location: {
      query = {},
    },
  } = useHistory();
  const { rcode, subject, uid, utm_source, ...params } = query || {};
  const isError = !subject;
  // 分享配置
  const shareTitle = _t('tpjP1GXXHwtogik4c2GKpt');
  
  const shortLink = getLotteryShareLink({
    subject,
      ...params,
      utm_source,
  }, { isInApp, appInfo});

  const shareModalTitle = currentLang === 'en_US' ? 'Share to Friends' : _t('anniversaryNew.reivew.share');
  const sharePoster = (supportGallery, galleryLink, imgPath) => {
    // 新app版本的多张海报分享
    if (supportGallery) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'share',
          category: 'gallery',
          data: JSON.stringify({
            galleryType: 'CUSTOMER_INVITE',
            galleryLink,
            needQrCode: true,
          }),
        },
      });
      return;
    }
    // 低版本的默认分享
    JsBridge.open({
      type: 'func',
      params: {
        name: 'share',
        category: 'img',
        pic: imgPath,
      },
    });
  };
  const openShareModal = useCallback(() => {
    sensors.trackClick(['goShare', '1']);
    if (isInApp) {
      // 生成图片,然后单张图片分享
      shareRef.current?.goShare((imgPath) => {
        sharePoster(false, shortLink, imgPath);
      });
    } else {
      shareRef.current?.goShare();
    }
  }, [isInApp, shortLink]);

  const goHome = useCallback(() => {
    if (isInApp) {
      JsBridge.open({
        type: "func",
        params: {
          name: "exit",
        },
      });
    } else {
      window.location.href = APP_HOST;
    }
  }, [isInApp]);

  // 注册成功, 跳转回活动抽奖任务界面
  const afterSignUpCallback = (user) => {
    if (!user) return;
    backToLottery({
      subject,
      ...params,
      utm_source,
    }, { isInApp });
  };
  // 已登录状态, 跳转回活动抽奖任务界面
  useEffect(() => {
    if (!isLogin) return;
    backToLottery({
      subject,
      ...params,
      utm_source,
    }, { isInApp })
  }, [isLogin, subject, params, utm_source, isInApp]);

  useEffect(() => {
    if (isError) return;
    if (uid) {
      dispatch({
        type: 'invite/getUserName',
        payload: {
          uid
        }
      });
    }
    dispatch({
      type: 'invite/getActivityInfo',
      payload: {
        subject,
      }
    });
    dispatch({
      type: 'invite/getPrizeList',
      payload: {
        subject,
      }
    });
  }, [isError, uid, subject, dispatch]);

  // 曝光埋点
  useEffect(() => {
    kcsensorsManualExpose({ subject }, ['View', '1'], {
      language: currentLang,
      subject,
    })
  }, [currentLang, subject]);

  const shareImg = useMemo(() => {
    try {
      const { content } = activityInfo || {};
      if (!content) return;
      const dataI18n = get(JSON.parse(content), 'rows[0].cells[0].dataI18n');
      if (!dataI18n) return;
      const config = dataI18n[currentLang] || dataI18n['en_US'] || dataI18n['zh_HK'];
      if (!config) return;
      return config.sharePosterUrl;
    } catch (e) {
      console.error(e);
    }
  }, [activityInfo, currentLang]);

  const ele = useElementVisible('template-5-invite-page', 'restrictNotice');
  const bannerHeight = ele?.show ? (ele?.el?.clientHeight || 0) : 0;

  return (
    <Wrapper data-inspector="InvitePage">
      <Header
        clickSignUp={openSignUp}
        handleClickShare={openShareModal}
        subject={subject}
        shareImg={shareImg}
        bannerHeight={bannerHeight}
      />
      <Container isInApp={isInApp} bannerHeight={bannerHeight}>
        <ContentWrapper>
          <Brand
            clickSignUp={openSignUp}
            query={query}
            currentLang={currentLang}
          />
        </ContentWrapper>
        <RewardsWrapper>
          <Rewards />
        </RewardsWrapper>
      </Container>
      <DrawerSignUp
        showDiscount={false}
        open={open}
        tabKey="sign.email.tab"
        onClose={() => updateOpen(false)}
        onChange={afterSignUpCallback}
      />
      <Share
        shareTitle={shareTitle}
        shareLink={shortLink}
        shareImg={shareImg}
        shareTexts={shareTexts}
        shareModalTitle={shareModalTitle}
        onRefReady={(node) => {
          console.log('GbizShare onRefReady', node);
          shareRef.current = node;
        }}
      />
      {
        isError && (
          <TipDialog
            open
            size={isMobile ? "mini" : "basic"}
            showCloseX={false}
            maskClosable={false}
            onOk={goHome}
            onCancel={goHome}
            cancelText={null}
            okText={_t('mYxNxiDByWBjBHckrVc3sf')}
            header={null}
          >
            <p>{_t('a45YrfQ6QHts1RSQ8uUM2c')}</p>
          </TipDialog>
        )
      }
    </Wrapper>
  )
};

export default brandCheckHoc(Invite, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));