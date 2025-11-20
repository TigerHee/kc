/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { setOnCache } from 'utils/pullCache';
import { withRouter } from 'components/Router';
import siteConfig from 'utils/siteConfig';
import { addLangToPath } from 'tools/i18n';

const { LANDING_HOST } = siteConfig;

@withRouter()
@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    rule: state.spotlight5.rule,
    qualification: state.spotlight5.qualification,
  };
})
export default class Spotlight2 extends React.Component {
  componentDidMount() {
    const { id } = this.props;
    // 申购迁移到了landing-web，此处做跳转

    window.location.href = addLangToPath(`${LANDING_HOST}/spotlight_r5/${id}`);
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
    dispatch({ type: 'spotlight5/reset' });

    setOnCache(false);
  }

  render() {
    return null;
  }
}
