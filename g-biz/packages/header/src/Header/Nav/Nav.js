/**
 * Owner: iron@kupotech.com
 */
import { ICTriangleBottomOutlined } from '@kux/icons';
import { Accordion, useTheme } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { forEach, map } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import loadable from '@loadable/component';
import { useCompliantShow } from '@packages/compliantCenter';
import useIpCountryCode from '@hooks/useIpCountryCode';
import {
  addSpmIntoQuery,
  checkIsInApp,
  getMenuSpm,
  isSameOrigin,
  kcsensorsMenuClick as kcsensorsClick,
  kcsensorsManualTrack,
  spmSaveOrQuery,
  NoSSG,
} from '../../common/tools';
import Link from '../../components/Link';
import { tenantConfig } from '../../tenantConfig';
import { namespace } from '../model';
import {
  AFFILIATE_HUBS_ENTRY,
  HEADER_KUREWARDS_SPM,
  // HEADER_REFERRAL_KUREWARDS_SPM,
  // HEADER_TURKEY_ENTRY_SPM,
  NEWBIE_ZONE_ENTRY,
  REWARDS_HUBS_ENTRY,
  complianceSPM,
  genAffiliateHubItem,
  genRewardsHubItem,
  genTurkeyHubItem,
  getHelpLang,
} from './const';

import LoaderComponent from '../../components/LoaderComponent';
import AnimateDropdown from '../AnimateDropdown';
import { closeNewTag, getFuturesUrl, getNewTagClosedState, setTradeSource } from '../tools';
import { NEW_TAG_PATH_MARKET, NEW_TAG_HEADER_MARKET } from '../config';
import { BlankNav, CusAccordion, NavItem, NavWrapper, Ul, Newbie, NewBieBox } from './styled';

const Overlay = loadable(() => import('./Overlay'));
const { AccordionPanel: Panel } = Accordion;

export default function Nav(props = {}) {
  const { userInfo, isSub, currentLang, inDrawer, hostConfig, navStatus, inTrade } = props;
  const { KUCOIN_HOST, LANDING_HOST } = hostConfig || {};
  const theme = useTheme();

  // eslint-disable-next-line no-unused-vars
  const _list = useSelector((state) => state[namespace].navList);
  const isPartner = useSelector((state) => state[namespace].isPartner);
  const [showMenu, setShowMenu] = useState();

  const dispatch = useDispatch();
  const { t: _t } = useTranslation('header');
  const isInApp = checkIsInApp();
  const compliantShow = useCompliantShow(complianceSPM);
  const ipCountryCode = useIpCountryCode();
  // ip 是英国，删除福利中心和邀请有礼链接
  // const showReferralAndKuRewards = useCompliantShow(HEADER_REFERRAL_KUREWARDS_SPM);
  // ip 是土耳其，展示土耳其入口, 展业配置 ip = 土耳其 返回 false, 其他 ip 返回 true
  // const hideTurkeyEntry = useCompliantShow(HEADER_TURKEY_ENTRY_SPM);
  // 是否是土耳其用户
  const isTR = ipCountryCode === 'TR';
  // ip 是土耳其、英国，showKurewards = false, 隐藏福利中心入口
  const showKurewards = useCompliantShow(HEADER_KUREWARDS_SPM);

  const navList = useMemo(() => {
    let resList = _list;
    if (resList?.length) {
      // 遍历，如果是英国用户，删除福利中心和邀请有礼链接
      // if (!showReferralAndKuRewards) {
      //   const toRemoveUri = ['/referral', '/land/KuRewards'];
      //   const recursion = (arr = []) => {
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
        resList = resList.concat([genTurkeyHubItem(_t, currentLang, LANDING_HOST)]);
      }
      // 福利中心入口和合伙人入口互斥
      // 当用户已登录且已是合伙人时展示该入口，app不展示合伙人，非该情况展示“福利中心”
      if (tenantConfig.showAffiliateHub && userInfo && isPartner && !isInApp) {
        resList = resList.concat([genAffiliateHubItem(_t, currentLang, KUCOIN_HOST)]);
      } else if (tenantConfig.showRewardsHub && showKurewards) {
        resList = resList.concat([genRewardsHubItem(_t, currentLang, LANDING_HOST)]);
      }
    }
    return resList;
  }, [
    _list,
    isTR,
    currentLang,
    userInfo,
    isPartner,
    isInApp,
    showKurewards,
    _t,
    LANDING_HOST,
    KUCOIN_HOST,
  ]);

  useEffect(() => {
    dispatch({
      type: `${namespace}/pullNavigationList`,
      payload: {
        userType: isSub ? 'ONLY_SUB_USER' : 'ONLY_PARENT_USER',
        lang: currentLang,
      },
    });
  }, [isSub, currentLang]);

  useEffect(() => {
    if (userInfo) {
      dispatch({
        type: `${namespace}/getIsPartner`,
      });
    }
  }, [isPartner, userInfo]);

  // 判断当前url是.cc域名还是.com
  const getUrl = useCallback(
    (navItem) => {
      let jumpUrl = '';
      const { hostname } = window.location;
      // 针对帮助中心语言参数做特殊处理
      if (navItem.uri === 'https://support.kucoin.plus/hc') {
        jumpUrl = `${navItem.uri}/${getHelpLang[currentLang]}`;
      } else if (hostname.includes('.com')) {
        jumpUrl = `${navItem.uri}`;
      } else {
        jumpUrl = `${navItem.zhUri}`;
      }

      // 合约入口
      if (navItem.uri?.startsWith('/futures/trade/')) {
        jumpUrl = getFuturesUrl(navItem.uri);
      }

      return jumpUrl;
    },
    [currentLang],
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
  const genLinkNav = (navItem, index = 0) => {
    // const stressInfo = find(navItem.marks, (item) => item.type === 1) || {}; // 推广标示
    // const stressNav = stressInfo.position === 1 || stressInfo.position === 3 ? stressInfo.name : '';
    // 展示new标签（showNew为true、没有关闭、国际站）
    const showHeaderNewTag =
      navItem.showNew &&
      !getNewTagClosedState(NEW_TAG_HEADER_MARKET) &&
      tenantConfig.showHeaderNewTag;

    if (!navItem.uri) {
      return (
        <BlankNav key={navItem.id} inDrawer={inDrawer}>
          {navItem.name}
        </BlankNav>
      );
    }
    const _index = Number(index || 0) + 1;
    const menuSpm = getMenuSpm(index, 0);
    const menuUrl = getUrl(navItem);
    return (
      <Link
        key={navItem.id}
        href={menuUrl}
        routeTo={isSameOrigin(menuUrl)}
        lang={currentLang}
        data-ga={navItem.id}
        data-modid={`headers${_index}`}
        css={NavItem({ inDrawer, theme, inTrade })}
        onClick={(e) => {
          if (navItem.onClick) {
            navItem.onClick(e);
          }
          // 有new标签的，点击后写到缓存，下次不展示
          if (navItem.uri === NEW_TAG_PATH_MARKET) {
            closeNewTag(NEW_TAG_HEADER_MARKET);
          }

          setTradeSource(navItem.uri); // 记录跳转来源

          kcsensorsClick(['navigation', '1'], {
            postTitle: navItem.name,
            postId: navItem.id,
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
        {navItem.name}
        {/* new标签（new无文案，点击后消失） */}
        {showHeaderNewTag && (
          <NoSSG>
            <div className="newTagNav">
              <span>NEW</span>
            </div>
          </NoSSG>
        )}
      </Link>
    );
  };

  // 一级类目有子菜单,提供给Drawer内部使用
  const genSingleCollapseNav = (navItem, index = 0) => {
    const _index = Number(index || 0) + 1;
    return (
      <Panel header={navItem.name} key={_index}>
        <LoaderComponent show={inDrawer}>
          <Overlay
            inDrawer={inDrawer}
            getUrl={getUrl}
            items={navItem.children}
            modid={`headers${_index}`}
            parentItem={navItem}
            {...props}
          />
        </LoaderComponent>
      </Panel>
    );
  };
  // 满足显示时间超过300ms，才算曝光
  const exposeFlagMap = useRef({});
  // 二级菜单曝光
  const onSubMenuVisibleChange = useCallback(
    (menu, show, menuIndex) => {
      if (!menu) return;
      if (menu && menu.id && menu.name && show) {
        setShowMenu({ id: menu.id, name: menu.name });
      } else {
        setShowMenu({});
      }
      if (show && menu.children) {
        if (exposeFlagMap.current[menu.id]) {
          clearTimeout(exposeFlagMap.current[menu.id]);
        }
        exposeFlagMap.current[menu.id] = setTimeout(() => {
          if (menu.children[0]?.type === 'NAVIGATION_GROUP') {
            forEach(menu.children, (groupMenu) => {
              forEach(groupMenu.children, (subMenu, subIndex) => {
                const menuSpm = getMenuSpm(menuIndex, subIndex);
                const menuUrl = addSpmIntoQuery(getUrl(subMenu), menuSpm, currentLang);
                kcsensorsManualTrack(['navigationFunction', '1'], {
                  groupId: menu.name,
                  contentType: menu.id,
                  postTitle: subMenu.name,
                  postId: subMenu.id,
                  sortPosition: subIndex,
                  url: menuUrl,
                  pagecate: 'navigationFunction',
                });
              });
            });
          } else {
            forEach(menu.children, (subMenu, subIndex) => {
              const menuSpm = getMenuSpm(menuIndex, subIndex);
              const menuUrl = addSpmIntoQuery(getUrl(subMenu), menuSpm, currentLang);
              kcsensorsManualTrack(['navigationFunction', '1'], {
                groupId: menu.name,
                contentType: menu.id,
                postTitle: subMenu.name,
                postId: subMenu.id,
                sortPosition: subIndex,
                url: menuUrl,
                pagecate: 'navigationFunction',
              });
            });
          }
          exposeFlagMap.current[menu.id] = null;
        }, 300);
      } else {
        const flag = exposeFlagMap.current[menu.id];
        if (flag) {
          clearTimeout(flag);
          exposeFlagMap.current[menu.id] = null;
        }
      }
    },
    [currentLang],
  );

  // 一级类目有子菜单
  const genSingleDropDownNav = (navItem, index = 0) => {
    const _index = Number(index || 0) + 1;
    return (
      <AnimateDropdown
        trigger="hover"
        key={navItem.id}
        overlay={
          <LoaderComponent show={showMenu}>
            <Overlay
              items={navItem.children}
              modid={`headers${_index}`}
              parentIndex={index}
              parentItem={navItem}
              inDrawer={inDrawer}
              getUrl={getUrl}
              showMenu={showMenu}
              {...props}
            />
          </LoaderComponent>
        }
        onVisibleChange={(show) => {
          onSubMenuVisibleChange(navItem, show, index);
        }}
        placement="bottom-start"
        anchorProps={{ style: { 'display': 'block' } }}
        inDrawer={inDrawer}
      >
        <div css={NavItem({ inDrawer, theme, inTrade })}>
          {navItem.name}
          <ICTriangleBottomOutlined size="12" className="arrowIcon" color={theme.colors.icon60} />
        </div>
      </AnimateDropdown>
    );
  };

  const getNewbieNav = (navItem, index = 0, inDrawer = false) => {
    const _index = Number(index || 0) + 1;
    return (
      <NewBieBox key={navItem?.id}>
        <Link
          key={navItem?.id}
          href={navItem?.uri}
          lang={currentLang}
          data-ga={navItem?.id}
          data-modid={`headers${_index}`}
          data-inspector="inspector_new_bie_nav"
          css={inDrawer ? NavItem({ inDrawer, theme, inTrade }) : Newbie({ theme, navStatus })}
          onClick={(e) => {
            if (navItem.onClick) {
              navItem.onClick(e);
            }
            kcsensorsClick(['navigationNewZone', '1'], {
              pagecate: 'newZone',
            });
          }}
          style={{ display: compliantShow ? 'flex' : 'none' }}
        >
          {navStatus < 2 || navStatus === 5 || inDrawer ? (
            <span className="ellipsis">{navItem.name}</span>
          ) : (
            navItem.simpleIcon
          )}
          {/* <span className="ellipsis">{navItem.name}</span> */}
        </Link>
      </NewBieBox>
    );
  };

  if (inDrawer) {
    return (
      <CusAccordion bordered={false}>
        {map(navList, (navItem, index) => {
          let comp;
          if (navItem.children && navItem.children.length) {
            comp = genSingleCollapseNav({ ...navItem }, index + 1);
          } else if (
            [NEWBIE_ZONE_ENTRY, REWARDS_HUBS_ENTRY, AFFILIATE_HUBS_ENTRY].includes(navItem.id)
          ) {
            comp = getNewbieNav({ ...navItem }, index + 1, true);
          } else {
            comp = genLinkNav({ ...navItem }, index + 1);
          }
          return comp;
        })}
      </CusAccordion>
    );
  }
  return (
    <NavWrapper inDrawer={inDrawer}>
      <Ul>
        {map(navList, (navItem, index) => {
          let comp;
          if (navItem.children && navItem.children.length) {
            comp = genSingleDropDownNav({ ...navItem }, index + 1);
          } else if (
            [NEWBIE_ZONE_ENTRY, REWARDS_HUBS_ENTRY, AFFILIATE_HUBS_ENTRY].includes(navItem.id)
          ) {
            comp = getNewbieNav({ ...navItem }, index + 1);
          } else {
            comp = genLinkNav({ ...navItem }, index + 1);
          }
          return <li key={navItem.id}>{comp}</li>;
        })}
      </Ul>
    </NavWrapper>
  );
}
