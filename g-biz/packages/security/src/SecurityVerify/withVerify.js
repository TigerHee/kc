/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import securityVerify from './securityVerify';

export default (WrappedComponent) => {
  @connect()
  class CompoenntWithVerify extends React.Component {
    securityVerify = (...rest) => {
      const { dispatch } = this.props;
      const verifyFunc = securityVerify(dispatch);
      verifyFunc(...rest);
    };

    render() {
      return <WrappedComponent {...this.props} securityVerify={this.securityVerify} />;
    }
  }

  return CompoenntWithVerify;
};
