/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * withLocale hoc
 * runtime: next/browser
 */
import React from 'react';
import LocaleContext from './LocaleContext';

const getPropsFromContext = (context) => {
  const { _t, _tHTML } = context;
  const props = {
    _t,
    _tHTML,
  };
  return props;
};

const withLocale = () => (Component) => {
  class WrappedComponent extends React.Component {
    render() {
      return (
        <LocaleContext.Consumer>
          {(context) => {
            if (_DEV_) {
              if (!context) {
                throw new Error('You should not use withLocale() outside a <Locale>');
              }
            }

            const props = getPropsFromContext(context);
            return (
              <Component {...props} {...this.props} />
            );
          }}
        </LocaleContext.Consumer>
      );
    }
  }
  WrappedComponent.displayName = `withLocale(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export {
  withLocale,
  getPropsFromContext,
};
