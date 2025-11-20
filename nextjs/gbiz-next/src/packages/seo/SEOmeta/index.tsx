/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import pathToRegexp from 'path-to-regexp';
import qs from 'query-string';
import { bootConfig, getHref, getOrigin } from 'kc-next/boot';
import { getAllLocaleMap } from 'kc-next/i18n';
import Url from 'url-parse';
import { getTenantConfig } from 'packages/seo/tenantConfig';
import SSRHelmet from '../SSRHelmet';

const ISOStandard = {
  fil_PH: 'tl',
};

const disabledLangs = ['de_DE', 'it_IT', 'pl_PL', 'nl_NL', 'ko_KR'];

const getLanguages = (languages: string[]) => {
  return languages.filter(lang => !disabledLangs.includes(lang));
};

interface QueryConfigItem {
  route: string | RegExp;
  query?: Record<string, string[]>;
}

interface SEOmetaProps {
  currentLang: string;
  languages: string[];
  isArticle?: boolean;
  useAlterLang?: boolean;
  pathname?: string;
  queryConfig?: QueryConfigItem[] | null;
  ssr?: boolean;
}

const SEOmeta: React.FC<SEOmetaProps> = ({
  currentLang,
  languages: allLanguages,
  isArticle = false,
  useAlterLang = true,
  pathname = '',
  queryConfig,
  ssr = true,
}) => {
  const { _DEFAULT_LOCALE_, _DEFAULT_LANG_ } = bootConfig;
  const href = getHref();
  const urlObj = new Url(href);
  const languages = getLanguages(allLanguages);

  const getUrl = useCallback((): string => {
    let _href = `${urlObj.origin}${urlObj.pathname}`;
    const urlSearch = urlObj.query;

    const queryParam = urlSearch ? qs.parse(urlSearch, { decode: false }) : null;

    if (queryConfig?.length && queryParam) {
      let query: Record<string, any> | null = null;

      queryConfig.find(item => {
        let routeReg = item.route;
        if (!(routeReg instanceof RegExp) && typeof routeReg === 'string') {
          routeReg = pathToRegexp(routeReg);
        }

        if (routeReg.test(pathname)) {
          if (item.query) {
            Object.entries(item.query).forEach(([key, val]) => {
              // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
              const currentVal = queryParam[key];
              if (currentVal) {
                if (val.length === 0 || val.includes(String(currentVal))) {
                  if (!query) query = {};
                  // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
                  query[key] = currentVal;
                }
              }
            });
          }
          return true;
        }
        return false;
      });

      if (query) {
        const search = qs.stringify(query);
        _href = `${_href}?${search}`;
      }
    }

    return _href;
  }, [queryConfig, pathname]);

  const getPathByLang = useCallback(lang => {
    const localeMap = getAllLocaleMap();
    return localeMap[lang] || _DEFAULT_LOCALE_;
  }, []);

  const getHrefLangByLang = useCallback(lang => {
    const localeMap = getAllLocaleMap();
    return ISOStandard[lang] || localeMap[lang] || _DEFAULT_LOCALE_;
  }, []);

  const getHrefLang = useCallback(
    (lang: string): string => {
      // EU/AU会返回类似这种en-au结果
      const defaultHrefLang = getHrefLangByLang(lang);
      // EU/AU站会跳过这里，它们_DEFAULT_LOCALE_为空
      // TH/TR会走这里，拼接成tr-en这种
      if (
        // 不要locale, 为了给TH/TR配置
        !getTenantConfig(bootConfig._BRAND_SITE_).hreflangNoLocale &&
        bootConfig._DEFAULT_LOCALE_ &&
        bootConfig._DEFAULT_LOCALE_ !== 'en'
      ) {
        return `${defaultHrefLang}-${bootConfig._DEFAULT_LOCALE_}`;
      }
      return defaultHrefLang;
    },
    [getHrefLangByLang]
  );

  const changeLangPath = useCallback(
    (lang: string): string => {
      const langPath = getPathByLang(lang);
      const localeMap = getAllLocaleMap();
      const localBase = localeMap[currentLang] || '';
      const href = getUrl();
      const origin = getOrigin();

      let alternated = `${origin}/${localBase || ''}`;
      if (localBase && href.includes(`${origin}/${localBase}/`)) {
        alternated = `${origin}/${localBase}/`;
      }

      let url = href.replace(alternated, `${origin}/${langPath === (_DEFAULT_LOCALE_ || 'en') ? '' : `${langPath}/`}`);

      if (url.endsWith('/')) {
        url = url.slice(0, -1);
      }

      return url;
    },
    [getPathByLang, currentLang, getUrl]
  );

  const renderLangLink = useCallback(() => {
    const localeMap = getAllLocaleMap();
    if (!languages || !localeMap) return null;

    const doms: React.ReactElement[] = [];
    let _href = getUrl();

    if (useAlterLang) {
      languages.forEach(lang => {
        if (lang !== currentLang) {
          const hrefLang = changeLangPath(lang);
          doms.push(<link rel="alternate" href={hrefLang} hrefLang={getHrefLang(lang)} key={lang} />);
        }
      });

      if (_href.endsWith('/')) {
        _href = _href.slice(0, -1);
      }

      doms.push(<link rel="alternate" href={_href} hrefLang={getHrefLang(currentLang)} key={currentLang} />);

      const defaultUrl = changeLangPath(_DEFAULT_LANG_ || 'en_US');
      doms.push(<link rel="alternate" href={defaultUrl} hrefLang="x-default" key="x-default" />);
    }

    doms.push(<meta property="og:url" content={_href} key="og:url" />);
    doms.push(<link rel="canonical" href={_href} key="canonical" />);
    return doms;
  }, [languages, getUrl, changeLangPath, getHrefLang, currentLang, useAlterLang]);

  return (
    <SSRHelmet ssr={ssr}>
      <meta property="og:type" content={isArticle ? 'article' : 'website'} />
      {languages.map(lang =>
        lang === currentLang ? (
          <meta property="og:locale" content={currentLang} key={lang} />
        ) : useAlterLang ? (
          <meta property="og:locale:alternate" content={lang} key={lang} />
        ) : null
      )}
      {renderLangLink()}
    </SSRHelmet>
  );
};

export default SEOmeta;
