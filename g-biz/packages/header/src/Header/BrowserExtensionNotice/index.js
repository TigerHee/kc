/**
 * Owner: corki.bai@kupotech.com
 */

import useRealInteraction from '@hooks/useRealInteraction';
import {
  ICArrowRight2Outlined,
  ICArrowRightOutlined,
  ICCloseOutlined,
  ICWarningOutlined,
} from '@kux/icons';
import { Button, Drawer, isPropValid, styled, ThemeProvider, useResponsive } from '@kux/mui';
import ExtensionDetector from '@packages/ExtensionDetector';
import addLangToPath from '@tools/addLangToPath';
import { kcsensorsManualTrack } from '@utils/sensors';
import storage from '@utils/storage';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { useDispatch } from 'react-redux';
import { Trans } from '@tools/i18n';
import {
  checkIsInApp,
  isBrave,
  isChrome,
  isEdge,
  isEqualUnordered,
  isSSG,
} from '../../common/tools';
import { namespace } from '../model';
import { checkPluginList } from '../service';
import siteConfig from '../siteConfig';
import {
  EXPIRE_TIME,
  guideType,
  LAST_BROWSER_EXTENSION_LIST_KEY,
  LAST_CLOSE_BROWSER_EXTENSION_NOTICE_TIME,
  PLATFORM,
  SUPPORT_BROWSER_EXTENSION,
} from './config';

import { useLang } from '../../hookTool';

export const HEIGHT = 40;

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

const TopMessageBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
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
  width: 100%;
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
    /* display: flex; */
    width: 100%;
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

const NoticeLayout = ({ notice, closable = true, closeShow, currentLang, passType }) => {
  const { buttonAgree, buttonAgreeWebUrl, topMessage, title, displayType, guideType } =
    notice || {};
  const titleRef = useRef(null);
  const titleParentRef = useRef(null);
  const [needScroll, setNeedScroll] = useState(false);
  const rv = useResponsive();
  const downSmall = !rv?.sm;
  const [showDrawer, setShowDrawer] = useState(false);

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
          guideType,
          name: 'title_popup',
          reportType: 'show',
          guideColor: displayType,
          popType: passType === 'moveCheck' ? 'active' : passType === 'timeCheck' ? 'passive' : '',
        },
      },
      'publicGuideEvent',
    );
  }, [displayType, passType, guideType]);

  const clickClose = () => {
    if (typeof closeShow === 'function') {
      closeShow();
      kcsensorsManualTrack(
        {
          spm: ['topMessage', '1'],
          data: {
            guideType,
            name: 'title_popup',
            reportType: 'close',
            guideColor: displayType,
            popType:
              passType === 'moveCheck' ? 'active' : passType === 'timeCheck' ? 'passive' : '',
          },
        },
        'publicGuideEvent',
      );
    }
  };

  const handleClickJump = () => {
    kcsensorsManualTrack(
      {
        spm: ['topMessage', '1'],
        data: {
          guideType,
          name: 'title_popup',
          reportType: 'click',
          guideColor: displayType,
          popType: passType === 'moveCheck' ? 'active' : passType === 'timeCheck' ? 'passive' : '',
        },
      },
      'publicGuideEvent',
    );
  };

  return (
    <Wrapper displayType={displayType} id="browserExtensionNotice" data-nosnippet>
      <Main onClick={() => setShowDrawer(true)}>
        <ExtendWarnIcon displayType={displayType} />
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

const BrowserExtensionNotice = ({ userInfo, currentLang }) => {
  const { t } = useLang();
  const [browserExtensionMessageVisible, setBrowserExtensionMessageVisible] = useState(false);
  const [brwoserExtensionMessageInfo, setBrwoserExtensionMessageInfo] = useState({
    maliciousPluginList: [],
    suspiciousPluginList: [],
    pluginList: [],
  });
  const realInteraction = useRealInteraction({ stayDuration: 5000 });
  const dispatch = useDispatch();
  const isLogin = !!userInfo?.uid;

  const getLastExtensionList = () => {
    const key = `${LAST_BROWSER_EXTENSION_LIST_KEY}_${userInfo.uid}`;
    return storage.getItemWithExpire(key);
  };

  const getLastCloseTime = () => {
    const key = `${LAST_CLOSE_BROWSER_EXTENSION_NOTICE_TIME}_${userInfo.uid}`;
    return storage.getItemWithExpire(key);
  };

  // 获取是否支持检测的浏览器类型，支持返回类型，不支持返回空
  const checkCurrentBrowserType = async () => {
    const edge = isEdge();
    const chrome = isChrome();
    if (edge || chrome) {
      return edge ? 'EDGE' : 'CHROME';
    }
    const brave = await isBrave();
    return brave ? 'BRAVE' : '';
  };

  // 将原始插件列表转换成接口参数
  const getParamsFormPluginList = (pluginList) => {
    const reg = /chrome-extension:\/\/([^\\/]+)(\/.+)/;
    const idList = [];
    const scriptList = [];
    const inValidPluginList = [];
    // 过滤掉不符合格式的插件
    _.map(pluginList, (url) => {
      const matchResult = url.match(reg);
      if (matchResult && matchResult?.[1] && matchResult?.[2]) {
        inValidPluginList.push(url);
        idList.push(matchResult[1]);
        scriptList.push(matchResult[2]);
      }
    });
    return { idList, scriptList, inValidPluginList };
  };

  // 传入的当前插件列表发送到安全服务，返回检测结果
  const handleCheckPluginList = async (pluginList) => {
    try {
      const { idList, scriptList, inValidPluginList } = getParamsFormPluginList(pluginList);
      const browserType = await checkCurrentBrowserType();
      const { data } = await checkPluginList({
        bizTime: new Date().getTime(),
        platform: PLATFORM, // 只在浏览器环境检查
        browserType,
        pluginList: inValidPluginList,
        pluginId: idList,
        scriptName: scriptList,
      });

      // 缓存已经验证过且无风险的插件
      if (data?.riskStrategy === 'accept') {
        return {
          failback: !!data?.failback,
          checkedPluginList: idList,
          maliciousPluginList: [],
          suspiciousPluginList: [],
        };
      }

      if (data && data?.node) {
        const pluginIds = Object.keys(data.node);
        const maliciousPluginList = [];
        const suspiciousPluginList = [];

        for (let i = 0; i < pluginIds.length; i++) {
          const pluginId = pluginIds[i];
          if (data.node[pluginId] === 'Plugin_Malicious') {
            maliciousPluginList.push(pluginId);
          } else if (data.node[pluginId] === 'Plugin_Suspect') {
            suspiciousPluginList.push(pluginId);
          }
        }
        return {
          failback: data.failback, // 是否是降级数据
          checkedPluginList: pluginIds,
          maliciousPluginList,
          suspiciousPluginList,
        };
      }

      return {
        failback: false,
        checkedPluginList: [],
        maliciousPluginList: [],
        suspiciousPluginList: [],
      };
    } catch (e) {
      console.log(e);
      // 兜底处理，如果请求失败，则默认不展示顶飘
      return {
        failback: false,
        pluginList: [],
        maliciousPluginList: [],
        suspiciousPluginList: [],
      };
    }
  };

  const updateBrowserExtensionVisibleModel = (visible) => {
    setBrowserExtensionMessageVisible(visible);
    dispatch({ type: `${namespace}/update`, payload: { isShowRestrictNotice: visible } });
  };

  const handleClose = () => {
    updateBrowserExtensionVisibleModel(false);
    // 并将关闭时间存入localstorage，30分钟有效期
    storage.setItemWithExpire(
      `${LAST_CLOSE_BROWSER_EXTENSION_NOTICE_TIME}_${userInfo.uid}`,
      { closedTime: new Date().getTime() },
      EXPIRE_TIME,
    );
  };

  useEffect(() => {
    // 获取是否展示安全插件顶飘
    const getBrowserExtensionNotice = async () => {
      if (
        // 只在登录后触发
        isLogin &&
        // 只在浏览器检查
        !checkIsInApp() &&
        // 非SSG状态
        !isSSG
      ) {
        // 检测当前浏览器是否需要支持
        const browseType = await checkCurrentBrowserType();
        if (!SUPPORT_BROWSER_EXTENSION.includes(browseType)) {
          return;
        }
        const extensionDetector = new ExtensionDetector();
        extensionDetector.init({}, false); // 不开启自动上报
        const pluginList = extensionDetector.getPluginList();

        // 情况一:用户没有插件或者用户30分钟内已经点击过关闭顶飘，则进入免打扰模式，不再展示顶飘内容
        const hasClosed = getLastCloseTime(userInfo);
        if (hasClosed || pluginList.length === 0) {
          setBrwoserExtensionMessageInfo((info) => ({
            ...info,
            pluginList: [],
            maliciousPluginList: [],
            suspiciousPluginList: [],
          }));
          updateBrowserExtensionVisibleModel(false);
          return;
        }

        // 情况二：没有关闭且当30分钟以内的已经请求过顶飘内容，并且插件环境不变，则展示上次插件检测顶飘的结果
        const lastPluginList = getLastExtensionList(userInfo);
        const { idList: currentPluginListId } = getParamsFormPluginList(pluginList);

        // 每次刷新插件注入的顺序可能不同，因此使用isEqualUnordered，而非isEqual
        if (lastPluginList && isEqualUnordered(lastPluginList.pluginList, currentPluginListId)) {
          // 如果是在30分钟以内关闭，且插件环境一致
          setBrwoserExtensionMessageInfo((info) => ({
            ...info,
            pluginList: lastPluginList.pluginList,
            maliciousPluginList: lastPluginList.maliciousPluginList,
            suspiciousPluginList: lastPluginList.suspiciousPluginList,
          }));
          // 根据上次关闭的结果来展示顶飘
          if (
            lastPluginList.maliciousPluginList.length + lastPluginList.suspiciousPluginList.length >
            0
          ) {
            updateBrowserExtensionVisibleModel(true);
          } else {
            updateBrowserExtensionVisibleModel(false);
          }
          return;
        }

        // 情况三：首次加载 ｜ 没有点击过关闭｜关闭超过30分钟｜或者当用户在30分钟内请求了顶飘结果但本次插件环境发生变化，则都走重新检测插件逻辑
        const {
          failback,
          maliciousPluginList,
          suspiciousPluginList,
          checkedPluginList,
        } = await handleCheckPluginList(pluginList);
        // 正常丛风控拿到结果
        if (!failback) {
          if (maliciousPluginList.length + suspiciousPluginList?.length > 0) {
            setBrwoserExtensionMessageInfo((info) => ({
              ...info,
              pluginList: checkedPluginList,
              maliciousPluginList,
              suspiciousPluginList,
            }));
            updateBrowserExtensionVisibleModel(true);
          } else {
            updateBrowserExtensionVisibleModel(false);
          }
          // 将这次插件检测结果缓存到localstorage，以备30分钟内重新请求但插件环境没有变化的时候使用
          storage.setItemWithExpire(
            `${LAST_BROWSER_EXTENSION_LIST_KEY}_${userInfo.uid}`,
            {
              maliciousPluginList,
              suspiciousPluginList,
              pluginList: checkedPluginList,
            },
            EXPIRE_TIME,
          );
        } else {
          // 如果超时或者其他原因拿到降级数据，则根据是否有本地缓存来展示顶飘,有本地缓存展示上次的结果，没有本地缓存则不展示顶飘，降级数据不缓存
          // 没有缓存，不展示顶飘
          if (!lastPluginList) {
            updateBrowserExtensionVisibleModel(false);
            return;
          }

          // 有缓存，展示上次的结果
          setBrwoserExtensionMessageInfo(() => ({
            pluginList: lastPluginList.pluginList,
            maliciousPluginList: lastPluginList.maliciousPluginList,
            suspiciousPluginList: lastPluginList.suspiciousPluginList,
          }));
          if (
            lastPluginList.maliciousPluginList.length + lastPluginList.suspiciousPluginList.length >
            0
          ) {
            updateBrowserExtensionVisibleModel(true);
          } else {
            updateBrowserExtensionVisibleModel(false);
          }
        }
      }
    };
    // 确保所有的插件完全注入
    const timer = setTimeout(() => {
      getBrowserExtensionNotice();
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [userInfo, isLogin, dispatch]);

  // 支持展示多种类型风险插件展示，但一般情景只会有一种
  const topMessage = useMemo(() => {
    const maliciousPluginListText = brwoserExtensionMessageInfo.maliciousPluginList.join(',');
    const suspiciousPluginListText = brwoserExtensionMessageInfo.suspiciousPluginList.join(',');
    // 优先展示恶意插件->可疑插件
    if (
      brwoserExtensionMessageInfo.suspiciousPluginList.length > 0 &&
      brwoserExtensionMessageInfo.maliciousPluginList.length > 0
    ) {
      return (
        <TopMessageBox>
          <Trans i18nKey="3a48a7e7ccd74000a50f" ns="header" values={{ maliciousPluginListText }} />
          <Trans i18nKey="da2c9f07ed154000a92e" ns="header" values={{ suspiciousPluginListText }} />
        </TopMessageBox>
      );
    }
    if (brwoserExtensionMessageInfo.maliciousPluginList.length > 0) {
      return (
        <Trans i18nKey="3a48a7e7ccd74000a50f" ns="header" values={{ maliciousPluginListText }} />
      );
    }

    if (brwoserExtensionMessageInfo.suspiciousPluginList.length > 0) {
      return (
        <Trans i18nKey="da2c9f07ed154000a92e" ns="header" values={{ suspiciousPluginListText }} />
      );
    }
  }, [brwoserExtensionMessageInfo]);

  return browserExtensionMessageVisible ? (
    <NoticeLayout
      passType={realInteraction.passType}
      currentLang={currentLang}
      notice={{
        buttonAgree: t('b3271e70362d4000a1f5'),
        buttonAgreeWebUrl: '/support/34357237352985',
        topMessage,
        title: t('d89d8ad73f064000a5c6'),
        displayType: 'WARN',
        guideType,
      }}
      closeShow={handleClose}
    />
  ) : null;
};

export default BrowserExtensionNotice;

// 暴露给外部使用的组件
export const BrowserExtensionNoticeWithTheme = ({ theme, userInfo, currentLang }) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <BrowserExtensionNotice userInfo={userInfo} currentLang={currentLang} />
    </ThemeProvider>
  );
};
