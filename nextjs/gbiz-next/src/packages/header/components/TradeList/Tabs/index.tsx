/**
 * Owner: roger@kupotech.com
 */
import React, { useState, useCallback, useEffect, FC, useMemo } from 'react';
import { map } from 'lodash-es';
import { Dropdown, Segmented } from '@kux/design';
import { TriangleBottomIcon } from '@kux/iconpack';
import { TRADETYPE_MAP } from '../config';
import { kcsensorsClick } from '../../../common/tools';
import styles from '../styles.module.scss';
import { useTranslation } from 'tools/i18n';
import clsx from 'clsx';

interface ListProps {
  datasource: any;
  activeTab: string;
  handleTabChange: (value: string, sort: number) => void;
  wrapperHeight: number;
}

type ItemType = { displayName: string; label: string; name: string; value: string };

const ListComponent: FC<ListProps> = props => {
  const { datasource, activeTab, handleTabChange, wrapperHeight } = props;

  return (
    <div className={styles.tabMoreList} style={{ maxHeight: wrapperHeight }}>
      {map(datasource, (item, index) => {
        const sort = index + 2;
        if (activeTab === item.name || activeTab === item.value) {
          return (
            <div
              key={item.name || item.value}
              className={styles.activeTabMoreItem}
              onClick={() => handleTabChange(item.name || item.value, sort)}
            >
              {item.displayName || item.label}
            </div>
          );
        }
        return (
          <div
            key={item.name || item.value}
            className={styles.tabMoreItem}
            onClick={() => handleTabChange(item.name || item.value, sort)}
          >
            {item.displayName || item.label}
          </div>
        );
      })}
    </div>
  );
};

interface TabsComponentsProps {
  areas: any;
  tradeType: string;
  tabChange: (val: string) => void;
  lang: string;
  wrapperHeight: number;
}

const TabsComponent: FC<TabsComponentsProps> = props => {
  const { areas, tradeType, tabChange, lang, wrapperHeight } = props;
  const { t } = useTranslation('header');
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
    (val: string, sort?: any) => {
      setActiveTab(val);
      tabChange(val);
      kcsensorsClick(['navigationDropDownTab', '1'], {
        postTitle: tradeType,
        sortPosition: sort,
        pagecate: 'navigationDropDownTab',
      });
    },
    [tabChange, tradeType]
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
          <div
            className={styles.activeTab}
            key={item.name || item.value}
            onClick={() => handleTabChange(item.name || item.value, index)}
          >
            {item.displayName || t(item.label)}
          </div>
        );
      }
      return (
        <div
          key={item.name || item.value}
          className={styles.tab}
          onClick={() => handleTabChange(item.name || item.value)}
        >
          {item.displayName || t(item.label)}
        </div>
      );
    },
    [activeTab, handleTabChange, t]
  );

  const handleListTabChange = useCallback(
    (val, sort) => {
      handleTabChange(val, sort);
      setMoreText(val);
      setMoreTextSort(sort);
    },
    [handleTabChange]
  );

  const handleMoreTab = useCallback(() => {
    if (!moreText) {
      return;
    }
    handleTabChange(moreText, moreTextSort);
  }, [handleTabChange, moreText, moreTextSort]);

  const TabsRender = useCallback(
    _tabsMap => {
      let array: Array<ItemType> = [];
      if (_tabsMap && _tabsMap.length > 4) {
        array = _tabsMap.slice(3);
      }
      if (array.length === 0) {
        return null;
      }
      const { displayName, label } = array.find(item => activeTab === item.name || activeTab === item.value) || {};

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
          anchorProps={{ style: { display: 'block' } }}
          key="more"
          className={styles.dropdown}
          keepMounted
        >
          {displayName || label ? (
            <div className={styles.activeTabMore}>
              {moreText || t('3smXLrD5ypBmeNMPCkiBP4')}
              <TriangleBottomIcon size={11} className={styles.arrowIcon} color="rgba(140, 140, 140, 0.6)" />
            </div>
          ) : (
            <div className={styles.tabMore} onClick={handleMoreTab}>
              {moreText || t('3smXLrD5ypBmeNMPCkiBP4')}
              <TriangleBottomIcon size={11} className={styles.arrowIcon} color="rgba(140, 140, 140, 0.6)" />
            </div>
          )}
        </Dropdown>
      );
      return <>{moreHtml}</>;
    },
    [activeTab, handleListTabChange, handleMoreTab, moreText, t, wrapperHeight]
  );

  return (
    <div className={clsx([styles.tabsBox, 'tabs-container'])}>
      <div className={clsx([styles.tabs, 'trade-list-tab'])}>
        {map(tabsMap, (area, index) => {
          return genTabItem(area, index);
        })}
        {TabsRender(tabsMap)}
      </div>
    </div>
  );
};

export default TabsComponent;
