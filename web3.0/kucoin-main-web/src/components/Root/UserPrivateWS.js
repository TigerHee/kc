/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import wsSubscribe, { privateSuffix } from 'hocs/wsSubscribe';

@wsSubscribe({
  getTopics: (Topic) => {
    return [
      [`${Topic.ACCOUNT_BALANCE}${privateSuffix}`],
      [`${Topic.NOTICE_CENTER}${privateSuffix}`],
      [`/margin/position${privateSuffix}`],
      // [`/contractAccount/wallet${privateSuffix}`],
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
