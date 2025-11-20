/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback } from 'react';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import pathToRegexp from 'path-to-regexp';
import { addLangToPath, removeLangQuery } from '../../common/tools';
import { WITHOUT_QUERY_PARAM } from '../../LearnHeader/config';

export default ({ href, children, onClick, lang, routeTo = true, ...rests }) => {
  const _href =
    typeof href === 'string'
      ? queryPersistence.formatUrlWithStore(href, WITHOUT_QUERY_PARAM)
      : href;

  const getUrlWithLangPath = useCallback(() => addLangToPath(_href, lang), [lang, _href]);

  const pushLink = useCallback(
    (e) => {
      e.preventDefault();
      const { pushTo } = window;
      onClick && onClick(e);
      if (!routeTo) {
        return;
      }
      if (pushTo && typeof pushTo === 'function') {
        const url = _href;
        // 如果是不同子域或不同域的，直接location
        if (!_href.includes(window.location.origin)) {
          const newWindow = window.open(getUrlWithLangPath(_href), '_blank');
          if (newWindow) newWindow.opener = null;
          return;
        }
        // 如果项目没有该变量，可在相应的项目中自定义该变量
        const routerBase = (window.routerBase || '').replace(/\/$/, '');
        const curRoutes = window.__KC_CRTS__ || [];
        // 确保new URL 不会报错
        if (_href.match(/^http?/) || _href.startsWith('/')) {
          const _url = new URL(_href.match(/^http?/) ? _href : `${window.location.origin}${_href}`);
          const iscurrent = curRoutes
            .map((r) => {
              return pathToRegexp(routerBase + r.path, []);
            })
            .some((r) => r.test(_url.pathname));

          if (iscurrent && url) {
            const targetPath = url
              .replace(window.location.origin + routerBase, '/')
              .replace('//', '/');
            // 去掉语言子lang参数：
            const newUrl = removeLangQuery(targetPath);
            pushTo(newUrl);
            return;
          }
        }
      }
      if (_href) {
        window.location.href = getUrlWithLangPath(_href);
      }
    },
    [_href],
  );

  return (
    <a href={getUrlWithLangPath()} {...rests} onClick={_href ? pushLink : onClick}>
      {children}
    </a>
  );
};
