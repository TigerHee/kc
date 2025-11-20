/**
 * Owner: chris@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowLeft2Outlined, ICNoviceGuideOutlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { isIOS } from 'helper';
import { throttle } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { _t } from 'src/tools/i18n';
import { HeaderSlide } from './Slide';

const Container = styled.div`
  position: fixed;
  top: ${({ isInApp }) => (isInApp ? '0px' : '63px')};
  z-index: 10;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: calc(44px + env(safe-area-inset-top));
  background: ${({ showSlide }) => (showSlide ? '#000000' : 'transparent')};
  transition: 0.3s;
  padding-top: env(safe-area-inset-top, 44px);
  color: ${({ theme }) => theme.colors.text};

  display: none;
  .left {
    width: 20%;
    max-width: 20%;
    padding-left: 16px;
    text-align: left;
  }
  .reverse {
    transform: scaleX(-1);
  }
  .middle {
    padding: 0 10px;
    overflow: hidden;
    color: var(--text);
    font-weight: 600;
    font-size: 16px;
    line-height: 1.3;
    white-space: nowrap;
    text-align: center;
    text-overflow: ellipsis;
    // width: 60%;
  }
  .right {
    width: 20%;
    max-width: 20%;
    padding-right: 16px;
    text-align: right;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: flex;
  }
`;

const diffHeight = 86;

function AppHeader({
  isInApp,
  currentLevel,
  userLevel,
  updateLevel,
  levelConfig,
  goUpgradeHandle,
  isLogin,
  ruleHandle,
  loading,
  originalLevel,
  ...rest
}) {
  const { isRTL } = useLocale();
  const { colors } = useTheme();
  const history = useHistory();
  const [showSlide, setShowSlide] = useState(false);
  const isK0 = originalLevel === 0;

  const { headerBg } = levelConfig;

  const goBackOrExit = useCallback(() => {
    // 如果没有触发'popstate'事件，则设置一个延迟退出H5的操作
    const delayer = setTimeout(() => {
      console.log('关闭H5');
      try {
        JsBridge.open({
          type: 'func',
          params: {
            name: 'exit',
          },
        });
      } catch (error) {
        console.error('退出H5时出错:', error); // 打印退出错误
      }
    }, 500);

    // 定义一个'popstate'事件的监听器
    const listener = () => {
      // 当'popstate'事件被触发时，清除延迟并移除监听器
      clearTimeout(delayer);
      window.removeEventListener('popstate', listener);
    };
    // 添加'popstate'事件的监听器
    window.addEventListener('popstate', listener);
    // 尝试返回历史记录
    try {
      history.goBack();
    } catch (error) {
      console.error('返回历史记录时出错:', error); // 打印返回错误
    }
  }, [history]);

  // 监听滚动
  useEffect(() => {
    // if (!isInApp) return null;
    const listener = throttle((event) => {
      const scrollTop =
        (event.srcElement ? event.srcElement.scrollTop : false) ||
        window.pageYOffset ||
        (event.srcElement ? event.srcElement.body.scrollTop : 0);
      setShowSlide(scrollTop > diffHeight);
    }, 10);
    document.addEventListener('scroll', listener);
    return () => {
      document.removeEventListener('scroll', listener);
    };
  }, [isInApp, isLogin, isK0]);

  useEffect(() => {
    const isInIos = isIOS();
    const isAndroid = isInApp && !isInIos;
    const color = loading ? '#121212' : isLogin && showSlide ? headerBg : '#000000';
    JsBridge.open({
      type: 'event',
      params: { name: 'updateBackgroundColor', color },
    });
    // 安卓修改状态栏背景色
    if (isAndroid) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          background: color || '#000000',
          statusBarIsLightMode: false, // 状态栏文字颜色为白色
          visible: false,
        },
      });
    }
  }, [showSlide, isLogin, isK0, headerBg, isInApp, loading]);

  const style = !loading && showSlide && isLogin ? { background: headerBg } : {};
  const title = originalLevel ? '' : _t('0354e85414eb4000a8de');

  return (
    <Container {...rest} isInApp={isInApp} style={style} showSlide={showSlide}>
      <div className="left">
        {isInApp && (
          <ICArrowLeft2Outlined
            className={isRTL ? 'reverse' : ''}
            onClick={goBackOrExit}
            color={colors.text}
            size={24}
          />
        )}
      </div>
      <div className="middle">
        {showSlide
          ? title || (
              <HeaderSlide
                currentLevel={currentLevel}
                userLevel={userLevel}
                updateLevel={updateLevel}
              />
            )
          : ''}
      </div>
      <div className="right">
        <ICNoviceGuideOutlined onClick={ruleHandle} color={colors.text} size={20} />
      </div>
    </Container>
  );
}
export default AppHeader;
