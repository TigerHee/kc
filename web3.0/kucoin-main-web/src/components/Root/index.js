/**
 * Owner: willen@kupotech.com
 */
/**
 * Root Component
 * runtime: next/browser
 */
import React from 'react';
import PropTypes from 'prop-types';
// import tdkManager from '@kc/tdk';
// import PublicNotice from './PublicNotice';
import AsyncPublicNotice from './AsyncPublicNotice';
import { connect } from 'react-redux';
import { withTheme } from '@kux/mui';

import { withRouter } from 'components/Router';
// import ConflictModalNOSSR from 'components/ConflictModal';
import AsyncConflictModal from 'components/ConflictModal/AsyncConflictModal';
// import LoanNoviceBenefitsNOSSR from 'components/LoanNoviceBenefits';
// import AsyncLoanNoviceBenefits from 'components/LoanNoviceBenefits/AsyncLoanNoviceBenefits';
// import LoginDrawer from 'routes/Ucenter/Login/LoginDrawer';
import AsyncLoginDrawer from 'routes/Ucenter/Login/LoginDrawer/AsyncLoginDrawer';
// import ForgetPwdDrawer from 'routes/Ucenter/ForgetPwd/ForgetPwdDrawer';
import AsyncForgetPwdDrawer from 'routes/Ucenter/ForgetPwd/AsyncForgetPwdDrawer';
import AnalyticsModule from 'hocs/analyticsModule';
import { injectLocale } from '@kucoin-base/i18n';
// import UserPrivateWSNoSSR from './UserPrivateWS';
import AsyncUserPrivateWS from './AsyncUserPrivateWS';
// import StatisticsNoSSR from '../common/Statistics';
// import AsyncStatistics from '../common/Statistics/AsyncStatistics';
import NewHeaderNoSSR from './NewHeader';
import LearnHeader from './LearnHeader';
import NewFooterNoSSR from './NewFooter';
// import AsyncNewFooter from './NewFooter/AsyncNewFooter';
// import ExchangeGuideNoSSR from './ExchangeGuide';
// import AsyncExchangeGuide from './ExchangeGuide/AsyncExchangeGuide';
import AsyncPublicNoticeDialog from './PublicNoticeDialog/AsyncPublicNoticeDialog';
// import SyncZendeskLang from './SyncZendeskLang';
import clsx from 'clsx';
import AsyncGlobalScope from './AsyncGlobalScope';
// 500U引导下载弹按钮：
import Download from './Download';
import { isArticlePage } from 'utils/seoTools';
import { tenantConfig } from 'config/tenant';
import { languages, SEO_META_CONFIG } from 'config/base';
import SEOmeta from 'components/Seo/SEOmeta';
import OgImage from 'components/Seo/OgImage';
import NoSSG from 'components/NoSSG';
import ADA from 'components/ADA';
import style from './style.less';
import { getPageId } from 'src/utils/ga';
import { getSceneDownloadLinks } from 'hooks/useCountryInfo';

const whitePath = ['/assets/payments'];
// 优化web移动端下载app弹窗-前端隐藏该弹窗及其展示逻辑（代码不要删） https://wiki.kupotech.com/pages/viewpage.action?pageId=104205501
// import DownloadGuide from './Download/DownloadGuide';

import DepositBanner from './DepositGuide/DepositBanner';

const LayoutType = {
  BOTH: 0, // 头部和底部都存在的布局
  ONLYHEAD: 1, // 没有底部，只有头部
  ONLYMAIN: 2, // 头部和底部都没有
};

@AnalyticsModule()
@connect((state) => {
  const { isUseNewIndex, countryInfo, illegalGpList } = state.app;
  const { traded } = state.user;
  return {
    isUseNewIndex,
    countryInfo,
    illegalGpList,
    ads: state.homepage.ads,
    isUserLogin: !!state.user.user,
    traded,
  };
})
@withTheme
@withRouter()
@injectLocale
class Root extends React.Component {
  static propTypes = {
    type: PropTypes.number,
  };

  static defaultProps = {
    type: LayoutType.BOTH,
  };

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
    } = this.props;
    const downloadAppUrlMap = getSceneDownloadLinks(countryInfo, illegalGpList);

    const header = <NewHeaderNoSSR pathname={pathname} />;
    const learnHeader = <LearnHeader pathname={pathname} />;
    // const footer = <AsyncNewFooter pathname={pathname} />;

    const body = (
      <React.Fragment>
        <div
          // className={`page-body ${style.body} ${
          //   type === LayoutType.ONLYMAIN ? style.onlymain : ''
          // }`}
          className={clsx('page-body', style.body, {
            [style.onlymain]: type === LayoutType.ONLYMAIN,
          })}
        >
          {children}
        </div>
        {isUserLogin && <AsyncUserPrivateWS />}
        <AsyncPublicNotice />
        <AsyncConflictModal />
        {/* <AsyncExchangeGuide /> */}
        {/* <AsyncStatistics pathname={pathname} /> */}
        <AsyncLoginDrawer />
        <AsyncForgetPwdDrawer />
        <AsyncPublicNoticeDialog />
        {/* <AsyncLoanNoviceBenefits /> */}
        <AsyncGlobalScope />
      </React.Fragment>
    );

    const isArticle = isArticlePage();
    return (
      <div
        className={clsx(
          'root',
          style.root,
          className,
          // {
          //   [style.whiteBg]: whitePath.includes(pathname),
          // },
          style[theme?.currentTheme || 'light'],
        )}
        data-path={pathname}
        data-theme={theme?.currentTheme}
      >
        <OgImage />
        <SEOmeta
          currentLang={currentLang}
          languages={languages}
          isArticle={isArticle}
          useAlterLang={!isArticle}
          pathname={pathname}
          queryConfig={SEO_META_CONFIG}
        />
        {/* 引导打开APP半弹窗按钮： */}
        {/* <DownloadGuide downloadAppUrl={downloadAppUrlMap.Guide} /> */}
        {/* // header */}
        {(type === LayoutType.BOTH || type === LayoutType.ONLYHEAD) && header}
        {type === LayoutType.LEARNHEAD && learnHeader}
        {/* 立即为您的账户入金，入金后即可购买任意加密货币 banner */}
        {tenantConfig.common.showDepositBanner && <DepositBanner pathname={pathname} />}

        {/* // body */}
        {(type === LayoutType.BOTH ||
          type === LayoutType.ONLYHEAD ||
          type === LayoutType.ONLYMAIN ||
          type === LayoutType.LEARNHEAD) &&
          body}

        {/* // footer */}
        {(type === LayoutType.BOTH || type === LayoutType.LEARNHEAD) &&
          tenantConfig.common.showFooter && <NewFooterNoSSR pathname={pathname} />}

        {/* 下载弹窗，下载中间页 */}
        {/* 500U引导下载弹按钮 */}
        <Download
          pathname={pathname}
          currentLang={currentLang}
          pageId={getPageId()}
          downloadAppUrl={downloadAppUrlMap.Modal}
        />
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
