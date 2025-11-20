/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { push } from 'utils/router';
import { getUtmLink } from 'utils/getUtm';
import { getLocaleBasename, addLangToPath } from 'tools/i18n';

const localBase = getLocaleBasename();
class Link extends React.PureComponent {
  handleClick = (e) => {
    e.preventDefault();

    const { onClick, checkAuth, redirect = true } = this.props;
    if (typeof onClick === 'function') {
      onClick(e);
      if (!redirect) return;
    }
    if (typeof checkAuth === 'function' && !checkAuth()) {
      return;
    }
    const _href = this.getHrefProps();
    if (_href) push(_href);
  };

  // seoShow: 前端路由在界面展示带语言子路径，利于seo
  getHrefProps = (seoShow = false) => {
    const { href, to } = this.props;
    const linkUrl = href || to;
    if (typeof linkUrl === 'string' && linkUrl.indexOf('http') === 0) {
      const utmLink = getUtmLink(linkUrl);
      if (seoShow) {
        return addLangToPath(utmLink);
      }
      return utmLink;
    }
    if (seoShow && typeof linkUrl === 'string' && linkUrl.startsWith('/') && localBase) {
      let urlWithLang = addLangToPath(linkUrl);
      if (urlWithLang.endsWith('/')) {
        urlWithLang = urlWithLang.substring(0, urlWithLang.length - 1);
      }
      return urlWithLang;
    }
    return linkUrl;
  };

  render() {
    const { children, href, to, onClick, checkAuth, redirect, ...otherProps } = this.props; // eslint-disable-line no-unused-vars
    const _href = this.getHrefProps(true);
    if (_href) {
      otherProps.href = _href;
    }
    return (
      <a onClick={this.handleClick} {...otherProps}>
        {children}
      </a>
    );
  }
}

export default Link;
