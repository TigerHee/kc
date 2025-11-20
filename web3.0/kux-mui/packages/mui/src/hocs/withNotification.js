/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import { NotificationContext } from 'context/index';

export default () => (WrappedComponent) => {
  // eslint-disable-next-line react/prefer-stateless-function
  class Wrapper extends React.Component {
    render() {
      return (
        <NotificationContext.Consumer>
          {(context) => {
            if (!context) {
              throw new Error('You should not use withSnackbar outside a <NotificationContext>');
            }
            return <WrappedComponent {...this.props} notification={context} />;
          }}
        </NotificationContext.Consumer>
      );
    }
  }
  Wrapper.displayName = 'withNotification';
  return Wrapper;
};
