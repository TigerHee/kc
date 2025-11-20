/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { styled, withTheme } from '@kux/mui';
import clsx from 'clsx';
import ADA from 'components/ADA';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import ConflictModalNOSSR from 'components/ConflictModal';
import NoSSG from 'components/NoSSG';
import RootEmotionCacheProvider from 'components/Root/RootEmotionCacheProvider';
import { withRouter } from 'components/Router';
import OgImage from 'components/Seo/OgImage';
import SEOmeta from 'components/Seo/SEOmeta';
import Toast from 'components/Toast';
import { languages } from 'config/base';
import { tenantConfig } from 'config/tenant';
import AnalyticsModule from 'hocs/analyticsModule';
import { getSceneDownloadLinks } from 'hooks/useCountryInfo';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import LoginDrawer from 'routes/Ucenter/Login/LoginDrawer';
import { canUseLangLink } from 'utils/seoTools';
import { DynamicDownloadBanner as DownloadBanner } from './Download/CombineDownload';
import DynamicUserPrivateWS from './DynamicUserPrivateWS';
import NewFooterNoSSR from './NewFooter';
import NewHeaderNoSSR from './NewHeader';
import PublicNotice from './PublicNotice';
import { BodyContainer, onlyMain } from './styled';

const RootBox = styled.div`
  .gbiz-headeroom {
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  }
`;

const pathsLight = ['/']; // 浅色header的路由

const LayoutType = {
  BOTH: 0, // 头部和底部都存在的布局
  ONLYHEAD: 1, // 没有底部，只有头部
  ONLYMAIN: 2, // 头部和底部都没有
};

@AnalyticsModule()
@withTheme
@connect((state) => {
  const { isUseNewIndex, countryInfo, illegalGpList } = state.app;
  return {
    isUseNewIndex,
    isUserLogin: !!state.user.user,
    countryInfo,
    illegalGpList,
  };
})
@withRouter()
@injectLocale
class Root extends React.Component {
  static propTypes = {
    type: PropTypes.number,
  };

  static defaultProps = {
    type: LayoutType.BOTH,
  };

  // eslint-disable-next-line react/no-deprecated
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.currentLang !== this.props.currentLang) {
      this._initGbizLang(nextProps.currentLang);
    }
  }

  render() {
    const {
      type,
      theme,
      children,
      className = '',
      pathname,
      isUserLogin,
      currentLang,
      countryInfo,
      illegalGpList,
    } = this.props;
    const isLight = pathsLight.indexOf(pathname) > -1;

    const header = (
      <ErrorBoundary scene={SCENE_MAP.root.header}>
        <NewHeaderNoSSR
          pathname={pathname}
          isLight={isLight}
          key={`${currentLang}_header`}
          // /* 新版本APP评分下载按钮： banner */
          topInsertRender={() => {
            return (
              <NoSSG>
                <DownloadBanner
                  theme={theme.currentTheme}
                  pathname={pathname}
                  downloadAppUrl={downloadAppUrlMap.Banner}
                />
              </NoSSG>
            );
          }}
        />
      </ErrorBoundary>
    );

    const body = (
      <ErrorBoundary scene={SCENE_MAP.root.body}>
        <React.Fragment>
          <BodyContainer css={LayoutType.ONLYMAIN === type ? onlyMain(theme) : {}}>
            {children}
          </BodyContainer>
          {isUserLogin && <DynamicUserPrivateWS />}
          <PublicNotice />
          <NoSSG>
            <ConflictModalNOSSR />
          </NoSSG>
          <NoSSG>
            <LoginDrawer />
          </NoSSG>
        </React.Fragment>
      </ErrorBoundary>
    );

    const useAlterLang = canUseLangLink();
    const downloadAppUrlMap = getSceneDownloadLinks(countryInfo, illegalGpList);

    return (
      <RootBox
        className={clsx('root', className)}
        style={{ background: theme.colors.overlay }}
        data-path={pathname}
        data-theme={theme.currentTheme}
      >
        <RootEmotionCacheProvider>
          <OgImage />
          <SEOmeta
            currentLang={currentLang}
            languages={languages}
            isArticle={false}
            useAlterLang={useAlterLang}
          />
          {/* // header */}
          {(type === LayoutType.BOTH || type === LayoutType.ONLYHEAD) && header}

          {/* // body */}
          {(type === LayoutType.BOTH ||
            type === LayoutType.ONLYHEAD ||
            type === LayoutType.ONLYMAIN) &&
            body}

          {/* // footer */}
          {type === LayoutType.BOTH && tenantConfig.common.showFooter && (
            <ErrorBoundary scene={SCENE_MAP.root.footer}>
              <NewFooterNoSSR pathname={pathname} key={`${currentLang}_footer`} />
            </ErrorBoundary>
          )}
          <Toast />
          {/*<DynamicCombineDownload pathname={pathname} downloadAppUrlMap={downloadAppUrlMap} />*/}
          {/* Ada服务入口 */}
          <NoSSG>
            <ADA />
          </NoSSG>
        </RootEmotionCacheProvider>
      </RootBox>
    );
  }
}

Root.LayoutType = LayoutType;

export default Root;
