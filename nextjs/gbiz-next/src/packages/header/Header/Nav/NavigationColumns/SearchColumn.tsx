import React, { useEffect } from 'react';
import { getCurrentLang } from 'kc-next/i18n';
import type { NavProps, NavType } from '../types';
import styles from './SearchColumn.module.scss';
import ExtContentList from 'packages/header/components/TradeList';
import { useHeaderStore } from '../../model';
import AnimatedContent from 'packages/header/components/AnimatedContent';
import { WITH_SEARCH_LIST } from 'packages/header/components/TradeList/config';

type Props = NavProps & {
  item: NavType;
  parentRef: any;
  showIndex?: number;
};
const SearchColumn: React.FC<Props> = ({ item, userInfo, parentRef, showIndex = 0, hostConfig }) => {
  const symbolsMenu = useHeaderStore(state => state.symbolsMenu);
  const updateHeader = useHeaderStore(state => state.updateHeader);
  const currentLang = getCurrentLang();
  const tradeType = item.extContext?.tradeType?.[0] || '';

  useEffect(() => {
    updateHeader?.({
      symbolsMenu: { ...symbolsMenu, [tradeType]: true },
    });
  }, []);

  return (
    <AnimatedContent delay={0.15}>
      <div className={styles.searchContainer}>
        <ExtContentList
          tradeType={tradeType}
          lang={currentLang}
          userInfo={userInfo}
          id={tradeType}
          parentRef={parentRef}
          visible={WITH_SEARCH_LIST.includes(tradeType)}
          // visible未发生改变时，展示的子元素需要加载数据，类似父菜单的visible
          needLoad
          hostConfig={hostConfig}
          className={styles.contentList}
        />
      </div>
    </AnimatedContent>
  );
};

export default SearchColumn;
