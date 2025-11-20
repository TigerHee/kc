/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { UserRestricted } from 'packages/userRestrictedCommon';
import loadable from '@loadable/component';
import Header from './Header';
import { useHeaderStore, HeaderStoreProvider, getLangInfo, getNavigationList } from './model';
import { getTenantConfig, useTenantConfig } from '../tenantConfig';
import { getCurrentLang } from 'kc-next/i18n';
import HeaderProvider from './HeaderProvider';
import SiteRedirect from 'packages/siteRedirect';
import PageProvider, { usePageProps } from 'provider/PageProvider';
import useExternalSync from './useExternalSync';
import { HeaderProps } from './types';
import { FuturesProvider } from 'packages/trade/futures';
import HeaderErrorBoundary from './HeaderErrorBoundary';

const HeaderCL = loadable(() => import('./HeaderCL'));

const InnerHeader = React.memo((props: HeaderProps) => {
  // 如果有站点定向弹窗，则不展示其它弹窗
  const [siteRedirectDialogOpen, setSiteRedirectDialogOpen] = useState(false);
  const updateHeader = useHeaderStore(store => store.updateHeader);
  const tenantConfig = useTenantConfig();
  useExternalSync('$header_header', props.dva);

  const initData = () => {
    getServerSideProps().then(initProps => updateHeader?.(initProps));
  };

  const pageProps = usePageProps();
  // 获取主工程主题
  const mainTheme = pageProps?.mainTheme || pageProps?.theme || 'light';
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mainTheme);
  }, [mainTheme]);

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    updateHeader?.({
      userInfo: props.userInfo,
      currency: props.currency,
      inviter: props.inviter,
      onHeaderHeightChange: props.onHeaderHeightChange,
    });
  }, [props.userInfo, props.currency, props.inviter, props.onHeaderHeightChange]);

  return (
    <FuturesProvider>
      {/*  保留 ThemeProvider 允许外部设置不同的主题类型 */}
      <HeaderProvider>
        {/* 如果是 claim 站点，使用专用 header */}
        {tenantConfig.useHeaderCL ? (
          <HeaderCL {...props} />
        ) : (
          <>
            <Header {...props} />
            {tenantConfig.showSiteRedirectDialog ? (
              <SiteRedirect
                theme={props.theme}
                onOpen={() => {
                  setSiteRedirectDialogOpen(true);
                }}
              />
            ) : null}
            {!siteRedirectDialogOpen ? (
              <UserRestricted
                userInfo={props.userInfo}
                pathname={props.pathname}
                theme={props.theme}
                userRestrictedStayDuration={props.userRestrictedStayDuration}
                onShow={obj => updateHeader?.({ restrictDialogStatus: obj })}
                onHide={obj => updateHeader?.({ restrictDialogStatus: obj })}
              />
            ) : null}
          </>
        )}
      </HeaderProvider>
    </FuturesProvider>
  );
});

const HeaderComponent = (props: HeaderProps) => {
  return (
    <HeaderErrorBoundary>
      <HeaderStoreProvider>
        <PageProvider value={props}>
          <InnerHeader {...props} />
        </PageProvider>
      </HeaderStoreProvider>
    </HeaderErrorBoundary>
  );
};

export default React.memo(HeaderComponent);

export const getServerSideProps = async () => {
  try {
    const [langInfo, webNavigation] = await Promise.all([
      // 默认请求非子账号菜单
      getLangInfo(),
      getTenantConfig().useHeaderCL
        ? undefined
        : getNavigationList({ userType: 'ONLY_PARENT_USER', lang: getCurrentLang() }),
    ]);
    if (!webNavigation) {
      return langInfo;
    }
    return {
      ...langInfo,
      webNavigation,
    };
  } catch (e) {
    console.error('gbiz-next header getServerSideProps failed:', e);
  }
};
