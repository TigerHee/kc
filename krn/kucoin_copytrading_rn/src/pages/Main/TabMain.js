import React, {memo} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import HorizontalScrollContainer from 'components/Common/HorizontalScrollContainer';
import {Tab, TabGroup} from 'components/Headless/Tab';
import TabPanel from 'components/Headless/Tab/TabPanel';
import MorePointsDrawer from './components/MorePointsDrawer';
import {LabelWrap, MainWrap, StyledTabList, TabLabelText} from './styles';

export const TabMain = memo(
  ({mainTabList, handleActiveTab, activeTabKey, onLayout}) => {
    return (
      <MainWrap onLayout={onLayout}>
        <TabGroup value={activeTabKey} onChange={handleActiveTab}>
          <StyledTabList style={__DEV__ ? {marginTop: 40} : {}}>
            <HorizontalScrollContainer
              alwaysBounceHorizontal={false}
              alwaysBounceVertical={false}>
              {mainTabList.map((tabItem, idx) => {
                const {itemKey, tabLabel} = tabItem;
                return (
                  <Tab itemKey={itemKey} key={itemKey}>
                    {({isActive}) => {
                      return (
                        <LabelWrap>
                          <TabLabelText isFirst={idx === 0} isActive={isActive}>
                            {tabLabel}
                          </TabLabelText>
                        </LabelWrap>
                      );
                    }}
                  </Tab>
                );
              })}
            </HorizontalScrollContainer>
            <MorePointsDrawer />
          </StyledTabList>

          <View
            style={css`
              flex: 1;
            `}>
            {mainTabList.map(tabItem => {
              const {itemKey, screen: TabScreenComp} = tabItem;
              return (
                <TabPanel itemKey={itemKey} key={itemKey}>
                  <TabScreenComp />
                </TabPanel>
              );
            })}
          </View>
        </TabGroup>
      </MainWrap>
    );
  },
);
