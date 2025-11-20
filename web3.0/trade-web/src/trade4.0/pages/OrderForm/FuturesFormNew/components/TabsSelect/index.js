/**
 * Owner: garuda@kupotech.com
 * tabs 公用纯 UI组件，暂时放在这里
 */
import React from 'react';

import { map } from 'lodash';

import { Tabs } from '@mui/Tabs';

import TabSelect from './TabSelect';

import { styled } from '../../builtinCommon';

const { Tab } = Tabs;

const TabsWrapper = styled(Tabs)`
 .KuxTab-TabItem {
    -webkit-text-stroke: unset;
  }
`;

const TabsSelect = ({
  activeTab,
  onTabsChange,
  tabsConfig,
  tabSelectValue,
  onTabSelectChange,
  ...reset
}) => {
  return (
    <TabsWrapper
      size="xsmall"
      variant="line"
      value={activeTab}
      onChange={onTabsChange}
      showIndicator={false}
      {...reset}
    >
      {map(tabsConfig, (item, index) => {
        const { value, label, titleSelect } = item;
        return (
          <Tab
            key={index}
            value={value}
            isSelect={Boolean(titleSelect)}
            label={
              titleSelect ? (
                <TabSelect
                  realValue={activeTab === value}
                  options={titleSelect}
                  value={tabSelectValue}
                  onChange={onTabSelectChange}
                />
              ) : (
                label && label()
              )
            }
          />
        );
      })}
    </TabsWrapper>
  );
};

export default React.memo(TabsSelect);
