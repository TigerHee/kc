/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'dva';
import { Icon } from 'antd';
import { ThemeProvider } from '@kufox/mui';
import { setOnCache } from 'utils/pullCache';
import { withRouter } from 'components/Router';
import AbsoluteLoading from 'components/AbsoluteLoading';
import Head from 'components/$/Spotlight5/Head';
import Panel from 'components/$/Spotlight5/Panel';
import TicketInfo from 'components/$/Spotlight5/TicketInfo';
import ProjectCondition from 'components/$/Spotlight5/ProjectCondition';
import ProjectIntroduction from 'components/$/Spotlight5/ProjectIntroduction';
import Blocked from 'components/$/Spotlight5/Blocked';
import CountryCheck from 'components/$/Spotlight5/ProjectCondition/conditions/CountryCheck';
import KCHeader from 'components/Header/KCHeader';
import KCFooter from 'components/Footer/KCFooter';
import HeadH5 from 'components/$/Spotlight5_H5/Head';
import PanelH5 from 'components/$/Spotlight5_H5/Panel';
import ProjectConditionH5 from 'components/$/Spotlight5_H5/ProjectCondition';
import TicketInfoH5 from 'components/$/Spotlight5_H5/TicketInfo';
import AppUpdateDialog from 'components/common/AppUpdateDialog';
import { useIsMobile } from 'components/Responsive';
import requireProps from 'hocs/requireProps';
import JsBridge from 'utils/jsBridge';
import { _t } from 'utils/lang';
import { px2rem, getHrefValue } from 'helper';
import { MAIN_HOST } from 'utils/siteConfig';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import styles from './style.less';

const fileIconStyle = {
  width: px2rem(11),
  height: px2rem(14),
  marginRight: px2rem(8),
};

const arrowIconStyle = {
  width: px2rem(13),
  height: px2rem(12),
};

@withRouter()
@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    rule: state.spotlight5.rule,
    qualification: state.spotlight5.qualification,
    isInApp: state.app.isInApp,
  };
})
class Spotlight2 extends React.Component {
  componentDidMount() {
    const { dispatch, isLogin, item } = this.props;

    dispatch({
      type: 'spotlight5/pullRule@polling',
      payload: {
        id: item.code,
      },
    });

    if (isLogin) {
      dispatch({
        type: 'spotlight5/getQualification',
        payload: {
          id: item.code,
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isLogin && !prevProps.isLogin) {
      const { dispatch, item } = this.props;
      dispatch({
        type: 'spotlight5/getQualification',
        payload: {
          id: item.code,
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'spotlight5/pullRule@polling:cancel' });
    // dispatch({ type: 'spotlight5/reset' });

    setOnCache(false);
  }

  handleClick = (evt) => {
    evt.preventDefault();
    const { isInApp, item } = this.props;
    let url = '';
    if (item.project_introduction) {
      url = getHrefValue(item.project_introduction);
    }
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${url}`,
        },
      });
      return;
    }
    window.open(url, '_blank');
  };

  render() {
    const { item, rule, qualification, isMobile, id } = this.props;
    // 仅针对这次前端做一些固定的更改
    const isNewSpotlight8 = id > 119;
    // 修改为都使用后台配置的值
    // if(isNewSpotlight8 && rule && rule.currency) {
    //   rule.currency = 'HOTCROSS';
    // }
    if (!rule) {
      return null;
    }

    if (rule.isBlocked) {
      return <Blocked />;
    }

    // spotlight7 中签阶段
    const isNewSpotlight7 = id > 104;

    // spotlight7复用6的逻辑
    // spotlight6
    const isNewSpotlight6 = isNewSpotlight7 || id > 112;

    if (isMobile) {
      return (
        <React.Fragment>
          <HeadH5 showRecords={false} isNewSpotlight8={isNewSpotlight8} />
          <React.Fragment>
            <PanelH5
              item={item}
              rule={rule}
              qualification={qualification}
              isNewSpotlight6={isNewSpotlight6}
              isNewSpotlight8={isNewSpotlight8}
            />
            {!isNewSpotlight8 && (
              <TicketInfoH5
                item={item}
                rule={rule}
                qualification={qualification}
                isNewSpotlight6={isNewSpotlight6}
                isNewSpotlight7={isNewSpotlight7}
              />
            )}
            <ProjectConditionH5
              item={item}
              rule={rule}
              qualification={qualification}
              isNewSpotlight6={isNewSpotlight6}
            />
            {isNewSpotlight6 && (
              <a href="#rule" onClick={this.handleClick} className={styles.h5SaleRule}>
                <div>
                  <Icon type="file-text" style={fileIconStyle} />
                  {_t('spotlight.h5.sale.rule')}
                </div>
                <Icon type="double-right" style={arrowIconStyle} />
              </a>
            )}
            {/* // H5上注释掉了introduction富文本，使用如上外链介绍规则 */}
            {/* {item.project_introduction && (
                <ProjectIntroduction_H5 content={item.project_introduction} />
              )} */}
          </React.Fragment>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Head showRecords={false} isNewSpotlight8={isNewSpotlight8} />
        <React.Fragment>
          <Panel
            item={item}
            rule={rule}
            qualification={qualification}
            isNewSpotlight6={isNewSpotlight6}
            isNewSpotlight8={isNewSpotlight8}
          />
          {!isNewSpotlight8 && (
            <TicketInfo
              item={item}
              rule={rule}
              qualification={qualification}
              isNewSpotlight6={isNewSpotlight6}
              isNewSpotlight7={isNewSpotlight7}
            />
          )}
          <ProjectCondition
            item={item}
            rule={rule}
            qualification={qualification}
            isNewSpotlight6={isNewSpotlight6}
          />
          {item.project_introduction && <ProjectIntroduction content={item.project_introduction} />}
          {/* {isNewSpotlight6 && (
            <div className={styles.countryListCheck}>
              <CountryCheck
                rule={rule}
                isNewSpotlight6={isNewSpotlight6}
              >
                {() => (
                  <a>{_t('spotlight.buy.statement')} <Icon type="double-right" /></a>
                )}
              </CountryCheck>
            </div>
          )} */}
        </React.Fragment>
      </React.Fragment>
    );
  }
}

@connect((state) => {
  const { pageData } = state.activity;
  return {
    pageData,
  };
})
class Index extends React.Component {
  componentDidMount() {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'activity/filter',
      payload: {
        id,
      },
    });
  }

  // componentWillUnmount() {
  //   const {
  //     dispatch,
  //     id,
  //   } = this.props;

  //   dispatch({
  //     type: 'activity/reset',
  //   });
  // }

  render() {
    const { pageData, isMobile, id } = this.props;
    if (!pageData) {
      return <AbsoluteLoading />;
    }

    if (!pageData.activity) return null;

    const { activity } = pageData;
    const item = activity[0];

    return <Spotlight2 id={id} isMobile={isMobile} item={item} />;
  }
}

const IndexPage = (props) => {
  const isMobile = useIsMobile();
  const isInApp = useSelector((state) => state.app.isInApp);
  const dispatch = useDispatch();

  const { match: { params: { id } } = {} } = props;

  useEffect(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          visible: true,
          statusBarTransparent: false,
          statusBarIsLightMode: true,
          leftVisible: true,
          leadIcon:
            'data:image/png;base64,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',
          rightVisible: true,
        },
      });
      JsBridge.open({
        type: 'event',
        params: {
          name: 'onPageMount',
        },
      });
      window.onListenEvent('onLogin', () => {
        dispatch({ type: 'app/init' });
      });
      window.onListenEvent('onRightClick', () => {
        JsBridge.open({
          type: 'func',
          params: {
            name: 'share',
            category: 'link',
            linkUrl: `${MAIN_HOST}/activity/${id}`,
            content: `New Token Sale on ${window._BRAND_NAME_} Spotlight `,
          },
        });
        return true;
      });
    }
  }, [dispatch, isInApp, id]);

  return (
    <ThemeProvider>
      <AppUpdateDialog />
      {isInApp || isMobile ? (
        <div className={styles.activityPageWrapperH5}>
          <div className={styles.activityPageContentH5}>
            <Index id={id} isMobile={isMobile} />
          </div>
        </div>
      ) : (
        <React.Fragment>
          <KCHeader theme="dark" />
          <div className={styles.activityPageWrapper}>
            <div className={styles.activityPageContent}>
              <Index id={id} isMobile={isMobile} />
            </div>
          </div>
          <KCFooter />
        </React.Fragment>
      )}
    </ThemeProvider>
  );
};

const Page = connect((state) => {
  return {
    appReady: state.app.appReady,
    currentLang: state.app.currentLang,
  };
})(
  requireProps({
    appReady(v) {
      return v;
    },
    currentLang(v) {
      return v !== null;
    },
  })(IndexPage),
);

export default brandCheckHoc(Page, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute))
