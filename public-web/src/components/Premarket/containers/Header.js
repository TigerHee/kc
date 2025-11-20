/**
 * Owner: solar.xia@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowRight2Outlined, ICHistoryOutlined, ICMoreOutlined } from '@kux/icons';
import { ThemeProvider } from '@kux/mui';
import clns from 'classnames';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'src/hooks/useSelector';
import { StyledHeader } from '../styledComponents';
import { useSkip2Myorder } from '../util';
import { MoreActionDialog } from './components/MoreAction';

export default function Header({ showMyOrder = true, children, showMore, theme }) {
  const history = useHistory();
  const isInApp = JsBridge.isApp();
  const [moreVisible, setMoreVisible] = useState(false);
  const currentTheme = useSelector((state) => state.setting.currentTheme);

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

  const handleSkip2Myorder = useSkip2Myorder();

  if (!isInApp) return null;

  return (
    <>
      <ThemeProvider theme={theme || currentTheme}>
        <StyledHeader>
          <div className="app-custom-header">
            <button onClick={goBackOrExit} className="back-arrow-icon">
              <ICArrowRight2Outlined />
            </button>
            <div className={clns('title-text')}>
              <span>{children}</span>
            </div>
            <div className="buttonWrapper">
              <button
                onClick={handleSkip2Myorder}
                className={clns('my-order-icon', { visible: showMyOrder })}
              >
                <ICHistoryOutlined />
              </button>
              {showMore && (
                <button onClick={() => setMoreVisible(true)} className="my-order-icon visible">
                  <ICMoreOutlined />
                </button>
              )}
            </div>
          </div>
        </StyledHeader>
      </ThemeProvider>

      {moreVisible && <MoreActionDialog {...{ moreVisible, setMoreVisible }} />}
    </>
  );
}
