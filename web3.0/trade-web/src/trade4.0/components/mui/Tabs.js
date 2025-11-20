/*
 * owner: Borden@kupotech.com
 */
import React, { forwardRef } from 'react';
import { Tabs } from '@kux/mui';
import styled from '@emotion/styled';
import { useIsRTL } from '@/hooks/common/useLang';

const { Tab } = Tabs;
// 获取黑夜主题下左右箭头操作区的背景色
const geDarkBackground = (isRTL, placement) => {
  const deg = placement === 'left' ? 90 : 270;
  const percent = isRTL ? 10 : 20;
  return `linear-gradient(${deg}deg, #222222 ${percent}%, rgba(34, 34, 34, 0) 100%)`;
  // 现在好像能自动转换了，注视掉
  // let deg = isRTL ? 90 : 270;
  // if (placement === 'left') {
  //   deg = isRTL ? 270 : 90;
  // }
  // return `
  //   linear-gradient(${deg}deg, #222222 ${isRTL ? 100 : 0}%, rgba(34, 34, 34, 0) 100%)
  // `;
};

// 获取白天主题下左右箭头操作区的背景色
const getLightBackground = (isRTL, placement) => {
  const deg = placement === 'left' ? 90 : 270;
  const percent = isRTL ? 10 : 20;
  return `linear-gradient(${deg}deg, #f9f9f9 ${percent}%, rgba(34, 34, 34, 0) 100%)`;
};

// 覆盖实现交易界面size=xsmall的样式
const StyledTabs = styled(Tabs)`
  .KuxTab-TabItem {
    &:hover {
      color: ${(props) => props.theme.colors.text};
    }
  }
  .KuxTabs-indicator {
    display: ${(props) => (props.showIndicator ? 'flex' : 'none')};
  }
  ${(props) => {
    switch (props.size) {
      case 'xsmall':
        return props.variant === 'bordered'
          ? `
          height: 36px;
          .KuxTab-TabItem {
            font-size: 13px;
          }
        `
          : `
          height: 36px;
          [role="tablist"] {
            padding-top: 10px;
          }
          .KuxTab-TabItem {
            font-size: 13px;
            &:last-of-type {
              margin-right: 0px;
            }
          }
          .KuxTabs-indicator {
            height: 2px;
            & > span {
              height: 2px;
              border-radius: 2px;
              background-color: ${props.theme.colors.primary};
            }
          }
        `;
      case 'xxsmall':
        return props.variant === 'bordered'
          ? `
          height: 30px;
          .KuxTab-TabItem {
            font-size: 12px;
          }
        `
          : `
          height: 30px;
          [role="tablist"] {
            padding-top: 8px;
          }
          .KuxTab-TabItem {
            font-size: 12px;
            &:not(:first-of-type) {
              margin-left: 16px;
            }
          }
          .KuxTabs-indicator {
            height: 2px;
            & > span {
              height: 2px;
              border-radius: 2px;
              background-color: ${props.theme.colors.primary};
            }
          }
        `;
      default:
        return '';
    }
  }}
  ${(props) => {
    if (props.inLayer && props.theme.currentTheme === 'dark') {
      const isRTL = props.direction === 'rtl';
      return `
        .KuxTabs-rightScrollButtonBg {
          background: ${geDarkBackground(isRTL)};
        }
        .KuxTabs-leftScrollButtonBg {
          background: ${geDarkBackground(isRTL, 'left')};
        }
      `;
    }
    if (props.inLayer && props.theme.currentTheme === 'light') {
      const isRTL = props.direction === 'rtl';
      return `
        .KuxTabs-rightScrollButtonBg {
          background: ${getLightBackground(isRTL)};
        }
        .KuxTabs-leftScrollButtonBg {
          background: ${getLightBackground(isRTL, 'left')};
        }
      `;
    }
  }}
`;

const StyledTab = styled(Tab)`
  ${(props) => {
    return props.isSelect
      ? `
      overflow: visible;
    `
      : '';
  }}
`;

const MuiTabs = forwardRef((props, ref) => {
  const isRtl = useIsRTL();
  return <StyledTabs ref={ref} direction={isRtl ? 'rtl' : 'ltr'} {...props} />;
});

MuiTabs.Tab = StyledTab;

MuiTabs.defaultProps = {
  showIndicator: true,
  inLayer: false, // 用以在浮层(弹窗、下拉框、浮动模块之类)中修改左右滑动按钮背景色使其和浮层背景色相协调
};

export { MuiTabs as Tabs };
