/**
 * Owner: willen@kupotech.com
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Button, useResponsive, toast } from '@kux/design';
import { WarningIcon, ArrowRight2Icon, ArrowRightIcon, CloseIcon, SuccessIcon } from '@kux/iconpack';
import { IS_SSG_ENV } from 'kc-next/env';
import { getIsApp } from 'kc-next/boot';
import { kcsensorsManualTrack } from 'tools/sensors';
import useRealInteraction from 'hooks/useRealInteraction';
import storage from 'tools/storage';
import addLangToPath from 'tools/addLangToPath';
import pathToRegexp from 'path-to-regexp';
import Marquee from 'react-fast-marquee';
import { ROUTE_BIZ_SCENE } from 'packages/userRestrictedCommon/src/config';
import { TOP_MESSAGE_DISABLE_ROUTE } from './config';
import { useSiteConfig } from '../siteConfig';
import BrowserExtensionNotice from '../BrowserExtensionNotice';
import styles from './styles.module.scss';
import { useHeaderStore, HeaderStoreProvider } from '../model';
import { ACCOUNT_TRANSFER_BIZ_TYPE, resolveNoticeFetch } from './utils';
import { IP_DISMISS_NOTICE_TYPE } from './constants';
import { useTranslation } from 'tools/i18n';
import useLang from 'hooks/useLang';
import HeaderErrorBoundary from '../HeaderErrorBoundary';
import useExternalSync from '../useExternalSync';

export const HEIGHT = 40;

const COLOR_MAP = {
  SUCCESS: 'var(--kux-brandGreen)',
  WARN: 'var(--kux-brandYellow)',
};
const DEFAULT_COLOR = 'var(--kux-brandRed)';

const NoticeLayout = ({ notice, closable, closeShow, currentLang, bizType, passType }) => {
  const { buttonAgree, buttonAgreeWebUrl, topMessage, title, displayType, configCode } = notice || {};
  const titleRef = useRef(null);
  const titleParentRef = useRef(null);
  const [needScroll, setNeedScroll] = useState(false);
  const rv = useResponsive();
  const downSmall = rv === 'sm';
  const [showDrawer, setShowDrawer] = useState(false);
  const siteConfig = useSiteConfig();

  const clickClose = () => {
    if (typeof closeShow === 'function') {
      closeShow();
      kcsensorsManualTrack(
        {
          spm: ['topMessage', '1'],
          data: {
            guideType: bizType,
            name: 'title_popup',
            reportType: 'close',
            guideColor: displayType,
            popType: passType === 'moveCheck' ? 'active' : passType === 'timeCheck' ? 'passive' : '',
            modelCode: configCode,
          },
        },
        'publicGuideEvent'
      );
    }
  };

  useEffect(() => {
    // 加上一定的延时，防止拿不到正确的dom size
    setTimeout(() => {
      const titleEl: any = titleRef.current;
      const parentEl: any = titleParentRef.current;
      if (titleEl && parentEl) {
        const _needScroll = titleEl.clientWidth > parentEl.clientWidth + 12;
        if (_needScroll) {
          // 设置滚动容器的父元素宽度，使react-fast-marquee可以准确计算父容器宽度
          titleEl.style.width = `${titleEl.clientWidth}px`;
          setNeedScroll(true);
        } else {
          setNeedScroll(false);
        }
      }
    }, 100);
  }, [titleRef.current, titleParentRef.current, rv]);

  useEffect(() => {
    kcsensorsManualTrack(
      {
        spm: ['topMessage', '1'],
        data: {
          guideType: bizType,
          name: 'title_popup',
          reportType: 'show',
          guideColor: displayType,
          popType: passType === 'moveCheck' ? 'active' : passType === 'timeCheck' ? 'passive' : '',
          modelCode: configCode,
        },
      },
      'publicGuideEvent'
    );
  }, [bizType, displayType, passType, configCode]);

  const handleClickJump = () => {
    kcsensorsManualTrack(
      {
        spm: ['topMessage', '1'],
        data: {
          guideType: bizType,
          name: 'title_popup',
          reportType: 'click',
          guideColor: displayType,
          popType: passType === 'moveCheck' ? 'active' : passType === 'timeCheck' ? 'passive' : '',
          modelCode: configCode,
        },
      },
      'publicGuideEvent'
    );
  };

  return (
    <div
      id="restrictNotice"
      className={styles.wrapper}
      data-inspector="inspector_top_restrict_notice"
      data-nosnippet
      style={{
        height: `${HEIGHT}px`,
        lineHeight: `${HEIGHT}px`,
        background:
          displayType === 'SUCCESS'
            ? 'var(--color-primary8)'
            : displayType === 'WARN'
            ? 'var(--color-complementary8)'
            : 'var(--color-secondary8)',
      }}
    >
      <div className={styles.main} onClick={() => setShowDrawer(true)}>
        <WarningIcon
          className={styles.extendWarnIcon}
          style={{
            color: COLOR_MAP[displayType] || DEFAULT_COLOR,
          }}
        />
        <span
          ref={titleParentRef}
          className={styles.content}
          style={{
            color: COLOR_MAP[displayType] || DEFAULT_COLOR,
          }}
        >
          <span ref={titleRef} style={{ display: 'inline-block' }}>
            {needScroll ? (
              <Marquee autoFill delay={1.5} pauseOnHover={!downSmall}>
                {topMessage}
                <span className={styles.marqueeGap} />
              </Marquee>
            ) : (
              <span>{topMessage}</span>
            )}
          </span>
        </span>
        {downSmall ? (
          <div className={styles.smallPageArrowRight}>
            <ArrowRightIcon />
          </div>
        ) : buttonAgreeWebUrl && buttonAgree ? (
          <span
            className={styles.link}
            style={{
              color: COLOR_MAP[displayType] || DEFAULT_COLOR,
            }}
          >
            <a
              onClick={handleClickJump}
              href={
                buttonAgreeWebUrl.startsWith('http')
                  ? addLangToPath(buttonAgreeWebUrl)
                  : addLangToPath(`${siteConfig.KUCOIN_HOST}${buttonAgreeWebUrl}`)
              }
              rel="noopener noreferrer"
            >
              {buttonAgree}
              <ArrowRight2Icon className={styles.iCArrowRight2OutlinedIcon} />
            </a>
          </span>
        ) : null}
      </div>
      {closable ? <CloseIcon className={styles.closeIcon} onClick={clickClose} /> : null}
      {downSmall ? (
        <Modal
          title={title}
          isOpen={showDrawer}
          onClose={() => setShowDrawer(false)}
          mobileTransform
          className={styles.extendDrawer}
        >
          <div className={styles.drawerMain}>
            <div className={styles.drawerContent}>{topMessage}</div>
            {buttonAgreeWebUrl && buttonAgree ? (
              <a
                onClick={handleClickJump}
                href={
                  buttonAgreeWebUrl.startsWith('http')
                    ? addLangToPath(buttonAgreeWebUrl)
                    : addLangToPath(`${siteConfig.KUCOIN_HOST}${buttonAgreeWebUrl}`)
                }
              >
                <Button className={styles.drawerButton}>{buttonAgree}</Button>
              </a>
            ) : null}
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

/**
 * 1.这里dva参数，一般不能传，如果项目页面没有kcHeader，但是又单独使用了RestrictNotice，就需要传dva
 * 适配useSelector((s) => s['$header_header']?.isShowRestrictNotice);这种方式
 * 2.Header内，不能给RestrictNotice传入dva参数，不然会重复执行
 * @returns
 */
const RestrictNotice = ({ userInfo, pathname, currentLang, restrictNoticeStayDuration = 5000, dva = null }) => {
  const [restrictMessageVisible, setRestrictMessageVisible] = useState<any>(null);
  // 记录最后一次请求接口的scene
  const lastRequestScene = useRef(null);
  const [restrictMessageInfo, setRestrictMessageInfo] = useState<any>({});
  const realInteraction = useRealInteraction({ stayDuration: restrictNoticeStayDuration });
  const updateRestrictNoticeHeight = useHeaderStore(state => state.updateRestrictNoticeHeight);
  const updateHeader = useHeaderStore(state => state.updateHeader);
  const { t } = useTranslation('header');

  useExternalSync('$header_header', dva);

  // 当前路由对应的业务code
  const currentPathScene = useMemo(() => {
    let scene;
    // 尝试获取当前路由对应的业务code，取不到则不传
    Object.keys(ROUTE_BIZ_SCENE).forEach(key => {
      const selectPath = ROUTE_BIZ_SCENE[key];
      const paths = typeof selectPath === 'string' ? [selectPath] : selectPath;
      if (paths.some(pattern => pathToRegexp(pattern).test(pathname))) {
        scene = key;
      }
    });
    return scene;
  }, [pathname]);

  const updateRestrictNoticeVisibleModel = visible => {
    setRestrictMessageVisible(visible);
    updateHeader?.({ isShowRestrictNotice: visible });
    updateRestrictNoticeHeight?.({ restrictNoticeHeight: visible ? HEIGHT : 0 });
  };

  const fetchDismiss = useCallback(async () => {
    if (
      // 判断当前路由是否在黑名单中
      TOP_MESSAGE_DISABLE_ROUTE.some(pattern => pathToRegexp(pattern).test(pathname)) ||
      // 在app内
      getIsApp() ||
      // 当用户登录后手动关闭了顶飘，那本次登录周期内不会再弹，若未登录则每次刷新页面都会弹
      +storage.getItem('GBIZ_TOP_MESSAGE_CLOSE_TIME') === +userInfo?.lastLoginAt
    ) {
      updateRestrictNoticeVisibleModel(false);
      // 命中禁用顶飘逻辑，本次请求直接中断
      return;
    }

    const { result, type } = await resolveNoticeFetch(currentPathScene, t, toast);

    if (type === IP_DISMISS_NOTICE_TYPE) {
      // 记录请求的scene
      lastRequestScene.current = currentPathScene;
    }

    if (result?.data && Object.keys(result.data).length) {
      // 找到第一个dismiss为true的bizType
      const displayBizType = Object.keys(result.data).find(key => result.data?.[key]?.dismiss);
      const dismissNoticeData = result.data[displayBizType as keyof typeof result.data]?.notice;
      if (dismissNoticeData?.topMessage) {
        updateRestrictNoticeVisibleModel(true);
        setRestrictMessageInfo({
          bizType: displayBizType,
          notice: dismissNoticeData,
          // 取不到值时设为true
          closable: dismissNoticeData.closable ?? true,
          closeShow: dismissNoticeData.closeShow ?? true,
        });
      } else {
        updateRestrictNoticeVisibleModel(false);
      }
    } else {
      updateRestrictNoticeVisibleModel(false);
    }
  }, [userInfo?.lastLoginAt, pathname, currentPathScene]);

  useEffect(() => {
    if (
      // 非ssg状态
      !IS_SSG_ENV &&
      // 且发生了真实交互
      realInteraction.pass &&
      // 且当前路由对应的scene发生了变化触发请求
      lastRequestScene.current !== currentPathScene
    ) {
      fetchDismiss();
    }
  }, [IS_SSG_ENV, realInteraction.pass, fetchDismiss, lastRequestScene.current, currentPathScene]);

  // 将顶飘高度存到redux，供业务获取后处理偏移
  // useEffect(() => {
  //   dispatch({ type: `${namespace}/update`, payload: { restrictNoticeHeight: HEIGHT } });
  // }, []);

  if (restrictMessageVisible && restrictMessageInfo.bizType) {
    return (
      <NoticeLayout
        passType={realInteraction.passType}
        currentLang={currentLang}
        bizType={restrictMessageInfo.bizType}
        notice={restrictMessageInfo.notice}
        closable={restrictMessageInfo.closable}
        closeShow={() => {
          if (userInfo?.lastLoginAt) {
            storage.setItem('GBIZ_TOP_MESSAGE_CLOSE_TIME', userInfo.lastLoginAt);
          }
          updateRestrictNoticeVisibleModel(false);
          try {
            if (typeof restrictMessageInfo.closeShow === 'function') {
              restrictMessageInfo.closeShow();
            }
          } catch (error) {
            console.error('show restrictMessageInfo error:', error);
          }
        }}
      />
    );
  }

  /* 当且仅当其他顶飘状态已经初始化且不展示维护顶飘以及没有其他顶飘内容的时候，才会展示浏览器插件的安全警告 */
  if (restrictMessageVisible === false) {
    return <BrowserExtensionNotice userInfo={userInfo} currentLang={currentLang} />;
  }

  return null;
};

export default RestrictNotice;

// 暴露给外部使用的组件
export const RestrictNoticeWithTheme = ({ userInfo, pathname, currentLang, restrictNoticeStayDuration }) => {
  return (
    <HeaderErrorBoundary>
      <HeaderStoreProvider>
        <RestrictNotice
          userInfo={userInfo}
          pathname={pathname}
          currentLang={currentLang}
          restrictNoticeStayDuration={restrictNoticeStayDuration}
        />
      </HeaderStoreProvider>
    </HeaderErrorBoundary>
  );
};
