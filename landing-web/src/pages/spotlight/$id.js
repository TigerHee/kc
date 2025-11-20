/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from '@kufox/mui';
import { Icon } from 'antd';
import { useSelector, useDispatch } from 'dva';
import AbsoluteLoading from 'components/AbsoluteLoading';
import Head from 'components/$/Spotlight/Head';
import Panel from 'components/$/Spotlight/Panel';
import ProjectCondition from 'components/$/Spotlight/ProjectCondition';
import ProjectIntroduction from 'components/$/Spotlight/ProjectIntroduction';
import Records from 'components/$/Spotlight/Records';
import KCHeader from 'components/Header/KCHeader';
import KCFooter from 'components/Footer/KCFooter';
import Head_H5 from 'components/$/Spotlight_H5/Head';
import Panel_H5 from 'components/$/Spotlight_H5/Panel';
import ProjectCondition_H5 from 'components/$/Spotlight_H5/ProjectCondition';
import ProjectIntroduction_H5 from 'components/$/Spotlight_H5/ProjectIntroduction';
import Records_H5 from 'components/$/Spotlight_H5/Records';
import requireProps from 'hocs/requireProps';
import { useIsMobile } from 'components/Responsive';
import ModalForbid from 'components/common/Tips/modalForbid';
import { MAINSITE_HOST } from 'utils/siteConfig';
import { _t } from 'utils/lang';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { px2rem } from 'helper';
import JsBridge from 'utils/jsBridge';
import AppUpdateDialog from 'components/common/AppUpdateDialog';
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

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    rule: state.spotlight.rule,
    qualification: state.spotlight.qualification,
    isInApp: state.app.isInApp,
  };
})
class Spotlight extends React.Component {
  state = {
    showRecords: false,
  };

  componentDidMount() {
    const { dispatch, isLogin, item } = this.props;
    dispatch({
      type: 'spotlight/pullRule@polling',
      payload: {
        id: item.code,
      },
    });

    if (isLogin) {
      dispatch({
        type: 'spotlight/getQualification',
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
        type: 'spotlight/getQualification',
        payload: {
          id: item.code,
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'spotlight/pullRule@polling:cancel' });
    // dispatch({ type: 'spotlight/reset' });
  }

  handleSetShowRecords = () => {
    this.setState({ showRecords: true });
  };

  handleSetHideRecords = () => {
    this.setState({ showRecords: false });
  };

  handleClick = (evt) => {
    evt.preventDefault();
    const { isInApp } = this.props;
    const url = `${MAINSITE_HOST}/announcement/en-bitbns-token-sale-on-spotlight`;
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
    if (!rule) {
      return null;
    }

    // spotlight7 抢购阶段
    const isNewSpotlight7 = id > 104;

    const { showRecords } = this.state;
    if (isMobile) {
      return (
        <React.Fragment>
          <Head_H5
            showRecords={showRecords}
            handleSetShowRecords={this.handleSetShowRecords}
            handleSetHideRecords={this.handleSetHideRecords}
          />
          {showRecords ? (
            <React.Fragment>
              <Records_H5 item={item} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Panel_H5
                item={item}
                rule={rule}
                qualification={qualification}
                isNewSpotlight7={isNewSpotlight7}
              />
              <ProjectCondition_H5
                item={item}
                rule={rule}
                qualification={qualification}
                isNewSpotlight7={isNewSpotlight7}
              />
              {isNewSpotlight7 && (
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
          )}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Head
          showRecords={showRecords}
          handleSetShowRecords={this.handleSetShowRecords}
          handleSetHideRecords={this.handleSetHideRecords}
        />
        {showRecords ? (
          <React.Fragment>
            <Records item={item} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Panel
              item={item}
              rule={rule}
              qualification={qualification}
              isNewSpotlight7={isNewSpotlight7}
            />
            <ProjectCondition
              item={item}
              rule={rule}
              qualification={qualification}
              isNewSpotlight7={isNewSpotlight7}
            />
            {item.project_introduction && (
              <ProjectIntroduction content={item.project_introduction} />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

@connect((state) => {
  const { pageData } = state.activity;
  const { isSub = false } = state.user.user || {};
  return {
    pageData,
    isSub,
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
    const { pageData, isMobile, id, isSub = false } = this.props;
    if (isSub) {
      return <ModalForbid />;
    }

    if (!pageData) {
      return <AbsoluteLoading />;
    }

    if (!pageData.activity) return null;

    const { activity } = pageData;
    const item = activity[0];

    return <Spotlight id={id} isMobile={isMobile} item={item} />;
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
          name: 'onPageMount',
        },
      });
      window.onListenEvent('onLogin', () => {
        dispatch({ type: 'app/init' });
      });
    }
  }, [dispatch, isInApp]);

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
