import React, { useEffect, useState, useMemo } from 'react';
import JsBridge from 'tools/jsBridge';
import addLangToPath from 'tools/addLangToPath';
import find from 'lodash-es/find';
import { _DEV_ } from 'tools/env';
import { getBotConfigList } from './services';
import { jumpPage, doesUrlMatch } from './utils';
import { getCurrentLang } from 'kc-next/i18n';

/**
 * @type {React.CSSProperties}
 */
const IframeStyle: React.CSSProperties = {
  zIndex: 990,
  position: 'fixed',
  transform: 'translate(0px, 0px)',
  opacity: 1,
  transition: 'transform 200ms, opacity 200ms',
  border: 0,
  background: 'transparent',
};
/**
 * @type {React.IframeHTMLAttributes}
 */
const IframeProps: React.IframeHTMLAttributes<HTMLIFrameElement> = {
  scrolling: 'no',
  frameBorder: 0,
};

const BotContent = (props: {
  source: string;
  currentLang: string;
  showTip?: boolean;
  iconWrapperStyle?: React.CSSProperties;
  botContentStyle?: React.CSSProperties;
  hiddenIcon?: boolean;
}) => {
  const { source, showTip = false, iconWrapperStyle, botContentStyle, hiddenIcon = false } = props;
  const isInApp = JsBridge.isApp();
  const [showBot, setShowBot] = useState(false);
  // 提供一个全局可开关的方法
  useEffect(() => {
    if (window.supportBotEmbed?.close) {
      window.supportBotEmbed?.close();
    }
    window.supportBotEmbed = {};
    window.supportBotEmbed.close = () => {
      setShowBot(false);
    };
    window.supportBotEmbed.open = () => {
      // app 直接跳转页面
      if (isInApp) {
        jumpPage(`/support/app/help?source=${source}`, isInApp);
        return null;
      }
      setShowBot(true);
      if (window.supportBotEmbed) {
        window.supportBotEmbed.hasOpened = true;
      }
    };
    return () => {
      window.supportBotEmbed = {};
    };
  }, []);

  // 展示入口icon
  if (!showBot) {
    return hiddenIcon ? null : (
      <div className="bot-entry bot-icon">
        <iframe
          key="support-bot-icon"
          {...IframeProps}
          width={showTip ? 200 : 56}
          height={showTip ? 110 : 56}
          style={{ ...IframeStyle, ...(iconWrapperStyle ? iconWrapperStyle : { right: 48, bottom: 48 }) }}
          id="support-bot-icon"
          src={addLangToPath('/support/bot/chat?type=icon')}
          title="chat-icon"
        />
      </div>
    );
  }

  return (
    <div className="bot-content">
      <iframe
        key="support-bot-content"
        {...IframeProps}
        width={420}
        height={812}
        style={{
          ...IframeStyle,
          maxHeight: 'calc(100vh - 80px)',
          minHeight: 400,
          borderRadius: 8,
          background: '#fff',
          boxShadow: 'rgba(0, 0, 0, 0.1) -1px 0px 0px, rgba(0, 0, 0, 0.15) -3px 0px 9px',
          ...(botContentStyle ? botContentStyle : { right: 16, bottom: 16 }),
        }}
        id="support-bot-chat"
        src={addLangToPath(`/support/bot/chat?source=${source}`)}
        title="chat"
      />
    </div>
  );
};
/**
 * 判断是否展示机器人
 */
const Bot = (props: { source?: string; currentLang: string }) => {
  const { source, currentLang } = props;
  const [list, setList] = useState<{ entryUrl?: string; source?: string; open?: boolean }[]>([]);

  useEffect(() => {
    let hasUnmount = false;
    getBotConfigList()
      .then(resp => {
        if (hasUnmount) return;
        setList(resp.data);
      })
      .catch(err => {
        console.error(err);
      });
    return () => {
      hasUnmount = true;
    };
  }, []);

  const botConf = useMemo(() => {
    if (list?.length) {
      const currentHref = window.location.href;
      const currentPathname = window.location.pathname;
      const currentOrigin = window.location.origin;

      const item = find(list, item => {
        if (!item?.entryUrl) return false;
        // 分割URL并去除空格，然后检查是否有匹配
        const urls = item.entryUrl
          .split(',')
          .map(url => url.trim())
          .filter(Boolean);

        return urls.some(url =>
          doesUrlMatch(url, {
            href: currentHref,
            pathname: currentPathname,
            origin: currentOrigin,
          })
        );
      });
      if (item) return item;
      if (source && _DEV_) {
        // dev 环境允许传入和路由不一样的source
        console.error('Source Code Does Not Match Page Path');
        return find(list, item => item?.source === source);
      }
    }
    return {
      open: false,
    };
  }, [list, source, currentLang]);
  if (!botConf?.open || !botConf.source) return null;
  return (
    <div id="bot-entry" style={{ margin: 0, padding: 0, height: 0, background: 'transparent' }}>
      <BotContent {...props} source={botConf.source} />
    </div>
  );
};

export interface SupportBotProps {
  showTip?: boolean;
  source: string;
  /** 一般用于icon的位置，默认值为{ right: 10, bottom: 20 } */
  iconWrapperStyle?: React.CSSProperties;
  /** 一般用于botContent的位置，默认值为{ right: 16, bottom: 16 } */
  botContentStyle?: React.CSSProperties;
  /** 隐藏入口 */
  hiddenIcon?: boolean;
}

/**
 * @param {{
 *  showTip?: boolean, [showTip:icon比较简单的模式]
 *  source: string
 * }} props
 */
const SupportBot = (props: SupportBotProps) => {
  const currentLang = getCurrentLang();
  // 延迟3秒加载
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 3 * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  if (!ready) return null;
  return <Bot {...props} currentLang={currentLang} />;
};

export default SupportBot;
