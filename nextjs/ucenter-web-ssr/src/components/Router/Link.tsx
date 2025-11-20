/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import { useRouter } from 'kc-next/compat/router';
import { getCurrentLocale, getDefaultLocale } from 'kc-next/i18n';
import { addLangToPath } from '@/tools/i18n';
import { getUtmLink } from '@/utils/getUtm';

interface LinkProps {
  children: React.ReactNode;
  href?: string;
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  dontGoWithHref?: boolean;
  active?: boolean;
  [key: string]: any;
}

const Link: React.FC<LinkProps> = ({ children, href, to, onClick, dontGoWithHref = false, ...otherProps }) => {
  const router = useRouter();

  // seoShow: 前端路由在界面展示带语言子路径，利于seo
  const getHrefProps = (seoShow = false) => {
    const linkUrl = href || to;
    if (typeof linkUrl === 'string' && linkUrl.indexOf('http') === 0) {
      const utmLink = getUtmLink(linkUrl);
      return addLangToPath(utmLink);
    }
    if (seoShow && typeof linkUrl === 'string' && linkUrl.startsWith('/')) {
      const locale = getCurrentLocale();
      const defaultLocale = getDefaultLocale();
      const localBase = locale !== defaultLocale ? locale : '';
      if (localBase) {
        let urlWithLang = `/${localBase}${linkUrl}`;
        if (urlWithLang.endsWith('/')) {
          urlWithLang = urlWithLang.substring(0, urlWithLang.length - 1);
        }
        return urlWithLang;
      }
    }
    return linkUrl;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (typeof onClick === 'function') {
      onClick(e);
    }
    if (dontGoWithHref) {
      // 完全由onClick事件中处理，不需要push路由
      return;
    }
    const hrefProps = getHrefProps();
    if (hrefProps) {
      router?.push(hrefProps);
    }
  };

  const _href = getHrefProps(true);

  return (
    <a
      href={_href}
      onClick={handleClick}
      {..._.omit(otherProps, ['active', 'dontGoWithHref'])}
    >
      {children}
    </a>
  );
};

export default Link;
