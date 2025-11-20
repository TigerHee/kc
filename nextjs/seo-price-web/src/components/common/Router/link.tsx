import { omit } from "lodash-es";
import React from "react";
import { addLangToPath } from "@/tools/i18n";
import { getCurrentBaseName } from "kc-next/i18n";
import { getUtmLink } from '@/tools/getUtm';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to?: string;
  dontGoWithHref?: boolean;
};

class Link extends React.PureComponent<LinkProps> {
  handleClick = (e) => {
    e.preventDefault();

    const { onClick, dontGoWithHref = false } = this.props;
    if (typeof onClick === "function") {
      onClick(e);
    }
    if (dontGoWithHref) {
      // 完全由onClick事件中处理，不需要push路由
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = this.getHrefProps();
    }
  };

  // seoShow: 前端路由在界面展示带语言子路径，利于seo
  getHrefProps = (seoShow = false) => {
    const localBase = getCurrentBaseName();
    const { href, to } = this.props;
    const linkUrl = href || to;
    if (typeof linkUrl === "string" && linkUrl.indexOf("http") === 0) {
      const utmLink = getUtmLink(linkUrl);
      return addLangToPath(utmLink);
    }
    if (
      seoShow &&
      typeof linkUrl === "string" &&
      linkUrl.startsWith("/") &&
      localBase
    ) {
      let urlWithLang = `${linkUrl}`;
      if (urlWithLang.endsWith("/")) {
        urlWithLang = urlWithLang.substring(0, urlWithLang.length - 1);
      }

      urlWithLang = addLangToPath(urlWithLang);
      return urlWithLang;
    }

    return addLangToPath(linkUrl);
  };

  render() {
    const { children, href, to, onClick, ...otherProps } = this.props;
    const _href = this.getHrefProps(true);


    return (
      <a
        href={_href}
        onClick={this.handleClick}
        {...omit(otherProps, ["active", "dontGoWithHref"])}
      >
        {children}
      </a>
    );
  }
}

export default Link;
