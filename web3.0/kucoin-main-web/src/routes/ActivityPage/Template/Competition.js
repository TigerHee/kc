/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import CommonTitle from '../module/CommonTitle';
import Rules from '../module/Rules';
import Condition from '../module/Condition';
import CompetRewardTable from '../module/Table/CompetRewardTable';
import CompetRankTable from '../module/Table/CompetRankTable';

@connect((state) => {
  return {
    activityData: state.activity.competition,
  };
})
export default class Competition extends React.Component {
  componentDidMount() {
    const { dispatch, item } = this.props;
    const { code, type } = item;
    dispatch({
      type: 'activity/pullCompetiton',
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
    const { campaignResponse, competitionAwardResponses } = activityData;
    return (
      <React.Fragment>
        <CommonTitle
          title={item.page_title}
          status={campaignResponse.status}
          startTime={campaignResponse.startTIme}
          endTime={campaignResponse.endTime}
        />
        <Rules rule={item.activity_rule} />
        <Condition
          item={item}
          activityData={activityData || {}}
          startTime={campaignResponse.startTIme}
        />
        <CompetRewardTable data={competitionAwardResponses} />
        <CompetRankTable item={item} activityData={activityData} />
      </React.Fragment>
    );
  }
}
