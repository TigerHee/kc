/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { LocaleContext } from 'components/App';

// const DEFAULT_LANG = { currentLang: '' };
const withLocale = () => (Component) => {
  class WrappedComponent extends React.Component {
    render() {
      return (
        <LocaleContext.Consumer>
          {value => <Component {...this.props} lang={value} />}
        </LocaleContext.Consumer>
      );
    }
  }
  WrappedComponent.displayName = `withLocale(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default withLocale;
