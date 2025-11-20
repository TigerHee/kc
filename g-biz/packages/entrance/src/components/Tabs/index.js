/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect } from 'react';

import { Box, useTheme, styled, isPropValid } from '@kux/mui';

const TabBox = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    display: 'flex',
    marginBottom: '40px',
    '.itemKey': {
      display: 'flex',
    },
    '.line': {
      position: 'relative',
      width: 0,
      top: '6px',
      height: '14px',
      margin: `0 12px`,
      border: 'solid',
      borderColor: theme.colors.divider,
      borderWidth: '0 1px 0 0',
      overflow: 'hidden',
    },
    '.tabItem': {
      fontSize: '16px',
      lineHeight: '24px',
      cursor: 'pointer',
      color: theme.colors.text,
      '&:hover': {
        color: theme.colors.primary,
      },
      '&.activeBar': {
        color: theme.colors.primary,
      },
    },
  };
});

const TabPaneBox = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {};
});

const TabPane = () => null;
Tabs.TabPane = TabPane;

/**
 *
 * @param {defaultKey} required 'string' -- 默认显示的key
 * @param {isRender}  'boolean' -- 是否渲染隐藏的 tabPane
 * @param {onChange}  'function' -- 点击tab 切换的回调
 * @param {TabPane}  'react.element' -- 需要渲染的tab
 * @param {TabPane.key} required 'string' -- tabPane的 key
 * @param {TabPane.title} required 'any' -- tabPane的 title
 */
export default function Tabs(props = {}) {
  const { defaultKey, children, onChange } = props;

  const theme = useTheme();

  const [activeKey, setActiveKey] = useState(defaultKey);

  const handleTabChange = (key) => {
    if (key === activeKey) return;
    setActiveKey(key);
    onChange && onChange(key);
  };

  useEffect(() => {
    setActiveKey(defaultKey);
    return () => {};
  }, [defaultKey]);

  const childrens = Array.isArray(children) ? children : [children];

  const tabPane = childrens.map((child) => (child.type === TabPane ? child : null));

  const keys = tabPane.map(({ props: { title } = {}, key }, i) => {
    if (!key) {
      console.warn('TabPane must set key');
    }
    return { key: key || i, title };
  });

  return (
    <Box>
      {keys.length && keys.length > 1 ? (
        <TabBox theme={theme}>
          {keys.map(({ key, title }, i) => {
            const isLine = i !== keys.length - 1;
            return (
              <div className="itemKey" key={key}>
                <div
                  onClick={() => handleTabChange(key)}
                  className={`tabItem ${key === activeKey ? 'activeBar' : null}`}
                >
                  {title || key}
                </div>
                {isLine ? <div className="line">|</div> : null}
              </div>
            );
          })}
        </TabBox>
      ) : null}
      {tabPane.map(({ props = {}, key } = {}) => {
        if (key !== activeKey) {
          return null;
        }
        return <TabPaneBox key={key}>{props.children}</TabPaneBox>;
      })}
    </Box>
  );
}
