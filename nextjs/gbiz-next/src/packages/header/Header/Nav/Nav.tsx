/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TriangleBottomIcon } from '@kux/iconpack';
import { Collapse, useTheme } from '@kux/design';
import clsx from 'clsx';
import { getHostname } from 'kc-next/boot';
import { useTranslation } from 'tools/i18n';
import { forEach, map } from 'lodash-es';

import useIpCountryCode from 'hooks/useIpCountryCode';

import loadable from '@loadable/component';
import { useCompliantShow } from 'packages/compliantCenter';
import {
  addSpmIntoQuery,
  getMenuSpm,
  isSameOrigin,
  kcsensorsMenuClick as kcsensorsClick,
  kcsensorsManualTrack,
  spmSaveOrQuery,
  NoSSG,
} from '../../common/tools';
import Link from '../../components/Link';
import { useTenantConfig } from '../../tenantConfig';
import {
  AFFILIATE_HUBS_ENTRY,
  HEADER_KUREWARDS_SPM,
  // HEADER_REFERRAL_KUREWARDS_SPM,
  // HEADER_TURKEY_ENTRY_SPM,
  NEWBIE_ZONE_ENTRY,
  REWARDS_HUBS_ENTRY,
  complianceSPM,
  genAffiliateHubItemV2,
  genRewardsHubItemV2,
  genTurkeyHubItemV2,
  getHelpLang,
} from './const';

import LoaderComponent from '../../components/LoaderComponent';

import { closeNewTag, getFuturesUrl, getNewTagClosedState, setTradeSource } from '../tools';
import { NEW_TAG_PATH_MARKET, NEW_TAG_HEADER_MARKET } from '../config';
import { useHeaderStore } from '../model';
import styles from './styles.module.scss';
import { getIsApp } from 'kc-next/boot';
import { getCurrentLang } from 'kc-next/i18n';
import { MarkType, type FirstLevelNavigation, type NavProps, type NavType } from './types';
import FixedDropdown from './FixedDropdown';
import { usePageProps } from 'provider/PageProvider';

const Overlay = loadable(() => import('./Overlay'));

export default function Nav(props: NavProps) {
  const { userInfo, isSub, inDrawer, hostConfig, navStatus, inTrade } = props;
  const currentLang = getCurrentLang();
  const { KUCOIN_HOST, LANDING_HOST } = hostConfig || {};
  const tenantConfig = useTenantConfig();
  const exposeRef = useRef({});

  // const _list = useHeaderStore(state => state.navList);
  const webNavigation = useHeaderStore(state => state.webNavigation);
  // const { navigationFunctionBanner, navigationActivityBanner } = webNavigation || {};
  const isPartner = useHeaderStore(state => state.isPartner);
  const [showMenu, setShowMenu] = useState<{ id: string; name: string } | {}>({});

  const { t: _t } = useTranslation('header');
  const isInApp = getIsApp();
  const compliantShow = useCompliantShow(complianceSPM);
  const pullNavigationList = useHeaderStore(state => state.pullNavigationList);
  const getIsPartner = useHeaderStore(state => state.getIsPartner);

  const ipCountryCode = useIpCountryCode();
  // ip 是英国，删除福利中心和邀请有礼链接
  // const showReferralAndKuRewards = useCompliantShow(HEADER_REFERRAL_KUREWARDS_SPM);
  // ip 是土耳其，展示土耳其入口, 展业配置 ip = 土耳其 返回 false, 其他 ip 返回 true
  // const hideTurkeyEntry = useCompliantShow(HEADER_TURKEY_ENTRY_SPM);
  // 是否是土耳其用户
  const isTR = ipCountryCode === 'TR';
  // ip 是土耳其、英国，showKurewards = false, 隐藏福利中心入口
  const showKurewards = useCompliantShow(HEADER_KUREWARDS_SPM);
  const { theme } = usePageProps();

  // navList 是一级菜单list
  const navList: FirstLevelNavigation[] = useMemo(() => {
    // let resList: any[] = _list;
    let resList: FirstLevelNavigation[] = webNavigation?.navigation || [];
    if (resList?.length) {
      // 遍历，如果是英国用户，删除福利中心和邀请有礼链接
      // if (!showReferralAndKuRewards) {
      //   const toRemoveUri = ['/referral', '/land/KuRewards'];
      //   const recursion = (arr: any[] = []) => {
      //     for (let i = arr.length - 1; i >= 0; i--) {
      //       if (arr[i].children) {
      //         recursion(arr[i].children);
      //       } else if (arr[i].uri && toRemoveUri.includes(arr[i].uri)) {
      //         arr.splice(i, 1);
      //       }
      //     }
      //   };
      //   recursion(resList);
      // }

      if (tenantConfig.showTrSiteEntry && (isTR || currentLang === 'tr_TR')) {
        // 土耳其合规: IP为土耳其或者语言为土耳其时展示土耳其站入口
        resList = resList.concat([genTurkeyHubItemV2()]);
      }
      // 福利中心入口和合伙人入口互斥
      // 当用户已登录且已是合伙人时展示该入口，app不展示合伙人，非该情况展示“福利中心”
      if (tenantConfig.showAffiliateHub && userInfo && isPartner && !isInApp) {
        resList = resList.concat([genAffiliateHubItemV2(_t, KUCOIN_HOST)]);
      } else if (tenantConfig.showRewardsHub && showKurewards) {
        resList = resList.concat([genRewardsHubItemV2(_t, LANDING_HOST, theme)]);
      }
    }
    return resList;
  }, [webNavigation, isTR, currentLang, userInfo, isPartner, isInApp, showKurewards, _t, LANDING_HOST, KUCOIN_HOST]);

  // 改为 SSR 请求
  useEffect(() => {
    // SSR 下 isSub 客户端重新请求
    if (isSub) {
      pullNavigationList?.({
        userType: 'ONLY_SUB_USER',
        lang: currentLang,
      });
    }
  }, [isSub, currentLang]);

  useEffect(() => {
    if (userInfo) {
      getIsPartner?.();
    }
  }, [isPartner, userInfo]);

  // 判断当前url是.cc域名还是.com
  const getUrl = useCallback(
    (navItem: FirstLevelNavigation | NavType) => {
      let jumpUrl = '';
      const hostname = getHostname();
      const uri = (navItem as FirstLevelNavigation)?.navigationDetail?.uri || (navItem as NavType)?.uri;
      // 针对帮助中心语言参数做特殊处理
      if (uri === 'https://support.kucoin.plus/hc') {
        jumpUrl = `${uri}/${getHelpLang[currentLang]}`;
      } else if (hostname.includes('.com')) {
        jumpUrl = `${uri}`;
      } else {
        jumpUrl = `${uri}`;
      }
      // 合约入口
      if (uri?.startsWith('/futures/trade/')) {
        jumpUrl = getFuturesUrl(uri);
      }
      return jumpUrl;
    },
    [currentLang]
  );

  // 神策曝光埋点-无二级菜单-组件显示就立即上报
  // useEffect(() => {
  //   if (navList && navList.length > 0) {
  //     forEach(navList, (navItem, navIndex) => {
  //       if (!navItem.children) {
  //         const menuSpm = getMenuSpm(navIndex, 0);
  //         const menuUrl = addSpmIntoQuery(getUrl(navItem), menuSpm, currentLang);
  //         kcsensorsManualTrack(menuSpm, {
  //           url: menuUrl,
  //           ButtonName: safeGet(navItem, 'buttonName'),
  //         });
  //       }
  //     });
  //   }
  // }, [navList, getUrl, currentLang]);

  // 一级类目
  const genLinkNav = (navItem: FirstLevelNavigation, index = 0) => {
    // const stressInfo = find(navItem.marks, (item) => item.type === 1) || {}; // 推广标示
    // const stressNav = stressInfo.position === 1 || stressInfo.position === 3 ? stressInfo.name : '';
    // 展示new标签（showNew为true、没有关闭、国际站）
    const showHeaderNewTag =
      navItem.navigationDetail.marks?.some?.(item => item.type === MarkType.Unread) &&
      !getNewTagClosedState(NEW_TAG_HEADER_MARKET) &&
      tenantConfig.showHeaderNewTag;

    if (!navItem.navigationDetail.uri) {
      return (
        <div className={clsx(styles.blankNav, inDrawer && styles.blankNavInDrawer)} key={navItem.navigationDetail.id}>
          {navItem.navigationDetail.textMap.name}
        </div>
      );
    }
    const _index = Number(index || 0) + 1;
    const menuSpm = getMenuSpm(index, 0);
    const menuUrl = getUrl(navItem);

    return (
      <Link
        key={navItem.navigationDetail.id}
        href={menuUrl}
        routeTo={isSameOrigin(menuUrl)}
        lang={currentLang}
        data-ga={navItem.navigationDetail.id}
        data-modid={`headers${_index}`}
        // TODO: emotion css 需要替换
        // css={NavItem({ inDrawer, theme, inTrade })}
        className={clsx(styles.navItem, inDrawer && styles.navItemInDrawer)}
        onClick={e => {
          if (navItem.navigationDetail.onClick) {
            navItem.navigationDetail.onClick(e);
          }

          // 有new标签的，点击后写到缓存，下次不展示
          if (navItem.navigationDetail.uri === NEW_TAG_PATH_MARKET) {
            closeNewTag(NEW_TAG_HEADER_MARKET);
          }

          setTradeSource(navItem.navigationDetail.uri); // 记录跳转来源

          kcsensorsClick(['navigation', '1'], {
            postTitle: navItem.navigationDetail.textMap.name,
            postId: navItem.navigationDetail.id,
            sortPosition: _index,
            url: menuUrl,
            pagecate: 'navigation',
          });
          spmSaveOrQuery(e, menuUrl, menuSpm, currentLang);
        }}
      >
        {/* 展示自定义推广图片带文字 */}
        {/* {navItem.showMark && stressInfo.styleType === 2 && stressInfo.icons && (
    <img src={stressInfo.icons} alt="" className="stressImg" />
  )} */}
        {/* 展示默认推广文字 */}
        {/* {navItem.showMark && stressInfo.styleType === 1 && stressNav && (
    <span className="stressNav">{stressNav}</span>
  )} */}
        {navItem.navigationDetail.textMap.name}
        {/* new标签（new无文案，点击后消失） */}
        {/* TODO: 需要确认是否需要 SSR */}
        {showHeaderNewTag && (
          <NoSSG>
            <div className={styles.newTagNav}>
              <span>NEW</span>
            </div>
          </NoSSG>
        )}
      </Link>
    );
  };

  // 一级类目有子菜单,提供给Drawer内部使用
  const genSingleCollapseNav = (navItem: FirstLevelNavigation, index = 0) => {
    const _index = Number(index || 0) + 1;
    return (
      <Collapse.Panel
        header={navItem?.navigationDetail.textMap.name}
        key={_index}
        content={
          <LoaderComponent show={!!inDrawer}>
            <Overlay
              getUrl={getUrl}
              items={navItem?.navigationDetail.children}
              modid={`headers${_index}`}
              parentItem={navItem}
              {...props}
            />
          </LoaderComponent>
        }
      />
    );
  };
  // 满足显示时间超过300ms，才算曝光
  const exposeFlagMap = useRef({});
  // 二级菜单曝光
  const onSubMenuVisibleChange = useCallback(
    (menu: FirstLevelNavigation, show, menuIndex) => {
      if (!menu) return;
      if (menu && menu.navigationDetail.id && menu.navigationDetail.textMap.name && show) {
        setShowMenu({ id: menu.navigationDetail.id, name: menu.navigationDetail.textMap.name });
      } else {
        setShowMenu({});
      }
      if (show && menu.navigationDetail.children) {
        if (exposeFlagMap.current[menu.navigationDetail.id]) {
          clearTimeout(exposeFlagMap.current[menu.navigationDetail.id]);
        }
        exposeFlagMap.current[menu.navigationDetail.id] = setTimeout(() => {
          // if (menu?.children?.[0]?.type === 'NAVIGATION_GROUP') {
          // 有子节点且level=2
          if (menu.navigationDetail.level === 2 && !!menu?.navigationDetail.children?.length) {
            forEach(menu.navigationDetail.children, (groupMenu: NavType) => {
              forEach(groupMenu.children, (subMenu, subIndex) => {
                const menuSpm = getMenuSpm(menuIndex, subIndex);
                const menuUrl = addSpmIntoQuery(getUrl(subMenu), menuSpm, currentLang);
                kcsensorsManualTrack(['navigationFunction', '1'], {
                  groupId: menu.navigationDetail.textMap.name,
                  contentType: menu.navigationDetail.id,
                  postTitle: subMenu?.textMap?.name,
                  postId: subMenu.id,
                  sortPosition: subIndex,
                  url: menuUrl,
                  pagecate: 'navigationFunction',
                });
              });
            });
          } else {
            forEach(menu.navigationDetail.children, (subMenu: NavType, subIndex) => {
              const menuSpm = getMenuSpm(menuIndex, subIndex);
              const menuUrl = addSpmIntoQuery(getUrl(subMenu), menuSpm, currentLang);
              kcsensorsManualTrack(['navigationFunction', '1'], {
                groupId: menu.navigationDetail.textMap.name,
                contentType: menu.navigationDetail.id,
                postTitle: subMenu.textMap.name,
                postId: subMenu.id,
                sortPosition: subIndex,
                url: menuUrl,
                pagecate: 'navigationFunction',
              });
            });
          }
          exposeFlagMap.current[menu.navigationDetail.id] = null;
        }, 300);
      } else {
        const flag = exposeFlagMap.current[menu.navigationDetail.id];
        if (flag) {
          clearTimeout(flag);
          exposeFlagMap.current[menu.navigationDetail.id] = null;
        }
      }
    },
    [currentLang]
  );

  // 一级类目有子菜单
  // 宽屏菜单导航栏
  const genSingleDropDownNav = (navItem: FirstLevelNavigation, index = 0) => {
    const _index = Number(index || 0) + 1;

    return (
      // <AnimateDropdown
      <FixedDropdown
        trigger="hover"
        inTrade={inTrade}
        className={styles.singleDropDownNav}
        key={navItem.navigationDetail.id}
        uniqueKey={navItem.navigationDetail.id}
        overlay={
          <LoaderComponent show={!!showMenu}>
            <Overlay
              items={navItem.navigationDetail.children}
              modid={`headers${_index}`}
              parentIndex={index}
              parentItem={navItem}
              navigationFunctionBanner={navItem.navigationFunctionBanner}
              navigationActivityBanner={navItem.navigationActivityBanner}
              getUrl={getUrl}
              showMenu={showMenu}
              {...props}
            />
          </LoaderComponent>
        }
        onVisibleChange={show => {
          onSubMenuVisibleChange(navItem, show, index);
        }}
        // placement="top-start"
        // anchorProps={{ style: { display: 'block' } }}
        // inDrawer={inDrawer}
      >
        {/* TODO: emotion css 需要替换 */}
        <div className={clsx(styles.navItem, inDrawer && styles.navItemInDrawer)}>
          {navItem.navigationDetail.textMap.name}
          <TriangleBottomIcon size="tiny" className={styles.arrowIcon} color="var(--color-icon60)" />
        </div>
      </FixedDropdown>
    );
  };

  // TODO: 需要检查一下
  const getNewbieNav = (navItem: FirstLevelNavigation, index = 0, inDrawer = false) => {
    const _index = Number(index || 0) + 1;

    const component = (
      <div className={styles.newBieBox} key={navItem?.navigationDetail?.id}>
        <Link
          key={navItem?.navigationDetail?.id}
          href={navItem?.navigationDetail?.uri}
          lang={currentLang}
          data-ga={navItem?.navigationDetail?.id}
          data-modid={`headers${_index}`}
          data-inspector="inspector_new_bie_nav"
          // TODO: emotion css 需要替换
          // css={inDrawer ? NavItem({ inDrawer, theme, inTrade }) : Newbie({ theme, navStatus })}
          className={clsx({
            [styles.navItem]: inDrawer,
            [styles.navItemInDrawer]: inDrawer,
            [styles.newbie]: !inDrawer,
            [styles.newbie1]: !inDrawer && navStatus > 1,
          })}
          onClick={e => {
            if (navItem.navigationDetail?.onClick) {
              navItem.navigationDetail.onClick(e);
            }
            kcsensorsClick(['navigationNewZone', '1'], {
              pagecate: 'newZone',
            });
          }}
          style={{ display: compliantShow ? 'flex' : 'none' }}
        >
          {inDrawer ? (
            <span className="ellipsis">{navItem.navigationDetail.textMap.name}</span>
          ) : (
            navItem.navigationDetail.simpleIcon
          )}
        </Link>
      </div>
    );
    if (navItem?.navigationDetail.showTooltip && !inDrawer) {
      return navItem.navigationDetail.showTooltip(component);
    }
    return component;
  };

  if (inDrawer) {
    return (
      <Collapse
        accordion
        expandIcon={({ isActive }) => (
          <TriangleBottomIcon className={clsx(styles.collapseIcon, isActive && styles.collapseIconActive)} />
        )}
      >
        {map(navList, (navItem: FirstLevelNavigation, index) => {
          let comp;
          if (navItem.navigationDetail.children && navItem.navigationDetail.children.length) {
            comp = genSingleCollapseNav({ ...navItem }, index + 1);
          } else if (
            [NEWBIE_ZONE_ENTRY, REWARDS_HUBS_ENTRY, AFFILIATE_HUBS_ENTRY].includes(navItem.navigationDetail.id)
          ) {
            comp = getNewbieNav({ ...navItem }, index + 1, true);
            if (exposeRef.current && !exposeRef.current[navItem.navigationDetail.id]) {
              // 曝光事件
              kcsensorsManualTrack(['navigationNewZone', '1'], {
                pagecate: 'newZone',
              });
              exposeRef.current[navItem.navigationDetail.id] = 1;
            }
          } else {
            comp = genLinkNav({ ...navItem }, index + 1);
          }
          return comp;
        })}
      </Collapse>
    );
  }
  return (
    <div className={clsx(styles.navWrapper, inDrawer && styles.navWrapperInDrawer)}>
      <ul className={styles.ul}>
        {map(navList, (navItem: FirstLevelNavigation, index) => {
          let comp;
          if (navItem.navigationDetail.children && navItem.navigationDetail.children.length) {
            comp = genSingleDropDownNav({ ...navItem }, index + 1);
            // todo: 需要测试这三个
          } else if (
            [NEWBIE_ZONE_ENTRY, REWARDS_HUBS_ENTRY, AFFILIATE_HUBS_ENTRY].includes(navItem.navigationDetail.id)
          ) {
            comp = getNewbieNav({ ...navItem }, index + 1);
          } else {
            comp = genLinkNav({ ...navItem }, index + 1);
          }
          return (
            <li
              key={navItem.navigationDetail.id}
              className={styles.navListItem}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {comp}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
