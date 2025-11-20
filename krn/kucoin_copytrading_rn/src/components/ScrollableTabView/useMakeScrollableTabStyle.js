import {useMemo} from 'react';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import {isAndroid} from 'utils/helper';

export const useMakeScrollableTabStyle = (overRideStyles = {}) => {
  const {colorV2, isRTL, type} = useTheme();
  const styleProps = useMemo(() => {
    let darkBorder;
    if (type === 'dark') {
      if (isAndroid) {
        darkBorder = `
            border: 1px solid ${colorV2.cover8};
            border-bottom-width: 0;
            margin-left: -1px;
            margin-right: -1px;
          `;
      } else {
        darkBorder = `
            border-style: solid;
            border-color: ${colorV2.cover8};
            border-right-width: 0px;
            border-bottom-width: 0px;
            border-left-width: 0px;
            border-top-width: 1px;
          `;
      }
    }

    return {
      tabsEnableAnimatedUnderlineWidth: 30,
      tabsEnableAnimated: false,
      tabActiveOpacity: 1,
      tabWrapStyle: css`
        padding-top: 15px;
        flex: 1;
        margin-right: ${isRTL ? '0' : '24px'};
        margin-left: ${!isRTL ? '0' : '24px'};
        background: ${colorV2.overlay};
        ${overRideStyles.tabWrapStyle || ''}
      `,
      tabsStyle: css`
        min-height: 64px;
        height: 64px;
        padding: 0 16px;
        background-color: ${colorV2.overlay};
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        ${darkBorder}
        ${overRideStyles.tabsStyle || ''}
      `,
      tabStyle: css`
        margin-right: 24px;
        ${overRideStyles.tabStyle || ''}
      `,
      tabUnderlineStyle: css`
        background-color: ${colorV2.text};
        height: 4px;
        width: 16px;
        align-self: center;
        margin-top: 2px;
        ${overRideStyles.tabUnderlineStyle || ''}
      `,
      textStyle: css`
        font-size: 16px;
        font-weight: 500;
        color: ${colorV2.text40};
        ${overRideStyles.textStyle || ''}
      `,
      textActiveStyle: css`
        font-size: 16px;
        font-weight: 600;
        color: ${colorV2.text};
        ${overRideStyles.textActiveStyle || ''}
      `,
      tabsOuterWrapStyle: css`
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex: 1;
        ${overRideStyles.tabsOuterWrapStyle || ''}
      `,
    };
  }, [colorV2, type, isRTL, overRideStyles]);

  return styleProps;
};
