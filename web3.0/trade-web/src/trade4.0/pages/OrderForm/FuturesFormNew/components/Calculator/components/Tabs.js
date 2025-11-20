/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { map } from 'lodash';

// 自定义 tabs ，不使用 @mui 里的
import { Tabs, Tab, useResponsive } from '@kux/mui';

import { _t, styled } from '../../../builtinCommon';

import { TABS_CONFIG } from '../../../config';
import { useCalculatorTabsActive } from '../../../hooks/useCalculatorProps';

const TabsWrapper = styled(Tabs)`
  padding: ${(props) => (props.size === 'medium' ? '0 32px' : '0 16px')};
  height: 48px;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  .KuxTabs-scroller {
    height: 48px;
    top: ${(props) => (props.size === 'medium' ? '-2px' : '0')};
  }
  .KuxTabs-Container {
    padding-top: 14px;
  }
  .KuxTabs-scrollButton {
    padding-top: 14px;
  }
  .KuxTabs-indicator {
    bottom: 1px;
  }
`;

const CalculatorTabs = () => {
  const { tabsActive, onTabsChange } = useCalculatorTabsActive();
  const { xs, sm } = useResponsive();

  return (
    <TabsWrapper
      value={tabsActive}
      onChange={onTabsChange}
      variant="line"
      size={xs && !sm ? 'xsmall' : 'medium'}
      showScrollButtons={false}
    >
      {map(TABS_CONFIG, ({ value, label }) => (
        <Tab key={value} value={value} label={_t(label)} />
      ))}
    </TabsWrapper>
  );
};

export default React.memo(CalculatorTabs);
