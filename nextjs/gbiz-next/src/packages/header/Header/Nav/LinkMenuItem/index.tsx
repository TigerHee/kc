import { find } from 'lodash-es';
import Link from '../../../components/Link';
import { useHeaderStore } from '../../model';
import type { FirstLevelNavigation, NavType } from '../types';
import { extractRelativePath, getMenuSpm, isSameOrigin, kcsensorsClick, spmSaveOrQuery } from '../../../common/tools';
import { useTenantConfig } from '../../../tenantConfig';
import ExtContentList from '../../../components/TradeList';
import kuCardVisa from '../../../static/newHeader/visa.svg';
import { useCallback, useEffect, useState } from 'react';
import { Dropdown, useTheme } from '@kux/design';
import clsx from 'clsx';
import styles from './index.module.scss';
import { setTradeSource } from '../../tools';
import NavIcon from '../NavIcon';
import { usePageProps } from 'provider/PageProvider';

type MenuContent = {
  index: number;
  modid?: string;
  parentIndex: number;
  parentItem?: FirstLevelNavigation;
  showTradeList?: boolean;
  getUrl: any;
};

type Props = {
  navItem: NavType;
  content: MenuContent;
  parentRef?: any;
  showMenu?: any;
  inDrawer?: boolean;
  currentLang?: string;
  userInfo?: any;
  hostConfig?: any;
  navigationFunctionBanner?: any;
  navigationActivityBanner?: any;
};

const LinkMenuItem = (props: Props) => {
  const {
    navItem,
    content: { index = 0, modid = '', parentIndex, parentItem, showTradeList, getUrl },
    parentRef,
    showMenu = {},
    inDrawer,
    currentLang,
    userInfo,
    hostConfig,
  } = props;
  const symbolsMenu = useHeaderStore(state => state.symbolsMenu);
  const flagInfo = find(navItem.marks, item => item.type === 3) || {};
  const menuSpm = getMenuSpm(parentIndex, index);
  const menuUrl = getUrl(navItem);
  const currentTheme = useTheme();
  const [parentVisible, setparentVisible] = useState(false);
  const updateHeader = useHeaderStore(state => state.updateHeader);
  const tradeType: string = navItem?.extContext?.tradeType?.[0] || '';

  const tenantConfig = useTenantConfig();

  useEffect(() => {
    let pVisible = false;
    if (parentItem && showMenu) {
      // 默认展示自菜单右侧内容，子元素需要加载数据
      if (
        showMenu.id === parentItem.navigationDetail.id &&
        showMenu.name === parentItem.navigationDetail.textMap.name
      ) {
        pVisible = true;
      }
    }

    setparentVisible(pVisible);
  }, [parentItem, showMenu]);

  const onTradeMenuVisibleChange = useCallback(
    show => {
      const _symbolsMenu = show
        ? { [tradeType]: show }
        : {
            ...symbolsMenu,
            [tradeType]: show,
          };
      updateHeader?.({
        symbolsMenu: _symbolsMenu,
      });
    },
    [updateHeader, tradeType, symbolsMenu]
  );
  const openFirstTarde = () => {
    // 第一个为交易对且要展示，默认展开
    if (tradeType && showTradeList && !inDrawer && index === 0) {
      updateHeader?.({
        symbolsMenu: { ...symbolsMenu, [tradeType]: true },
      });
    }
  };
  useEffect(() => {
    if (parentVisible) {
      openFirstTarde();
    }
  }, [parentVisible]);

  const showMarks = !!navItem.marks?.length;

  if (tradeType && showTradeList && !inDrawer) {
    return (
      <Dropdown
        trigger="hover"
        className={clsx(styles.cusDropdown, symbolsMenu?.[tradeType] && styles.cusDropdownVisible)}
        visible={symbolsMenu?.[tradeType]}
        onVisibleChange={onTradeMenuVisibleChange}
        anchorProps={{ style: { display: 'block' } }}
        placement="right-start"
        keepMounted
        overlay={
          symbolsMenu?.[tradeType] ? (
            <div className={styles.__AnimateTradeList__}>
              <ExtContentList
                tradeType={tradeType}
                lang={currentLang}
                userInfo={userInfo}
                id={tradeType}
                parentRef={parentRef}
                visible={symbolsMenu[tradeType]}
                // visible未发生改变时，展示的子元素需要加载数据，类似父菜单的visible
                needLoad={parentVisible}
                hostConfig={hostConfig}
              />
            </div>
          ) : (
            <span />
          )
        }
      >
        <div
          className={clsx([styles.linkMenuItemWapper, currentTheme === 'dark' ? styles.darkHover : styles.lightHover])}
        >
          <Link
            key={navItem?.id}
            href={menuUrl}
            className={clsx([styles.menuItem, styles.dropdownItem])}
            routeTo={isSameOrigin(menuUrl)}
            onClick={e => {
              if (navItem?.onClick) {
                navItem.onClick(e);
              }
              setTradeSource(menuUrl); // 记录跳转来源
              kcsensorsClick(['navigationFunction', '1'], {
                groupId: parentItem?.navigationDetail.textMap.name,
                contentType: parentItem?.navigationDetail.id,
                postTitle: navItem?.textMap.name,
                postId: navItem?.id,
                sortPosition: index,
                url: menuUrl,
                pagecate: 'navigationFunction',
              });
              spmSaveOrQuery(e, menuUrl, menuSpm, currentLang);
            }}
            data-ga={navItem.id}
            data-modid={modid}
            data-idx={index}
            lang={currentLang}
          >
            <NavIcon navItem={navItem} />
            <div className={styles.menuItemBox}>
              <div className={styles.menuItemTitle}>
                <span className={styles.menuItemName} style={showMarks && flagInfo.name ? {} : { maxWidth: '270px' }}>
                  {navItem.textMap.name || ''}
                </span>

                <div className={styles.menuItemIcons}>
                  {showMarks && flagInfo.name ? (
                    <span className={styles.flag} title={flagInfo.name}>
                      <span>{flagInfo.name}</span>
                    </span>
                  ) : null}
                </div>
              </div>
              <div className={styles.menuItemSubTitle}>{navItem.textMap.explain}</div>
            </div>
          </Link>
        </div>
      </Dropdown>
    );
  }
  return (
    <div
      className={clsx(
        styles.linkMenuItemWapper,
        currentTheme === 'dark' ? styles.darkHover : styles.lightHover,
        inDrawer && styles.linkMenuItemWapperInDrawer
      )}
    >
      <Link
        key={navItem.id}
        href={menuUrl}
        className={clsx({
          [styles.menuItem]: true,
          [styles.menuItemInDrawer]: inDrawer,
          [styles.dropdownItem]: !inDrawer,
        })}
        routeTo={isSameOrigin(menuUrl)}
        onClick={e => {
          if (navItem.onClick) {
            navItem.onClick(e);
          }
          kcsensorsClick(['navigationFunction', '1'], {
            groupId: parentItem?.navigationDetail.textMap.name,
            contentType: parentItem?.navigationDetail.id,
            postTitle: navItem?.textMap.name,
            postId: navItem.id,
            sortPosition: index,
            url: menuUrl,
            pagecate: 'navigationFunction',
          });
          spmSaveOrQuery(e, menuUrl, menuSpm, currentLang);
        }}
        data-ga={navItem.id}
        data-modid={modid}
        data-idx={index}
        data-inspector={`inspector_header_url_${extractRelativePath(menuUrl)}`}
        lang={currentLang}
      >
        <NavIcon navItem={navItem} inDrawer={inDrawer} />
        <div className={styles.menuItemBox}>
          <div className={clsx(styles.menuItemTitle, inDrawer && styles.menuItemTitleInDrawer)}>
            <span
              className={styles.menuItemName}
              style={!!navItem.marks?.length && flagInfo.name ? {} : { maxWidth: '270px' }}
            >
              {navItem.textMap.name || ''}
            </span>
            {!inDrawer && (
              <div className={styles.menuItemIcons}>
                {!!navItem.marks?.length && flagInfo.name ? (
                  <span className={styles.flag} title={flagInfo.name}>
                    <span>{flagInfo.name}</span>
                  </span>
                ) : null}
              </div>
            )}
            {/* 只有主站/欧洲站展示 KuCard Visa 图标，临时写死方案 */}
            {tenantConfig.showKuCardVisa && navItem.uri === '/kucard' && (
              <img src={kuCardVisa} alt="Visa" className={styles.visaIcon} />
            )}
          </div>
          {!inDrawer && <div className={styles.menuItemSubTitle}>{navItem.textMap.explain}</div>}
        </div>
      </Link>
    </div>
  );
};

export default LinkMenuItem;
