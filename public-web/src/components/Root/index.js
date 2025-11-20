/**
 * Owner: willen@kupotech.com
 */
/**
 * Root Component
 * runtime: next/browser
 */
import { injectLocale } from '@kucoin-base/i18n';
import loadable from '@loadable/component';
import clsx from 'clsx';
import ConflictModalNOSSR from 'components/ConflictModal';
import { withRouter } from 'components/Router';
import Toast from 'components/Toast';
import { languages, SEOMetaQueryConfig } from 'config/base';
import { tenantConfig } from 'config/tenant';
import AnalyticsModule from 'hocs/analyticsModule';
import { getSceneDownloadLinks } from 'hooks/useCountryInfo';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import LoginDrawer from 'routes/Ucenter/Login/LoginDrawer';
import { isArticlePage } from 'utils/seoTools';
import NewFooterNoSSR from './NewFooter';
import NewHeaderNoSSR from './NewHeader';
import PublicNotice from './PublicNotice';
import PublicNoticeDialog from './PublicNoticeDialog';
import { withBlackList } from './strategies';
import SyncZendeskLang from './SyncZendeskLang';

// import storage from 'utils/storage';
import sensors from '@kucoin-base/sensors';
import ADA from 'components/ADA';
import NoSSG from 'components/NoSSG';
import OgImage from 'components/Seo/OgImage';
import SEOmeta from 'components/Seo/SEOmeta';
import { exposeContext } from 'utils/ga';
import DynamicDepositBanner from './DepositGuide/DynamicDepositBanner';
import { DynamicDownloadBanner as DownloadBanner } from './Download/CombineDownload';
import DynamicCombineDownload from './Download/DynamicCombineDownload';
import style from './style.less';
const DynamicUserPrivateWS = loadable(() => import('./DynamicUserPrivateWS'));

// 神策曝光IntersectionObserver实例
const ExposeProvider = exposeContext.Provider;

const LayoutType = {
  BOTH: 0, // 头部和底部都存在的布局
  ONLYHEAD: 1, // 没有底部，只有头部
  ONLYMAIN: 2, // 头部和底部都没有
};

@AnalyticsModule()
@connect((state) => {
  const { isUseNewIndex, countryInfo, illegalGpList } = state.app;
  const { traded } = state.user;
  const { currentTheme } = state.setting;
  return {
    isUseNewIndex,
    isUserLogin: !!state.user.user,
    traded,
    countryInfo,
    illegalGpList,
    currentTheme,
  };
})
@withRouter()
@injectLocale
@withBlackList
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
      traded,
      countryInfo,
      illegalGpList,
      headerInBlackList,
      footerInBlackList,
      currentTheme,
    } = this.props;

    const header = (
      <NewHeaderNoSSR
        pathname={pathname}
        key={`${currentLang}_header`}
        // /* 新版本APP评分下载按钮： banner */
        topInsertRender={
          tenantConfig.showDownloadBanner
            ? () => {
                return (
                  <DownloadBanner
                    pathname={pathname}
                    traded={traded}
                    currentLang={currentLang}
                    downloadAppUrl={downloadAppUrlMap.Banner}
                  />
                );
              }
            : undefined
        }
      />
    );

    const body = (
      <React.Fragment>
        <div className={`${style.body} ${type === LayoutType.ONLYMAIN ? style.onlymain : ''}`}>
          {children}
        </div>
        {isUserLogin && <DynamicUserPrivateWS />}
        <PublicNotice />
        <NoSSG>
          <ConflictModalNOSSR />
        </NoSSG>
        <NoSSG>
          <LoginDrawer />
        </NoSSG>
        <SyncZendeskLang />
        <PublicNoticeDialog />
      </React.Fragment>
    );

    const isArticle = isArticlePage();
    const downloadAppUrlMap = getSceneDownloadLinks(countryInfo, illegalGpList);

    return (
      <div
        className={clsx('root', style.root, className, {
          [style.blackRoot]: currentTheme === 'dark',
          [style.kcsRoot]:  pathname === '/kcs',
        })}
        data-path={pathname}
        data-theme={theme}
      >
        <OgImage />
        <SEOmeta
          currentLang={currentLang}
          languages={languages}
          isArticle={isArticle}
          useAlterLang={!isArticle}
          pathname={window.location.pathname}
          queryConfig={SEOMetaQueryConfig}
        />
        {/* // header */}
        {(type === LayoutType.BOTH || type === LayoutType.ONLYHEAD) && !headerInBlackList && header}
        {tenantConfig.showDepositBanner && <DynamicDepositBanner pathname={pathname} />}
        {/* // body */}
        <ExposeProvider value={{ instance: sensors.observeExpose() }}>
          {body}
        </ExposeProvider>
        {/* // footer */}
        {type === LayoutType.BOTH && !footerInBlackList && (
          <NewFooterNoSSR pathname={pathname} key={`${currentLang}_footer`} />
        )}
        <Toast />
        {tenantConfig.showCombineDownload && (
          <DynamicCombineDownload
            pathname={pathname}
            currentLang={currentLang}
            traded={traded}
            downloadAppUrlMap={downloadAppUrlMap}
          />
        )}
        {/* Ada服务入口 */}
        <NoSSG>
          <ADA />
        </NoSSG>
      </div>
    );
  }
}

Root.LayoutType = LayoutType;

export default Root;
