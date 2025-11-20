/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { setOnCache } from 'utils/pullCache';

import siteConfig from 'utils/siteConfig';
import { addLangToPath } from 'tools/i18n';

const { LANDING_HOST } = siteConfig;

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    rule: state.spotlight.rule,
    qualification: state.spotlight.qualification,
  };
})
export default class Spotlight extends React.Component {
  state = {
    showRecords: false,
  };

  componentDidMount() {
    const {
      // dispatch, isLogin, item,
      id,
    } = this.props;
    // 抢购迁移到了landing-web，此处做跳转

    window.location.href = addLangToPath(`${LANDING_HOST}/spotlight/${id}`);
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
    dispatch({ type: 'spotlight/reset' });

    setOnCache(false);
  }

  handleSetShowRecords = () => {
    this.setState({ showRecords: true });
  };

  handleSetHideRecords = () => {
    this.setState({ showRecords: false });
  };

  render() {
    // 第一期的抢购，迁移到了landing-web，因此这个组件只做跳转
    return null;

    // const { item, rule, qualification } = this.props;
    // if (!rule) {
    //   return null;
    // }

    // const { showRecords } = this.state;
    // return (
    //   <React.Fragment>
    //     <Head
    //       showRecords={showRecords}
    //       handleSetShowRecords={this.handleSetShowRecords}
    //       handleSetHideRecords={this.handleSetHideRecords}
    //     />
    //     {showRecords ? (
    //       <React.Fragment>
    //         <Records item={item} />
    //       </React.Fragment>
    //     ) : (
    //       <React.Fragment>
    //         <Panel item={item} rule={rule} qualification={qualification} />
    //         <ProjectCondition item={item} rule={rule} qualification={qualification} />
    //         {item.project_introduction && (
    //           <ProjectIntroduction content={item.project_introduction} />
    //         )}
    //       </React.Fragment>
    //     )}
    //   </React.Fragment>
    // );
  }
}
