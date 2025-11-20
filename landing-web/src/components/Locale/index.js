/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 在服务端环境下，每个多语言实例在app.getInitialProps创建，
 * 如果子组件需要使用对应实例，需要使用withLocale提供的_t和_tHTML函数进行多语言处理
 * runtime: next/browser
 */
import React from 'react';
import PropTypes from 'prop-types';
import LocaleContext from './LocaleContext';
import { withLocale } from './withLocale';

class Locale extends React.Component {
  render() {
    return (
      <LocaleContext.Provider
        value={this.props.intl}
      >
        {this.props.children || null}
      </LocaleContext.Provider>
    );
  }
}

if (_DEV_) {
  Locale.propTypes = {
    intl: PropTypes.object.isRequired,
  };
}

export {
  Locale,
  withLocale,
};
