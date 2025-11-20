/**
 * Owner: willen@kupotech.com
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  styled,
  Drawer,
  Button,
  isPropValid,
  useSnackbar,
  ThemeProvider,
  useResponsive,
  Snackbar,
} from '@kux/mui';
import {
  ICWarningOutlined,
  ICArrowRight2Outlined,
  ICArrowRightOutlined,
  ICCloseOutlined,
  ICSuccessOutlined,
} from '@kux/icons';
import addLangToPath from '@tools/addLangToPath';
import { kcsensorsManualTrack } from '@utils/sensors';
import useRealInteraction from '@hooks/useRealInteraction';
import storage from '@utils/storage';
import pathToRegexp from 'path-to-regexp';
import { useDispatch } from 'react-redux';
import Marquee from 'react-fast-marquee';
import { ROUTE_BIZ_SCENE } from '@packages/userRestrictedCommon/src/config';
import { useTranslation } from '@tools/i18n';
import { isSSG, checkIsInApp } from '../../common/tools';
import { TOP_MESSAGE_DISABLE_ROUTE } from './config';
import { namespace } from '../model';
import siteConfig from '../siteConfig';
import BrowserExtensionNotice from '../BrowserExtensionNotice';
import { ACCOUNT_TRANSFER_BIZ_TYPE, resolveNoticeFetch } from './utils';
// import useLang from '../../hookTool/useLang';
import { IP_DISMISS_NOTICE_TYPE } from './constants';

export const HEIGHT = 40;

const { SnackbarProvider } = Snackbar;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${HEIGHT}px;
  text-align: center;
  background: ${({ theme, displayType }) =>
    displayType === 'SUCCESS'
      ? theme.colors.primary8
      : displayType === 'WARN'
      ? theme.colors.complementary8
      : theme.colors.secondary8};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${HEIGHT}px;
  padding-right: 40px;
  padding-left: 40px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-right: 12px;
    padding-left: 12px;
  }
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;
`;

const ExtendWarnIcon = styled(ICWarningOutlined, {
  shouldForwardProp: (props) => isPropValid(props),
})`
  font-size: 16px;
  flex-shrink: 0;
  color: ${({ theme, displayType }) =>
    displayType === 'SUCCESS'
      ? theme.colors.primary
      : displayType === 'WARN'
      ? theme.colors.complementary
      : theme.colors.secondary};
  margin-right: 8px;
  [dir='rtl'] & {
    margin-right: 0;
    margin-left: 8px;
  }
`;

const ExtendSUccessIcon = styled(ICSuccessOutlined, {
  shouldForwardProp: (props) => isPropValid(props),
})`
  font-size: 16px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 8px;
  [dir='rtl'] & {
    margin-right: 0;
    margin-left: 8px;
  }
`;

const Content = styled.span`
  overflow: hidden;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  color: ${({ theme, displayType }) =>
    displayType === 'SUCCESS'
      ? theme.colors.primary
      : displayType === 'WARN'
      ? theme.colors.complementary
      : theme.colors.secondary};
  margin-right: 8px;
  white-space: nowrap;
  position: relative;
  top: -1px;
  [dir='rtl'] & {
    margin-right: 0;
    margin-left: 8px;
  }
`;

const MarqueeGap = styled.span`
  display: inline-block;
  width: 100px;
`;

const CloseIcon = styled(ICCloseOutlined)`
  width: 14px;
  height: 14px;
  cursor: pointer;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text60};
  [dir='rtl'] & {
    margin-left: unset;
    margin-right: 8px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-left: 8px;
    border-left: 1px solid ${({ theme }) => theme.colors.divider8};
    box-sizing: content-box;
    [dir='rtl'] & {
      border-left: unset;
      border-right: 1px solid ${({ theme }) => theme.colors.divider8};
      padding-left: unset;
      padding-right: 8px;
    }
  }
`;

const Link = styled.span`
  display: inline-block;
  padding: 2px 8px 2px 12px;
  border: 1px solid;
  text-align: center;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  word-break: keep-all;
  white-space: nowrap;
  color: ${({ theme, displayType }) =>
    displayType === 'SUCCESS'
      ? theme.colors.primary
      : displayType === 'WARN'
      ? theme.colors.complementary
      : theme.colors.secondary};
  [dir='rtl'] & {
    padding: 2px 12px 2px 8px;
  }
  & > a {
    display: flex;
    align-items: center;
    svg {
      margin-left: 2px;
      [dir='rtl'] & {
        margin-left: unset;
        margin-right: 2px;
      }
    }
  }
  & a,
  a:hover,
  a:visited,
  a:active {
    color: inherit;
    text-decoration: none;
  }
`;
const ICArrowRight2OutlinedIcon = styled(ICArrowRight2Outlined)`
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

const SmallPageArrowRight = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  svg {
    color: ${({ theme }) => theme.colors.text60};
    [dir='rtl'] & {
      transform: scaleX(-1);
    }
  }
`;

const ExtendDrawer = styled(Drawer)`
  max-height: 66.7vh;
  min-height: 33.3vh;
  .KuxModalHeader-root {
    height: 56px;
    padding: 0 16px;
    flex-shrink: 0;
    .KuxModalHeader-close {
      top: 14px;
      width: 28px;
      height: 28px;
      right: 16px;
    }
    .KuxModalHeader-title {
      font-size: 18px;
      font-weight: 700;
      line-height: 130%;
      color: ${({ theme }) => theme.colors.text};
    }
  }
  .KuxDrawer-content {
    display: flex;
  }
`;

const DrawerMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;

  a {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
  }
`;
const DrawerContent = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  overflow: auto;
`;
const DrawerButton = styled(Button)`
  height: 48px;
  font-size: 16px;
  line-height: 130%;
  word-break: break-word;
`;

const NoticeLayout = ({ notice, closable, closeShow, currentLang, bizType, passType }) => {
  const { buttonAgree, buttonAgreeWebUrl, topMessage, title, displayType, configCode } =
    notice || {};
  const titleRef = useRef(null);
  const titleParentRef = useRef(null);
  const [needScroll, setNeedScroll] = useState(false);
  const rv = useResponsive();
  const downSmall = !rv?.sm;
  const [showDrawer, setShowDrawer] = useState(false);
  const noticeIcon =
    displayType === 'SUCCESS' && bizType === ACCOUNT_TRANSFER_BIZ_TYPE ? (
      <ExtendSUccessIcon />
    ) : (
      <ExtendWarnIcon displayType={displayType} />
    );

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
            popType:
              passType === 'moveCheck' ? 'active' : passType === 'timeCheck' ? 'passive' : '',
            modelCode: configCode,
          },
        },
        'publicGuideEvent',
      );
    }
  };

  useEffect(() => {
    // 加上一定的延时，防止拿不到正确的dom size
    setTimeout(() => {
      const titleEl = titleRef.current;
      const parentEl = titleParentRef.current;
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
      'publicGuideEvent',
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
      'publicGuideEvent',
    );
  };

  return (
    <Wrapper
      displayType={displayType}
      id="restrictNotice"
      data-inspector="inspector_top_restrict_notice"
      data-nosnippet
    >
      <Main onClick={() => setShowDrawer(true)}>
        {/* <ExtendWarnIcon displayType={displayType} /> */}
        {noticeIcon}
        <Content ref={titleParentRef} displayType={displayType}>
          <span ref={titleRef} style={{ display: 'inline-block' }}>
            {needScroll ? (
              <Marquee autoFill delay={1.5} pauseOnHover={!downSmall}>
                {topMessage}
                <MarqueeGap />
              </Marquee>
            ) : (
              <span>{topMessage}</span>
            )}
          </span>
        </Content>
        {downSmall ? (
          <SmallPageArrowRight>
            <ICArrowRightOutlined />
          </SmallPageArrowRight>
        ) : buttonAgreeWebUrl && buttonAgree ? (
          <Link displayType={displayType}>
            <a
              onClick={handleClickJump}
              href={
                buttonAgreeWebUrl.startsWith('http')
                  ? addLangToPath(buttonAgreeWebUrl, currentLang)
                  : addLangToPath(`${siteConfig.KUCOIN_HOST}${buttonAgreeWebUrl}`, currentLang)
              }
              rel="noopener noreferrer"
            >
              {buttonAgree}
              <ICArrowRight2OutlinedIcon />
            </a>
          </Link>
        ) : null}
      </Main>
      {closable ? <CloseIcon onClick={clickClose} /> : null}
      {downSmall ? (
        <ExtendDrawer
          title={title}
          show={showDrawer}
          onClose={() => setShowDrawer(false)}
          anchor="bottom"
          back={false}
          keepMounted
        >
          <DrawerMain>
            <DrawerContent>{topMessage}</DrawerContent>
            {buttonAgreeWebUrl && buttonAgree ? (
              <a
                onClick={handleClickJump}
                href={
                  buttonAgreeWebUrl.startsWith('http')
                    ? addLangToPath(buttonAgreeWebUrl, currentLang)
                    : addLangToPath(`${siteConfig.KUCOIN_HOST}${buttonAgreeWebUrl}`, currentLang)
                }
              >
                <DrawerButton>{buttonAgree}</DrawerButton>
              </a>
            ) : null}
          </DrawerMain>
        </ExtendDrawer>
      ) : null}
    </Wrapper>
  );
};

const RestrictNotice = ({ userInfo, pathname, currentLang, restrictNoticeStayDuration = 5000 }) => {
  const [restrictMessageVisible, setRestrictMessageVisible] = useState(null);
  // 记录最后一次请求接口的scene
  const lastRequestScene = useRef(null);
  const [restrictMessageInfo, setRestrictMessageInfo] = useState({});
  const realInteraction = useRealInteraction({ stayDuration: restrictNoticeStayDuration });
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  // const { _t } = useLang();

  const { t } = useTranslation('header');

  // 当前路由对应的业务code
  const currentPathScene = useMemo(() => {
    let scene;
    // 尝试获取当前路由对应的业务code，取不到则不传
    Object.keys(ROUTE_BIZ_SCENE).forEach((key) => {
      const selectPath = ROUTE_BIZ_SCENE[key];
      const paths = typeof selectPath === 'string' ? [selectPath] : selectPath;
      if (paths.some((pattern) => pathToRegexp(pattern).test(pathname))) {
        scene = key;
      }
    });
    return scene;
  }, [pathname]);

  const updateRestrictNoticeVisibleModel = (visible) => {
    setRestrictMessageVisible(visible);
    dispatch({
      type: `${namespace}/update`,
      payload: { isShowRestrictNotice: visible },
    });
    dispatch({
      type: `${namespace}/updateRestrictNoticeHeight`,
      payload: { restrictNoticeHeight: visible ? HEIGHT : 0 },
    });
  };

  const fetchDismiss = useCallback(async () => {
    if (
      // 判断当前路由是否在黑名单中
      TOP_MESSAGE_DISABLE_ROUTE.some((pattern) => pathToRegexp(pattern).test(pathname)) ||
      // 在app内
      checkIsInApp() ||
      // 当用户登录后手动关闭了顶飘，那本次登录周期内不会再弹，若未登录则每次刷新页面都会弹
      +storage.getItem('GBIZ_TOP_MESSAGE_CLOSE_TIME') === +userInfo?.lastLoginAt
    ) {
      updateRestrictNoticeVisibleModel(false);
      // 命中禁用顶飘逻辑，本次请求直接中断
      return;
    }

    const { result, type } = await resolveNoticeFetch(currentPathScene, t, message);

    if (type === IP_DISMISS_NOTICE_TYPE) {
      // 记录请求的scene
      lastRequestScene.current = currentPathScene;
    }

    if (result?.data && Object.keys(result.data).length) {
      // 找到第一个dismiss为true的bizType
      const displayBizType = Object.keys(result.data).find((key) => result.data?.[key]?.dismiss);
      const dismissNoticeData = result.data[displayBizType]?.notice;
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
      !isSSG &&
      // 且发生了真实交互
      realInteraction.pass &&
      // 且当前路由对应的scene发生了变化触发请求
      lastRequestScene.current !== currentPathScene
    ) {
      fetchDismiss();
    }
  }, [isSSG, realInteraction.pass, fetchDismiss, lastRequestScene.current, currentPathScene]);

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
export const RestrictNoticeWithTheme = ({
  theme,
  userInfo,
  pathname,
  currentLang,
  restrictNoticeStayDuration,
}) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <SnackbarProvider>
        <RestrictNotice
          userInfo={userInfo}
          pathname={pathname}
          currentLang={currentLang}
          restrictNoticeStayDuration={restrictNoticeStayDuration}
        />
      </SnackbarProvider>
    </ThemeProvider>
  );
};
