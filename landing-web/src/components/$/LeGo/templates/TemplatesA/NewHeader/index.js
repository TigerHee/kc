/**
 * Owner: melon@kupotech.com
 */
/**
 * @description 使用场景是乐高1.0 Header 使用场景
 */
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import JsBridge from 'utils/jsBridge';
import LangSelector from 'components/Header/LangSelector';
import { getHomeUrl } from 'components/$/MarketCommon/config';
import { KUCOIN_HOST } from 'utils/siteConfig';
import { addLangToPath } from 'utils/lang';
import { useSelector } from 'hooks';
import { useDispatch } from 'dva';
import { searchToJson } from 'helper';
import { kucoinStorage } from 'utils/storage';
import { getLocalBase } from 'config';
import { styled } from '@kufox/mui/emotion';

import keysEquality from 'utils/tools/keysEquality';
import { get, filter, some, isEmpty, includes } from 'lodash';
import { useLocation } from 'react-router-dom';
import styles from './style.less';
import SiteRedirect from 'src/components/common/SiteRedirect';

const _isInApp = JsBridge.isApp();

const NewHeaderContent = styled.div`
  width: 100%;
  background-color: ${({ headerTheme }) => (headerTheme === 'dark' ? ' #0e1018' : '#fff')};
  .ant-dropdown-trigger {
    color: ${({ headerTheme }) => (headerTheme === 'dark' ? '#fff' : '#000')};
  }
  .ant-dropdown-menu {
    background-color: ${({ headerTheme }) => (headerTheme === 'dark' ? '#161c2f' : 'rgb(255, 255, 255)')};
    .ant-dropdown-menu-item {
      color: ${({ headerTheme }) => (headerTheme === 'dark' ? '#fff' : '#000')};
      &:hover {
        color: ${({ headerTheme }) => (headerTheme === 'dark' ? 'rgba(0, 208, 182, 1)' : '#000')};
        background-color: ${({ headerTheme }) => (headerTheme === 'dark' ? '#13192c' : 'rgba(0, 13, 29, 0.04)')};
        > a {
          color: ${({ headerTheme }) => (headerTheme === 'dark' ? 'rgba(0, 208, 182, 1)' : '#000')};
          color: rgba(0, 208, 182, 1);
        }
      }
      > a {
        color: ${({ headerTheme }) => (headerTheme === 'dark' ? ' #fff' : '#000')};
        text-decoration: none;
      }
    }
  }
`;

const Index = ({ headerTheme = 'dark' }) => {
  const dispatch = useDispatch();
  const { config } = useSelector((state) => state.lego, keysEquality(['config']));
  const { isInApp, currentLang } = useSelector(
    (state) => state.app,
    keysEquality(['isInApp', 'currentLang']),
  );
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user?.user, 'ignore');
  // 获取当前顶飘是否展示的状态
  // const isShowRestrictNotice = useSelector(
  //   (s) => s['$header_header']?.isShowRestrictNotice,
  //   'ignore',
  // );
  // 获取顶飘高度（做布局偏移可能需要）
  // const restrictNoticeHeight = useSelector(
  //   (s) => s['$header_header']?.restrictNoticeHeight,
  //   'ignore',
  // );
  const { channelCode = '', legoNameEn = '', legoCode = '' } = config;
  // admin配置的支持语言
  const supportLangs = useMemo(() => {
    return [get(config, 'standardLang'), ...(get(config, 'langs') || [])].filter((i) => !!i);
  }, [config]);
  // 语言下拉框，只显示admin配置的语言
  const filterLangsFn = useCallback(
    (langs) => {
      if (!supportLangs.length) return langs;
      return filter(langs, (lang) =>
        some(supportLangs, (supportLang) => supportLang === lang?.key),
      );
    },
    [supportLangs],
  );
  // 语言统一， 用户当前语言currentLang 不在supportLangs 中，则重置用户语言为standardLang
  useEffect(() => {
    const langInStore = kucoinStorage.getItem('lang');
    const langInQuery = searchToJson()?.lang;
    const { isExist: langInPath } = getLocalBase();
    const userLang = (user && user.language) || langInStore || langInPath || langInQuery;

    const isLoad = !isEmpty(supportLangs) && (userLang || currentLang);
    const standardLang = supportLangs[0];
    // landing当前语言不支持活动配置的所有语言，则更新landing语言为活动standardLang
    const isNotExist = !includes(supportLangs, userLang) || !includes(supportLangs, currentLang);
    if (isLoad) {
      const lang = isNotExist ? standardLang : userLang || currentLang;
      dispatch({
        type: 'app/selectLang',
        payload: {
          lang: lang !== currentLang ? lang : currentLang,
          donotChangeUser: true,
        },
      });
    }
  }, [currentLang, supportLangs, dispatch, user]);

  const [RestrictNotice, updateRestrictNoticeComponent] =  useState(null);
  useEffect(() => {
    // app不需要显示合规顶飘
    if (_isInApp) return;
    setTimeout(() => {
      System.import('@remote/header').then(module => {
        const comp = module?.RestrictNotice;
        if (comp) updateRestrictNoticeComponent(() => comp);
      });
    }, 3000);
  }, []);

  return (
    <div className={styles?.newHeader}>
      {RestrictNotice ? <RestrictNotice
        userInfo={user}
        pathname={pathname}
        currentLang={currentLang}
      /> : null}
      {isInApp ? null : (
        <NewHeaderContent headerTheme={headerTheme}>
          <div className={styles.bannerTop}>
            <a
              href={addLangToPath(`${KUCOIN_HOST}`)}
              onClick={(e) => {
                e.preventDefault();
                window.open(getHomeUrl(channelCode));
              }}
              rel="noopener noreferrer"
            >
              <img className={styles.logoImg} src={window._BRAND_LOGO_} alt="logo" />
            </a>
            <LangSelector filterLangsFn={filterLangsFn} />
          </div>
        </NewHeaderContent>
      )}
      <SiteRedirect />
    </div>
  );
};

export default Index;
