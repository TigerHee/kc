/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import CommonTitle from '../module/CommonTitle';
import Rules from '../module/Rules';
import Gift from '../module/Gift';
import Award from '../module/Award';
import AirdropUSDT from './AirdropUSDT';

@connect((state) => {
  return {
    activityData: state.activity.universal,
  };
})
export default class Universal extends React.Component {
  componentDidMount() {
    const { dispatch, item } = this.props;
    const { code, type } = item;
    dispatch({
      type: 'activity/pullUniversal',
      payload: {
        code,
        type,
      },
    });
  }

  render() {
    const { activityData, item } = this.props;
    if (!activityData) {
      return null;
    }
    if ([282, 243].indexOf(item.activity_id) >= 0) {
      return (
        <React.Fragment>
          <CommonTitle
            title={item.page_title}
            status={activityData.status}
            startTime={activityData.startTIme}
            endTime={activityData.endTime}
          />
          <AirdropUSDT {...this.props} style={{ marginTop: '35px' }} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <CommonTitle
          title={item.page_title}
          status={activityData.status}
          startTime={activityData.startTIme}
          endTime={activityData.endTime}
        />
        <Rules rule={item.activity_rule} />
        <Gift rewardRule={item.reward_rule} />
        <Award item={item} activityData={activityData} />
      </React.Fragment>
    );
  }
}
