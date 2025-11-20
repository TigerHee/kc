/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { setOnCache } from 'utils/pullCache';
import Head from './Head';
import Panel from './Panel';
import ProjectIntroduction from './ProjectIntroduction';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    rule: state.distribute.rule,
    qualification: state.distribute.qualification,
  };
})
export default class Distribute extends React.Component {
  state = {
    showRecords: false,
  };

  componentDidMount() {
    const { dispatch, isLogin, item } = this.props;
    dispatch({
      type: 'distribute/pullRule@polling',
      payload: {
        id: item.code,
      },
    });

    if (isLogin) {
      dispatch({
        type: 'distribute/getQualification',
        payload: {
          id: item.code,
        },
      });
    }
  }

  // componentDidUpdate(prevProps) {}

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'distribute/pullRule@polling:cancel' });
    dispatch({ type: 'distribute/reset' });

    setOnCache(false);
  }

  render() {
    const { item, rule, qualification } = this.props;
    if (!rule) {
      return null;
    }

    // const { showRecords } = this.state;
    return (
      <React.Fragment>
        <Head item={item} />
        <React.Fragment>
          <Panel item={item} rule={rule} qualification={qualification} />
          {item.project_introduction && <ProjectIntroduction content={item.project_introduction} />}
        </React.Fragment>
      </React.Fragment>
    );
  }
}
