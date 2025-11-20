/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowRight2Outlined } from '@kux/icons';
import { ThemeProvider } from '@kux/mui';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StyledHeader } from './styledComponents';

// 通过协议退出app
export function doExit() {
  JsBridge.open({
    type: 'func',
    params: {
      name: 'exit',
    },
  });
}

/**
 * App内替代原生header, 支持返回功能，初始背景透明，滚动显示背景颜色
 * @param theme 'dark' | 'light' 默认'dark'
 * @param title header title 必填
 * @param backArrow 返回图标 node
 * @param extra 右侧图标 node
 * @param titleInitTransparent title默认时不显示，滚动后随背景显示  默认false
 */

function AppHeader({
  theme = 'dark',
  titleInitTransparent = false,
  backArrow = <ICArrowRight2Outlined />,
  title,
  extra,
  tip = null,
  className,
  bgColor,
}) {
  const timerRef = useRef();
  const history = useHistory();
  const isInApp = JsBridge.isApp();
  const [scrollTop, setScrollTop] = useState(false);

  const handleScroll = useCallback(() => {
    setScrollTop(window.document.scrollingElement.scrollTop > 10);
  }, []);

  useEffect(() => {
    if (isInApp) {
      window.addEventListener?.('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isInApp, handleScroll]);

  useEffect(() => {
    if (isInApp) {
      // 隐藏app原生header
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          // statusBarIsLightMode: false, // 状态栏文字颜色为白色
          statusBarIsLightMode: theme !== 'dark', // 状态栏文字颜色 false白色 true黑色
          statusBarTransparent: true,
          visible: false,
          background: theme !== 'dark' ? '#ffffff' : '#121212',
        },
      });

      // webview背景色
      JsBridge.open({ type: 'func', params: { name: 'updateBackgroundColor', color: '#121212' } });

      JsBridge.open({
        type: 'func',
        params: { name: 'enableBounces', isEnable: false }, // webview 取消弹性效果
      });
    }
  }, [isInApp, theme]);

  useEffect(() => {
    if (isInApp) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'onPageMount',
            dclTime: window.DCLTIME,
            pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
          },
        });
      }, 200);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isInApp]);

  const goBackOrExit = useCallback(() => {
    // 如果没有触发'popstate'事件，则设置一个延迟退出H5的操作
    const delayer = setTimeout(() => {
      console.log('关闭H5');
      try {
        doExit(); // 尝试退出
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

  const handleBack = useCallback(() => {
    if (isInApp) {
      goBackOrExit();
    } else {
      history.goBack();
    }
  }, [isInApp, history, goBackOrExit]);

  if (!isInApp) return null;

  return (
    <ThemeProvider theme={theme}>
      <StyledHeader className={className} bgColor={bgColor}>
        <div className={`app-custom-header ${scrollTop ? 'fillHeader' : ''}`}>
          <button onClick={handleBack} className="back-arrow-icon" aria-label="back">
            {backArrow}
          </button>
          {Boolean(title) && (
            <div className={`title-text ${titleInitTransparent ? 'transparent' : ''}`}>
              <h1>{title}</h1>
            </div>
          )}
          {Boolean(extra) && <div className="extra">{extra}</div>}
          {tip}
        </div>
      </StyledHeader>
    </ThemeProvider>
  );
}

export default memo(AppHeader);
