/**
 * Owner: tom@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { map } from 'lodash';
import { Accordion, styled, useTheme } from '@kux/mui';
import { css } from '@emotion/react';
import { ICArrowRightOutlined, ICTriangleBottomOutlined, ICMore2Outlined } from '@kux/icons';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import Link from '../../components/Link';
import Dropdown from './Dropdown';
import { WITHOUT_QUERY_PARAM } from '../config';
import { namespace } from '../model';
import { useLang } from '../../hookTool';
import { addLangToPath, kcsensorsClick } from '../../common/tools';
import logoSrc from '../../static/header_logo.svg';

const { AccordionPanel: Panel } = Accordion;

const useStyles = ({ color, inDrawer }) => {
  return {
    nav: css`
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: ${inDrawer ? 'column' : 'row'};
      & > div {
        height: 100%;
      }
      & > div > div {
        height: 100%;
      }
      & .navUl {
        margin: 0;
        padding: 0;
        display: flex;
        list-style: none;
      }
    `,
    navItem: css`
      height: 100%;
      display: flex;
      align-items: center;
      position: relative;
      width: ${inDrawer ? '100%' : 'auto'};
      padding: ${inDrawer ? '10px 12px' : '0'};
      margin-right: 16px;
      font-size: ${inDrawer ? `14px` : `16px`};
      color: ${color.text};
      cursor: pointer;
      text-decoration: none !important;
      font-weight: 500;
      white-space: nowrap;

      & .arrowIcon {
        margin-left: 4px;
        margin-top: 1px;
        transition: all 0.3s ease;
      }
      [dir='rtl'] & .arrowIcon {
        margin-left: unset;
        margin-right: 4px;
        transform: rotate(0);
      }

      &:hover {
        color: ${inDrawer ? color.text : color.primary};
        background: ${inDrawer ? color.cover2 : ''};
        border-radius: ${inDrawer ? '8px' : 0};
      }
      &:hover .arrowIcon {
        transform: rotate(-180deg);
      }
      &:svg {
        width: 10px;
        margin-left: 1px;
      }
      & .stressNav {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #efa842;
        transform: scale(1) translateX(-50%);
        transform-origin: left;
        position: absolute;
        left: 50%;
        top: -17px;
        width: 100%;
        text-align: center;
        white-space: nowrap;
      }
      & .stressImg {
        height: 16px;
        width: 16px;
        position: absolute;
        right: -3px;
        top: -15px;
        object-fit: contain;
      }
      & .oneImg {
        right: 8px;
        top: -14px;
      }
      & .oneNav {
        top: -14px;
      }
    `,
    overlayWrapper: css`
      width: ${inDrawer ? '100%' : '340px'};
      margin: 0;
      padding: ${inDrawer ? '0 0' : '16px 0'};
      background: ${color.layer};
      box-shadow: ${inDrawer ? 'none' : '0px 10px 60px rgba(0, 0, 0, 0.1)'};
      border-radius: ${inDrawer ? 0 : '4px'};
      max-height: calc(100vh - 100px);
      overflow: auto;
      list-style: none;
    `,
    topicsUl: css`
      width: ${inDrawer ? '100%' : '364px'};
      max-height: calc(100vh - 100px);
      margin: 0;
      list-style: none;
      padding: ${inDrawer ? '12px 24px' : '24px 24px'};
      background: ${color.layer};
      box-shadow: ${inDrawer ? 'none' : '0px 10px 60px rgba(0, 0, 0, 0.1)'};
      border-radius: ${inDrawer ? 0 : '4px'};
      overflow-y: auto;
      overflow-x: hidden;
      display: grid;
      grid-template-columns: ${inDrawer ? 'repeat(2, 50%)' : 'repeat(3, 100px)'};
      grid-auto-rows: auto;
      grid-row-gap: 12px;
      grid-column-gap: 8px;
      // & .topicsLi:last-child {
      //   grid-column: ${inDrawer ? '1 / span 2' : '1 / span 3'};
      //   margin-top: 12px;
      //   & > a {
      //     height: unset;
      //     line-height: 0;
      //     background: unset;
      //     padding: unset;
      //     border-radius: unset;
      //     & > button {
      //       width: 100%;
      //       font-weight: 500;
      //       font-size: ${inDrawer ? '14px' : '18px'};
      //     }
      //   }
      // }
    `,
    topicsItem: css`
      display: block;
      width: 100%;
      height: 20px;
      line-height: 20px;
      background: rgba(37, 44, 52, 0.4);
      border-radius: 2px;
      font-size: 12px;
      text-align: center;
      color: #ffffff;
      padding: 0 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:hover {
        color: #ffffff;
        background: rgba(37, 44, 52, 0.6);
      }
    `,
    menuItem: css`
      width: ${inDrawer ? `100%` : '340px'};
      line-height: 0;
      display: flex;
      align-items: center;
      padding: ${inDrawer ? '9px 24px' : '11px 16px 11px 32px'};

      [dir='rtl'] & {
        padding: ${inDrawer ? '9px 24px' : '11px 32px 11px 16px'};
      }

      cursor: pointer;
      color: ${color.text};
      text-decoration: none !important;
      position: relative;
      &:hover {
        background: rgba(115, 126, 141, 0.08);
        color: ${color.text};
      }
      @keyframes move {
        0% {
          opacity: 1;
          right: 20px;
        }
        100% {
          right: 18px;
        }
      }

      @keyframes move-rtl {
        0% {
          opacity: 1;
          left: 20px;
        }
        100% {
          left: 18px;
        }
      }

      @keyframes changeColor {
        0% {
          fill: #737e8d;
        }
        100% {
          fill: #18bb97;
        }
      }
      & .arrow {
        visibility: hidden;
        position: absolute;
        opacity: 0;
        top: 50%;
        margin-top: -10px;
        right: 12px;
        transform: translateX(-10px);
        transition: all 0.2s ease;
      }
      &:hover .arrow {
        visibility: visible;
        transform: translateX(0);
        fill: ${color.icon};
        opacity: 0.4;
        [dir='rtl'] & {
          left: 0;
          right: unset;
          transform-origin: center center;
          transform: rotate(180deg);
        }
      }
      & .menuItemBox {
        flex: 1;
        display: flex;
        align-items: center;
        & .menuItemIcon {
          width: 8px;
          height: 8px;
          background: ${color.primary};
          transform: rotate(-45deg);
          margin-right: 16px;
          [dir='rtl'] & {
            margin-left: 16px;
            margin-right: unset;
          }
        }
        & .menuItemTitle {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          font-weight: ${inDrawer ? 400 : 500};
          font-size: ${inDrawer ? '14px' : '16px'};
          line-height: 26px;
          & .menuItemName {
            max-width: 176px;
          }
        }
      }
    `,
    moreDiv: styled.div`
      cursor: pointer;
      height: 100%;
      width: 70px;
      display: flex;
      align-items: center;
      padding-left: 20px;
      [dir='rtl'] & {
        padding-left: unset;
        padding-right: 20px;
      }
      & .moreIcon {
        color: ${color.text};
      }
      &:hover .moreIcon {
        color: ${color.primary};
      }
      & .arrowIcon {
        margin-left: 4px;
        margin-top: 1px;
        transition: all 0.3s ease;
      }
      [dir='rtl'] & .arrowIcon {
        margin-left: unset;
        margin-right: 4px;
        transform: rotate(0);
      }
      &:hover .arrowIcon {
        transform: rotate(-180deg);
      }
      & .expend {
        transform: rotate(180deg) !important;
        margin-top: 5px !important;
      }
    `,
    marquee: css`
      width: 160px;
      white-space: nowrap;
      overflow: hidden;
      box-sizing: border-box;
      @keyframes marquee {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(-100%, 0);
        }
      }

      @keyframes marquee-rtl {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(100%, 0);
        }
      }

      & p {
        display: inline-block;
        padding-left: 100%;
        animation: marquee 10s linear infinite;

        [dir='rtl'] & {
          padding-left: 0;
          padding-right: 100%;
          animation: marquee-rtl 10s linear infinite;
        }
      }
    `,
    accordion: css`
      .KuxAccordion-head {
        padding: 17.7px 12px;
        font-size: 16px;
        line-height: 130%;
        font-weight: 500;
        color: ${(props) => props.theme.colors.text};
        border-radius: 8px;
        &:hover {
          background: ${(props) => props.theme.colors.cover2};
        }
      }
      .KuxAccordion-panel {
        padding: 0;
      }
      .KuxAccordion-activeBg {
        left: 0;
        width: 0;
        background: transparent;
      }
    `,
    headerLogo: css`
      height: 28px;
      width: 122px;
      margin-right: 12px;
    `,
  };
};

export default function Nav(props = {}) {
  const { classifyList, topicList, crashCourseList } = useSelector((state) => state[namespace]);
  const { t } = useLang();

  const { customColors = {}, currentLang, inDrawer, hostConfig, closeDrawer = () => {} } = props;
  const { KUCOIN_HOST } = hostConfig || {};

  const theme = useTheme();
  const color = { ...theme.colors, ...customColors };
  const cls = useStyles({ color, inDrawer });

  const menuList = useMemo(() => {
    const list = classifyList.map(({ topicsEnglishName, name }) => {
      return {
        name,
        type: 'classify',
        menuUrl: addLangToPath(`${KUCOIN_HOST}/learn/${topicsEnglishName}`, currentLang),
      };
    });
    if (crashCourseList.length !== 0) {
      const courses = crashCourseList.map(({ topicsEnglishName, name }) => {
        return {
          name,
          type: 'courses',
          menuUrl: addLangToPath(
            `${KUCOIN_HOST}/learn/crash-courses/${topicsEnglishName}`,
            currentLang,
          ),
        };
      });
      list.push({
        name: t('jZTUCBeV41Rfz6T2D467F4'),
        type: 'courses',
        children: courses,
      });
    }
    if (topicList.length !== 0) {
      const topics = topicList.map(({ topicsEnglishName, name }) => {
        return {
          name,
          type: 'topics',
          menuUrl: addLangToPath(`${KUCOIN_HOST}/learn/topics/${topicsEnglishName}`, currentLang),
        };
      });
      list.push({
        name: t('p9gy6CeLcCWJP1RudLN1he'),
        type: 'topics',
        children: topics,
      });
    }
    // glossary
    list.push({
      name: t('6if5Yd7jjsbR9ZZyzGMdLQ'),
      type: 'glossary',
      menuUrl: `${KUCOIN_HOST}/learn/glossary`,
    });
    return list;
  }, [classifyList, topicList, crashCourseList, KUCOIN_HOST, t, currentLang]);

  // 一级类目
  const genLinkNav = (navItem) => {
    return (
      <Link
        key={navItem.type}
        href={navItem.menuUrl}
        lang={currentLang}
        css={cls.navItem}
        onClick={(e) => {
          kcsensorsClick(['LearnNavigation', '1'], { category: navItem.type });
          if (navItem.onClick) {
            navItem.onClick(e);
          }
          if (closeDrawer) {
            closeDrawer();
          }
        }}
        style={{ marginRight: '20px' }}
      >
        {navItem.name}
      </Link>
    );
  };

  // 一级类目有子菜单
  const genSingleDropDownNav = (navItem) => {
    const overlay = {
      courses: <CoursesExpend items={navItem.children} />,
      topics: <TopicsExpend items={navItem.children} />,
    };
    return (
      <Dropdown
        overlay={overlay[navItem.type]}
        onVisibleChange={(show) => {
          show && kcsensorsClick(['LearnNavigation', '1'], { category: navItem.type });
        }}
      >
        <div css={cls.navItem}>
          {navItem.name}
          <ICTriangleBottomOutlined size="12" className="arrowIcon" color={theme.colors.icon60} />
        </div>
      </Dropdown>
    );
  };

  // 一级类目有子菜单,提供给Drawer内部使用
  const genSingleCollapseNav = (navItem, index = 0) => {
    const _index = Number(index || 0) + 1;
    const overlay = {
      courses: <CoursesExpend items={navItem.children} />,
      topics: <TopicsExpend items={navItem.children} />,
    };
    return (
      <Panel header={navItem.name} key={_index}>
        {overlay[navItem.type]}
      </Panel>
    );
  };

  const CoursesExpend = ({ items }) => {
    return (
      <ul css={cls.overlayWrapper}>
        {map(items, (navItem, index) => {
          return (
            <li key={index}>
              <Link
                href={navItem.menuUrl}
                css={cls.menuItem}
                onClick={(e) => {
                  if (navItem.onClick) {
                    navItem.onClick(e);
                  }
                  if (closeDrawer) {
                    closeDrawer();
                  }
                }}
                lang={currentLang}
              >
                <div className="menuItemBox">
                  <div className="menuItemIcon" />
                  <div className="menuItemTitle">
                    <span className="menuItemName" style={{ maxWidth: 'unset' }}>
                      {navItem.name || ''}
                    </span>
                  </div>
                </div>
                <ICArrowRightOutlined width="20px" height="20px" className="arrow" />
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  const TopicsExpend = ({ items }) => {
    return (
      <ul css={cls.topicsUl}>
        {map(items, (navItem, index) => {
          return (
            <li key={index} className="topicsLi">
              <Link
                href={navItem.menuUrl}
                css={cls.topicsItem}
                onClick={(e) => {
                  navItem.type !== 'all' &&
                    kcsensorsClick(['topics', `${index + 1}`], { topics: navItem.name });
                  if (navItem.onClick) {
                    navItem.onClick(e);
                  }
                  if (closeDrawer) {
                    closeDrawer();
                  }
                }}
                lang={currentLang}
              >
                {navItem.name}
                {/* {navItem.type === 'all' ? (
                  <Button type="default" size={inDrawer ? 'small' : 'basic'}>
                    {navItem.name}
                  </Button>
                ) : (
                  navItem.name
                )} */}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  const MoreComponent = () => {
    return (
      <Dropdown
        overlay={
          <div css={cls.overlayWrapper}>
            <Link
              css={cls.menuItem}
              lang={currentLang}
              href={queryPersistence.formatUrlWithStore(`${KUCOIN_HOST}`, WITHOUT_QUERY_PARAM)}
              onClick={() => {
                kcsensorsClick(['Kucoin', '1']);
              }}
            >
              <div>
                <img src={logoSrc} css={cls.headerLogo} className="logo" alt="KuCoin" />
              </div>
              <ICArrowRightOutlined width="20px" height="20px" className="arrow" />
            </Link>
          </div>
        }
      >
        <cls.moreDiv>
          <ICMore2Outlined className="moreIcon" size="20" />
          <ICTriangleBottomOutlined size="12" className="arrowIcon" color={theme.colors.icon60} />
        </cls.moreDiv>
      </Dropdown>
    );
  };

  if (inDrawer) {
    return (
      <Accordion css={cls.accordion} bordered={false}>
        {map(menuList, (navItem, index) => {
          if (!navItem) return null;
          let comp;
          if (navItem.children) {
            comp = genSingleCollapseNav({ ...navItem }, index);
          } else {
            comp = genLinkNav({ ...navItem });
          }
          return comp;
        })}
      </Accordion>
    );
  }

  return (
    <div css={cls.nav}>
      {MoreComponent()}
      <nav>
        <ul className="navUl">
          {map(menuList, (navItem, i) => {
            if (!navItem) return null;
            let comp;
            if (navItem.children) {
              comp = genSingleDropDownNav({ ...navItem });
            } else {
              comp = genLinkNav({ ...navItem });
            }
            return <li key={`${navItem.type}_${i}`}>{comp}</li>;
          })}
        </ul>
      </nav>
    </div>
  );
}
