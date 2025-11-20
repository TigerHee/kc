/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import { addLangToPath, getLocaleBasename } from 'tools/i18n';
import { getUtmLink } from 'utils/getUtm';
import { push } from 'utils/router';
const localBase = getLocaleBasename();
class Link extends React.PureComponent {
  handleClick = (e) => {
    e.preventDefault();

    const { onClick, dontGoWithHref = false } = this.props;
    if (typeof onClick === 'function') {
      onClick(e);
    }
    if (dontGoWithHref) {
      // 完全由onClick事件中处理，不需要push路由
      return;
    }
    push(this.getHrefProps());
  };

  // seoShow: 前端路由在界面展示带语言子路径，利于seo
  getHrefProps = (seoShow = false) => {
    const { href, to } = this.props;
    const linkUrl = href || to;
    if (typeof linkUrl === 'string' && linkUrl.indexOf('http') === 0) {
      const utmLink = getUtmLink(linkUrl);
      return addLangToPath(utmLink);
    }
    if (seoShow && typeof linkUrl === 'string' && linkUrl.startsWith('/') && localBase) {
      let urlWithLang = `/${localBase}${linkUrl}`;
      if (urlWithLang.endsWith('/')) {
        urlWithLang = urlWithLang.substring(0, urlWithLang.length - 1);
      }
      return urlWithLang;
    }
    return linkUrl;
  };

  render() {
    const { children, href, to, onClick, ...otherProps } = this.props; // eslint-disable-line no-unused-vars
    const _href = this.getHrefProps(true);
    return (
      <a
        href={_href}
        onClick={this.handleClick}
        {..._.omit(otherProps, ['active', 'dontGoWithHref'])}
      >
        {children}
      </a>
    );
  }
}

export default Link;
