/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import { SnackbarContext } from 'context/index';

export default () => (WrappedComponent) => {
  // eslint-disable-next-line react/prefer-stateless-function
  class Wrapper extends React.Component {
    render() {
      return (
        <SnackbarContext.Consumer>
          {(context) => {
            if (!context) {
              throw new Error('You should not use withSnackbar outside a <SnackbarContext>');
            }
            return <WrappedComponent {...this.props} {...context} />;
          }}
        </SnackbarContext.Consumer>
      );
    }
  }
  Wrapper.displayName = 'withSnackbar';
  return Wrapper;
};
