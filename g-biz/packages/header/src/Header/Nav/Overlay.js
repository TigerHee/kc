/**
 * Owner: iron@kupotech.com
 */
import { ICArrowRightOutlined } from '@kux/icons';
import { find, forEach, map } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  getMenuSpm,
  isSameOrigin,
  kcsensorsMenuClick as kcsensorsClick,
  spmSaveOrQuery,
  extractRelativePath,
} from '../../common/tools';
import TradeList from '../../components/TradeList';
import { namespace } from '../model';
import { tenantConfig } from '../../tenantConfig';
import kuCardVisa from '../../../static/newHeader/visa.svg';

import {
  CusDropdown,
  GrounpDiv,
  GrounpName,
  LinkMenuItemWapper,
  MenuItem,
  OverlayList,
  OverlayWrapper,
} from './styled';
import { setTradeSource } from '../tools';

const LinkMenuItem = (props) => {
  const {
    navItem,
    content: { index = 0, modid = '', parentIndex, parentItem, showTradeList, getUrl },
    parentRef,
    showMenu = {},
    ...rest
  } = props;
  const { inDrawer, currentLang, userInfo, hostConfig } = rest;
  const symbolsMenu = useSelector((state) => state[namespace].symbolsMenu);
  const dispatch = useDispatch();
  const flagInfo = find(navItem.marks, (item) => item.type === 3) || {};
  const menuSpm = getMenuSpm(parentIndex, index);
  const menuUrl = getUrl(navItem);
  const [parentVisible, setparentVisible] = useState();
  useEffect(() => {
    let pVisible = false;
    if (parentItem && showMenu) {
      // 默认展示自菜单右侧内容，子元素需要加载数据
      if (showMenu.id === parentItem.id && showMenu.name === parentItem.name) {
        pVisible = true;
      }
    }
    setparentVisible(pVisible);
  }, [parentItem, showMenu]);

  const onTradeMenuVisibleChange = useCallback(
    (show) => {
      const _symbolsMenu = show
        ? { [navItem.tradeType]: show }
        : {
            ...symbolsMenu,
            [navItem.tradeType]: show,
          };
      dispatch({
        type: `${namespace}/update`,
        payload: {
          symbolsMenu: _symbolsMenu,
        },
      });
    },
    [dispatch, navItem.tradeType, symbolsMenu],
  );
  const openFirstTarde = () => {
    // 第一个为交易对且要展示，默认展开
    if (navItem.tradeType && showTradeList && !inDrawer && index === 0) {
      dispatch({
        type: `${namespace}/update`,
        payload: {
          symbolsMenu: { [navItem.tradeType]: true },
        },
      });
    }
  };
  useEffect(() => {
    if (parentVisible) {
      openFirstTarde();
    }
  }, [parentVisible]);

  if (navItem.tradeType && showTradeList && !inDrawer) {
    return (
      <CusDropdown
        trigger="hover"
        visible={symbolsMenu[navItem.tradeType]}
        onVisibleChange={onTradeMenuVisibleChange}
        anchorProps={{ style: { 'display': 'block' } }}
        placement="bottom-start"
        keepMounted
        overlay={
          symbolsMenu[navItem.tradeType] ? (
            <div className="__AnimateTradeList__">
              <TradeList
                tradeType={navItem.tradeType}
                lang={currentLang}
                userInfo={userInfo}
                id={navItem.tradeType}
                parentRef={parentRef}
                visible={symbolsMenu[navItem.tradeType]}
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
        <LinkMenuItemWapper inDrawer={inDrawer}>
          <MenuItem
            key={navItem.id}
            href={menuUrl}
            routeTo={isSameOrigin(menuUrl)}
            onClick={(e) => {
              if (navItem.onClick) {
                navItem.onClick(e);
              }
              setTradeSource(menuUrl); // 记录跳转来源
              kcsensorsClick(['navigationFunction', '1'], {
                groupId: parentItem.name,
                contentType: parentItem.id,
                postTitle: navItem.name,
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
            lang={currentLang}
            inDrawer={inDrawer}
          >
            {!!navItem.icons && (
              <div className="menuItemIcon">
                <LazyLoadImage src={navItem.icons} alt="" />
              </div>
            )}
            <div className="menuItemBox">
              <div className="menuItemTitle">
                <span
                  className="menuItemName"
                  style={navItem.showMark && flagInfo.name ? null : { maxWidth: '270px' }}
                >
                  {navItem.name || ''}
                </span>
                {!inDrawer && (
                  <div className="menuItemIcons">
                    {navItem.showMark && flagInfo.name ? (
                      <span className="flag" title={flagInfo.name}>
                        <span>{flagInfo.name}</span>
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
              {!inDrawer && <div className="menuItemSubTitle">{navItem.explain}</div>}
            </div>
            <ICArrowRightOutlined width="20px" height="20px" className="arrow" />
          </MenuItem>
        </LinkMenuItemWapper>
      </CusDropdown>
    );
  }
  return (
    <LinkMenuItemWapper inDrawer={inDrawer}>
      <MenuItem
        key={navItem.id}
        href={menuUrl}
        routeTo={isSameOrigin(menuUrl)}
        onClick={(e) => {
          if (navItem.onClick) {
            navItem.onClick(e);
          }
          kcsensorsClick(['navigationFunction', '1'], {
            groupId: parentItem.name,
            contentType: parentItem.id,
            postTitle: navItem.name,
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
        inDrawer={inDrawer}
      >
        {!!navItem.icons && (
          <div className="menuItemIcon">
            <LazyLoadImage src={navItem.icons} alt="" />
          </div>
        )}
        <div className="menuItemBox">
          <div className="menuItemTitle">
            <span
              className="menuItemName"
              style={navItem.showMark && flagInfo.name ? null : { maxWidth: '270px' }}
            >
              {navItem.name || ''}
            </span>
            {!inDrawer && (
              <div className="menuItemIcons">
                {navItem.showMark && flagInfo.name ? (
                  <span className="flag" title={flagInfo.name}>
                    <span>{flagInfo.name}</span>
                  </span>
                ) : null}
              </div>
            )}
            {/* 只有主站/欧洲站展示 KuCard Visa 图标，临时写死方案 */}
            {tenantConfig.showKuCardVisa && navItem.uri === '/kucard' && (
              <img src={kuCardVisa} alt="Visa" className="visaIcon" />
            )}
          </div>
          {!inDrawer && <div className="menuItemSubTitle">{navItem.explain}</div>}
        </div>
        {!inDrawer && <ICArrowRightOutlined width="20px" height="20px" className="arrow" />}
      </MenuItem>
    </LinkMenuItemWapper>
  );
};

const Overlay = ({
  items,
  modid,
  parentIndex,
  parentItem,
  inDrawer,
  getUrl,
  showMenu,
  ...props
}) => {
  console.log('==== trunkLoaded menus links');

  const groupRef = useRef();
  const secondRef = useRef();

  const groupList = [];
  let colList = [];
  let colNumber = 0;
  if (items[0]?.type === 'NAVIGATION_GROUP') {
    forEach(items, (i, index) => {
      if (i.children) {
        const len = i.children.length;
        if (colNumber + len <= 7) {
          colList.push(i);
          colNumber += len;
        } else {
          const _colList = [...colList];
          groupList.push(_colList);
          colList = [];
          colList.push(i);
          colNumber = len;
        }
        // 最后一个直接加进数组
        if (index === items.length - 1) {
          groupList.push(colList);
        }
      }
    });
    const showTradeList = groupList.length < 2;
    return (
      <OverlayWrapper inDrawer={inDrawer} ref={groupRef}>
        {map(groupList, (grounpItem, grounpIndex) => {
          return (
            <OverlayList key={grounpIndex} inDrawer={inDrawer}>
              {map(grounpItem, (nextItem, nextIndex) => {
                return (
                  <GrounpDiv key={nextIndex}>
                    <GrounpName inDrawer={inDrawer}>{nextItem.name}</GrounpName>
                    {map(nextItem.children, (lastItem, lastIndex) => {
                      return (
                        <LinkMenuItem
                          key={lastItem.id}
                          navItem={{ ...lastItem }}
                          showMenu={showMenu}
                          content={{
                            index: lastIndex,
                            modid,
                            parentIndex,
                            parentItem,
                            showTradeList,
                            getUrl,
                          }}
                          parentRef={groupRef}
                          inDrawer={inDrawer}
                          {...props}
                        />
                      );
                    })}
                  </GrounpDiv>
                );
              })}
            </OverlayList>
          );
        })}
      </OverlayWrapper>
    );
  }
  if (items[0]?.type === 'NAVIGATION_SECOND_LEVEL') {
    forEach(items, (i, index) => {
      if (colNumber < 7) {
        colList.push(i);
        colNumber += 1;
      } else {
        const _colList = [...colList];
        groupList.push(_colList);
        colNumber = 0;
        colList = [];
        colList.push(i);
        colNumber += 1;
      }
      // 最后一个直接加进数组
      if (index === items.length - 1) {
        groupList.push(colList);
      }
    });
    const showTradeList = groupList.length < 2;
    return (
      <OverlayWrapper ref={secondRef} inDrawer={inDrawer}>
        {map(groupList, (grounpItem, grounpIndex) => {
          return (
            <OverlayList key={grounpIndex} inDrawer={inDrawer}>
              {map(grounpItem, (nextItem, nextIndex) => {
                return (
                  <LinkMenuItem
                    key={`${grounpIndex}-${nextItem.id}`}
                    navItem={{ ...nextItem }}
                    showMenu={showMenu}
                    content={{
                      index: nextIndex,
                      modid,
                      parentIndex,
                      parentItem,
                      showTradeList,
                      getUrl,
                    }}
                    parentRef={secondRef}
                    inDrawer={inDrawer}
                    {...props}
                  />
                );
              })}
            </OverlayList>
          );
        })}
      </OverlayWrapper>
    );
  }
  return null;
};

export default Overlay;
