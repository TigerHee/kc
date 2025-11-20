/**
 * Owner: willen@kupotech.com
 */
import wsSubscribe, { privateSuffix } from 'hocs/wsSubscribe';
import React from 'react';
import { connect } from 'react-redux';

@wsSubscribe({
  getTopics: (Topic) => {
    return [
      [`/account/snapshotBalanceFrequency500${privateSuffix}`],
      [`${Topic.NOTICE_CENTER}${privateSuffix}`],
      [`/margin/position${privateSuffix}`],
    ];
  },
  didUpdate: () => {
    return false;
  },
})
@connect()
export default class UserPrivateWS extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'notice_event/fetch' });
  }

  render() {
    return null;
  }
}
