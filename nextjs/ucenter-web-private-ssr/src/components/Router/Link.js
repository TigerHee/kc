/**
 * Owner: willen@kupotech.com
 */
import { omit } from 'lodash-es';
import React from 'react';
import { addLangToPath } from 'tools/i18n';
import { getCurrentLang, getBasenameFromLang } from 'kc-next/i18n';
import { getUtmLink } from 'utils/getUtm';

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
    window.location.href = this.getHrefProps();
    // push(this.getHrefProps());
  };

  // seoShow: 前端路由在界面展示带语言子路径，利于seo
  getHrefProps = (seoShow = false) => {
    const currentLang = getCurrentLang();
    const localBase = getBasenameFromLang(currentLang);
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
    const { children, href, to, onClick, ...otherProps } = this.props;
    const _href = this.getHrefProps(true);
    return (
      <a
        href={_href}
        onClick={this.handleClick}
        {...omit(otherProps, ['active', 'dontGoWithHref'])}
      >
        {children}
      </a>
    );
  }
}

export default Link;
