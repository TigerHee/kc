/**
 * Owner: roger@kupotech.com
 */
import React, { useState, useCallback, useEffect } from 'react';
import { map } from 'lodash';
import { TriangleDownOutlined } from '@kux/icons';
import { useLang } from '../../../hookTool';

import {
  Dropdown,
  Tabs,
  Tab,
  ActiveTab,
  TabMore,
  ActiveTabMore,
  TabMoreList,
  TabMoreItem,
  ActiveTabMoreItem,
} from '../styled';
import { TRADETYPE_MAP } from '../config';
import { kcsensorsClick } from '../../../common/tools';

const ListComponent = (props) => {
  const { datasource, activeTab, handleTabChange, wrapperHeight } = props;

  return (
    <TabMoreList style={{ height: wrapperHeight }}>
      {map(datasource, (item, index) => {
        const sort = index + 2;
        if (activeTab === item.name || activeTab === item.value) {
          return (
            <ActiveTabMoreItem
              key={item.name || item.value}
              onClick={() => handleTabChange(item.name || item.value, sort)}
            >
              {item.displayName || item.label}
            </ActiveTabMoreItem>
          );
        }
        return (
          <TabMoreItem
            key={item.name || item.value}
            onClick={() => handleTabChange(item.name || item.value, sort)}
          >
            {item.displayName || item.label}
          </TabMoreItem>
        );
      })}
    </TabMoreList>
  );
};

const TabsComponent = (props) => {
  const { areas, tradeType, tabChange, lang, wrapperHeight } = props;
  const { t } = useLang();
  let tabsMap = areas;
  if (tradeType === TRADETYPE_MAP.FUTURES_USDT) {
    tabsMap = map(tabsMap, (area, i) => {
      const { displayName, ...rest } = area;
      const nameJson = JSON.parse(displayName);
      const _area = {
        ...rest,
        displayName: (nameJson[lang] ? nameJson[lang] : nameJson.en_US) || `UnknowName-${i}`,
      };
      return _area;
    });
    const allArea = { displayName: 'ALL', name: 'ALL', quotes: [] };
    tabsMap.unshift(allArea);
  }
  const defaultTabVal = tabsMap[0] ? tabsMap[0].name || tabsMap[0].value : '';
  const [activeTab, setActiveTab] = useState(defaultTabVal);
  const [moreText, setMoreText] = useState('');
  const [moreTextSort, setMoreTextSort] = useState('');

  const handleTabChange = useCallback(
    (val, sort) => {
      setActiveTab(val);
      tabChange(val);
      kcsensorsClick(['navigationDropDownTab', '1'], {
        postTitle: tradeType,
        sortPosition: sort,
        pagecate: 'navigationDropDownTab',
      });
    },
    [tabChange, tradeType],
  );

  useEffect(() => {
    handleTabChange(defaultTabVal);
  }, []);

  const genTabItem = useCallback(
    (item, index) => {
      if (index > 2) {
        // 仅展示前3个tab，其他tab通过More下拉框展示
        return null;
      }
      if (activeTab === item.name || activeTab === item.value) {
        return (
          <ActiveTab
            key={item.name || item.value}
            onClick={() => handleTabChange(item.name || item.value, index)}
          >
            {item.displayName || t(item.label)}
          </ActiveTab>
        );
      }
      return (
        <Tab key={item.name || item.value} onClick={() => handleTabChange(item.name || item.value)}>
          {item.displayName || t(item.label)}
        </Tab>
      );
    },
    [activeTab, handleTabChange, t],
  );

  const handleListTabChange = useCallback(
    (val, sort) => {
      handleTabChange(val, sort);
      setMoreText(val);
      setMoreTextSort(sort);
    },
    [handleTabChange],
  );

  const handleMoreTab = useCallback(() => {
    if (!moreText) {
      return;
    }
    handleTabChange(moreText, moreTextSort);
  }, [handleTabChange, moreText, moreTextSort]);

  const TabsRender = useCallback(
    (_tabsMap) => {
      let array = [];
      if (_tabsMap && _tabsMap.length > 4) {
        array = _tabsMap.slice(3);
      }
      if (array.length === 0) {
        return null;
      }
      const { displayName, label } =
        array.find((item) => activeTab === item.name || activeTab === item.value) || {};

      const moreHtml = (
        <Dropdown
          trigger="hover"
          overlay={
            <ListComponent
              datasource={array}
              activeTab={activeTab}
              handleTabChange={handleListTabChange}
              wrapperHeight={wrapperHeight - 130}
            />
          }
          placement="bottom"
          anchorProps={{ style: { 'display': 'block' } }}
          key="more"
          keepMounted
        >
          {displayName || label ? (
            <ActiveTabMore>
              {moreText || t('3smXLrD5ypBmeNMPCkiBP4')}
              <TriangleDownOutlined
                size="11"
                className="arrowIcon"
                color="rgba(140, 140, 140, 0.6)"
              />
            </ActiveTabMore>
          ) : (
            <TabMore onClick={handleMoreTab}>
              {moreText || t('3smXLrD5ypBmeNMPCkiBP4')}
              <TriangleDownOutlined
                size="11"
                className="arrowIcon"
                color="rgba(140, 140, 140, 0.6)"
              />
            </TabMore>
          )}
        </Dropdown>
      );
      return <>{moreHtml}</>;
    },
    [activeTab, handleListTabChange, handleMoreTab, moreText, t, wrapperHeight],
  );

  return (
    <Tabs>
      {map(tabsMap, (area, index) => {
        return genTabItem(area, index);
      })}
      {TabsRender(tabsMap)}
    </Tabs>
  );
};

export default TabsComponent;
