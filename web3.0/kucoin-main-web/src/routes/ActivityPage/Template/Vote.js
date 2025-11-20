/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import CommonTitle from '../module/CommonTitle';
import Rules from '../module/Rules';
import VoteList from '../module/Vote';
import UserAssets from '../module/Vote/UserAssets';
import CountDownBox from '../module/Vote/CountDownBox';

@connect((state) => {
  return {
    activityData: state.activity.vote,
  };
})
export default class Vote extends React.Component {
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch, item } = this.props;
    const { code, type } = item;
    dispatch({
      type: 'activity/pullVote',
      payload: {
        code,
        type,
      },
    });
  };

  render() {
    const { activityData, item } = this.props;
    if (!activityData) {
      return null;
    }
    const { campaignResponse, voteListResponses } = activityData;
    return (
      <React.Fragment>
        <CommonTitle
          title={item.page_title}
          status={campaignResponse.status}
          startTime={campaignResponse.startTIme}
          endTime={campaignResponse.endTime}
        />
        <Rules rule={item.activity_rule} />
        <CountDownBox campaignResponse={campaignResponse} />
        <UserAssets status={campaignResponse.status} />
        <VoteList
          item={item}
          campaignResponse={campaignResponse}
          voteListResponses={voteListResponses}
        />
      </React.Fragment>
    );
  }
}
