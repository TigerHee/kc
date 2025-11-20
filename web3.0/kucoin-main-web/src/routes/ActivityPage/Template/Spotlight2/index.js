/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { setOnCache } from 'utils/pullCache';
import Head from './Head';
import Panel from './Panel';
import TicketInfo from './TicketInfo';
import ProjectCondition from './ProjectCondition';
import ProjectIntroduction from './ProjectIntroduction';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    rule: state.spotlight2.rule,
    qualification: state.spotlight2.qualification,
  };
})
export default class Spotlight2 extends React.Component {
  componentDidMount() {
    const { dispatch, isLogin, item } = this.props;
    dispatch({
      type: 'spotlight2/pullRule@polling',
      payload: {
        id: item.code,
      },
    });

    if (isLogin) {
      dispatch({
        type: 'spotlight2/getQualification',
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
        type: 'spotlight2/getQualification',
        payload: {
          id: item.code,
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'spotlight2/pullRule@polling:cancel' });
    dispatch({ type: 'spotlight2/reset' });

    setOnCache(false);
  }

  render() {
    const { item, rule, qualification } = this.props;
    if (!rule) {
      return null;
    }

    return (
      <React.Fragment>
        <Head showRecords={false} />
        <React.Fragment>
          <Panel item={item} rule={rule} qualification={qualification} />
          <TicketInfo item={item} rule={rule} qualification={qualification} />
          <ProjectCondition item={item} rule={rule} qualification={qualification} />
          {item.project_introduction && <ProjectIntroduction content={item.project_introduction} />}
        </React.Fragment>
      </React.Fragment>
    );
  }
}
