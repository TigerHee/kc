/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-03-05 10:27:59
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 11:53:16
 * @FilePath: /public-web/src/components/Votehub/containers/Header.js
 * @Description:
 */
/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowRight2Outlined } from '@kux/icons';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StyledHeader } from '../styledComponents';

// 通过协议退出app
export function doExit() {
  JsBridge.open({
    type: 'func',
    params: {
      name: 'exit',
    },
  });
}

export default function Header({ children }) {
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
    <StyledHeader>
      <div className={`app-custom-header ${scrollTop ? 'fillHeader' : ''}`}>
        <button onClick={handleBack} className="back-arrow-icon">
          <ICArrowRight2Outlined />
        </button>
        <div className="title-text">
          <h1>{children}</h1>
        </div>
      </div>
    </StyledHeader>
  );
}
