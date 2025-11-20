/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { fromJS, is } from 'immutable';
export default class PureWrap extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !is(fromJS(this.props.compare), fromJS(nextProps.compare));
  }

  render() {
    return this.props.children;
  }
}
