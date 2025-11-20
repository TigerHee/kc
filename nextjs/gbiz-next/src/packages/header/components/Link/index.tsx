/**
 * Owner: iron@kupotech.com
 */
import React, { FC, useCallback, useMemo } from 'react';
import { queryPersistence } from 'tools/base/QueryPersistence';
import { WITHOUT_QUERY_PARAM } from '../../Header/config';
import addLangToPath from 'tools/addLangToPath'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  lang?: string;
  routeTo?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Link: FC<LinkProps> = ({ href, children, onClick, lang, routeTo = true, ...rests }) => {
  const _href = typeof href === 'string' ? queryPersistence.formatUrlWithStore(href, WITHOUT_QUERY_PARAM) : href;

  const isTrWebsiteUrl = useMemo(() => _href?.includes('kucoin.tr'), [_href]);

  const getUrlWithLangPath = useCallback(() => {
    return addLangToPath(_href);
  }, [lang, _href]);

  const pushLink = useCallback(
    e => {
      e.preventDefault();
      try {
        onClick && onClick(e);
      } catch (error) {
        console.log('error === ', error);
      }
      if (!routeTo) {
        return;
      }
       // 如果是不同子域或不同域的，直接location
       if (_href && !_href.includes(window.location.origin)) {
        const newWindow = window.open(getUrlWithLangPath(), '_blank');
        if (newWindow) newWindow.opener = null;
        return;
      }
      if (_href) {
        window.location.href = getUrlWithLangPath();
      }
    },
    [_href, getUrlWithLangPath, onClick, routeTo]
  );

  return isTrWebsiteUrl ? (
    <a href={_href} {...rests}>
      {children}
    </a>
  ) : (
    <a href={getUrlWithLangPath()} onClick={_href ? pushLink : onClick} {...rests}>
      {children}
    </a>
  );
};

export default Link;
