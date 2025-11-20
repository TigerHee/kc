/**
 * Owner: willen@kupotech.com
 */
import wsSubscribe, { privateSuffix } from 'hocs/wsSubscribe';
import React from 'react';
import { connect } from 'react-redux';

@wsSubscribe({
  getTopics: (Topic) => {
    return [[`${Topic.ACCOUNT_BALANCE}${privateSuffix}`], [`/margin/position${privateSuffix}`]];
  },
  didUpdate: () => {
    return false;
  },
})
@connect()
export default class UserPrivateWS extends React.Component {
  render() {
    return null;
  }
}
