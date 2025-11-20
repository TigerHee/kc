/**
 * Owner: odan.ou@kupotech.com
 */

import React, { useEffect, useState, useMemo } from 'react';
import JsBridge from '@tools/bridge';
import { useTranslation } from '@tools/i18n';
import addLangToPath from '@tools/addLangToPath';
import find from 'lodash/find';
import { _DEV_ } from '@utils/env';
import { getBotConfigList } from './services';
import { jumpPage } from './utils';

window.supportBotEmbed = {};

/**
 * @type {React.CSSProperties}
 */
const IframeStyle = {
  zIndex: 1000,
  position: 'fixed',
  transform: 'translate(0px, 0px)',
  opacity: 1,
  transition: 'transform 200ms, opacity 200ms',
  border: 0,
};
/**
 * @type {React.IframeHTMLAttributes}
 */
const IframeProps = {
  scrolling: 'no',
  frameBorder: 0,
};

const BotContent = (props) => {
  const { source, currentLang, showTip = true } = props;
  const isInApp = JsBridge.isApp();
  const [showBot, setShowBot] = useState(false);
  // 提供余个全局可开关的方法
  useEffect(() => {
    if (window.supportBotEmbed?.close) {
      window.supportBotEmbed?.close();
    }
    window.supportBotEmbed.close = () => {
      setShowBot(false);
    };
    window.supportBotEmbed.open = () => {
      setShowBot(true);
      window.supportBotEmbed.hasOpened = true;
    };
    return () => {
      window.supportBotEmbed = {};
    };
  }, []);
  // 展示入口icon
  if (!showBot) {
    return (
      <div className="bot-entry bot-icon">
        <iframe
          {...IframeProps}
          width={showTip ? 124 : 36}
          height={showTip ? 94 : 36}
          style={{ ...IframeStyle, right: 10, bottom: 20 }}
          id="support-bot-icon"
          src={addLangToPath('/support/bot/chat?type=icon', currentLang)}
          title="chat-icon"
        />
      </div>
    );
  }
  // app 直接跳转页面
  if (isInApp) {
    jumpPage(`/support/app/help?source=${source}`, currentLang);
    return null;
  }
  return (
    <div className="bot-content">
      <iframe
        {...IframeProps}
        width={420}
        height={812}
        style={{
          ...IframeStyle,
          maxHeight: 'calc(100vh - 80px)',
          minHeight: 400,
          right: 16,
          bottom: 16,
          borderRadius: 8,
          background: '#fff',
          boxShadow: 'rgba(0, 0, 0, 0.1) -1px 0px 0px, rgba(0, 0, 0, 0.15) -3px 0px 9px',
        }}
        id="support-bot-chat"
        src={addLangToPath(`/support/bot/chat?source=${source}`, currentLang)}
        title="chat"
      />
    </div>
  );
};
/**
 * 判断是否展示机器人
 */
const Bot = (props) => {
  const { source, currentLang } = props;
  const [list, setList] = useState([]);
  const { href } = window.location || {};

  useEffect(() => {
    let hasUnmount = false;
    getBotConfigList()
      .then((resp) => {
        if (hasUnmount) return;
        setList(resp.data);
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      hasUnmount = true;
    };
  }, []);

  const botConf = useMemo(() => {
    if (list?.length) {
      const item = find(list, (item) => addLangToPath(item?.entryUrl, currentLang) === href);
      if (item) return item;
      if (source && _DEV_) {
        // dev 环境允许传入和路由不一样的source
        console.error('Source Code Does Not Match Page Path');
        return find(list, (item) => item?.source === source);
      }
    }
    return {
      open: false,
    };
  }, [list, href, source, currentLang]);
  if (!botConf?.open || !botConf.source) return null;
  return (
    <div id="bot-entry" style={{ margin: 0, padding: 0, height: 0 }}>
      <BotContent {...props} source={botConf.source} />
    </div>
  );
};

/**
 * @param {{
 *  showTip?: boolean, [showTip:icon比较简单的模式]
 *  source?: string
 * }} props
 */
export const SupportBot = (props) => {
  const { i18n } = useTranslation();
  const { language: currentLang } = i18n || {}; // 当前语言
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
