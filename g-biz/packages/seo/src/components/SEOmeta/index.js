/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import pathToRegexp from 'path-to-regexp';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { tenantConfig } from '../../tenantConfig';

const localeMap = window.__KC_LANGUAGES_BASE_MAP__.langToBase;

const ISOStandard = {
  'fil_PH': 'tl',
};

const disabledLangs = ['de_DE', 'it_IT', 'pl_PL', 'nl_NL', 'ko_KR'];

const getLanguages = (languages) => {
  return languages.filter((lang) => !disabledLangs.includes(lang));
};

const SEOmeta = (props) => {
  const {
    currentLang,
    languages: allLanguages,
    isArticle = false,
    useAlterLang = true,
    pathname = '',
    queryConfig,
  } = props;

  const languages = getLanguages(allLanguages);
  const getPathByLang = useCallback((lang) => {
    return localeMap[lang] || window._DEFAULT_LOCALE_;
  }, []);

  const getHrefLangByLang = useCallback((lang) => {
    return ISOStandard[lang] || localeMap[lang] || window._DEFAULT_LOCALE_;
  }, []);

  const changeLangPath = useCallback(
    (lang) => {
      const langPath = getPathByLang(lang);
      const localBase = localeMap[currentLang] || '';
      const { origin } = window.location;
      const href = getUrl();
      let alternated = `${origin}/${localBase || ''}`;
      if (localBase && href.indexOf(`${origin}/${localBase}/`) !== -1) {
        alternated = `${origin}/${localBase}/`;
      }
      let url = href.replace(
        alternated,
        `${origin}/${langPath === window._DEFAULT_LOCALE_ ? '' : `${langPath}/`}`,
      );
      if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
      }
      return url;
    },
    [getPathByLang, currentLang, getUrl],
  );

  const getUrl = useCallback(() => {
    let _href = `${window.location.origin}${window.location.pathname}`;
    const urlSearch = window.location.search;
    let queryParam;
    if (urlSearch) {
      queryParam = qs.parse(urlSearch, { decode: false });
    }
    if (queryConfig && queryConfig.length && queryParam) {
      let query = null;
      queryConfig.find((item) => {
        if (item && item.route) {
          let routeReg = item.route;
          if (!(routeReg instanceof RegExp) && typeof routeReg === 'string') {
            routeReg = pathToRegexp(routeReg);
          }
          if (routeReg.test(pathname)) {
            if (item.query) {
              Object.entries(item.query).forEach(([key, val]) => {
                if (key in queryParam) {
                  const currentVal = queryParam[key];
                  if (val && Array.isArray(val)) {
                    if (val.length) {
                      if (val && val.includes(currentVal)) {
                        if (!query) {
                          query = {};
                        }
                        query[key] = queryParam[key];
                      }
                    } else {
                      if (!query) {
                        query = {};
                      }
                      query[key] = queryParam[key];
                    }
                  }
                }
              });
            }
            return true;
          }
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

  // 获取不同站点的hreflang
  const getHrefLang = useCallback(
    (lang) => {
      // EU/AU会返回类似这种en-au结果
      const defaultHrefLang = getHrefLangByLang(lang);

      // EU/AU站会跳过这里，它们_DEFAULT_LOCALE_为空
      // TH/TR会走这里，拼接成tr-en这种
      if (
        // 不要locale, 为了给TH/TR配置
        !tenantConfig.hreflangNoLocale &&
        window._DEFAULT_LOCALE_ &&
        window._DEFAULT_LOCALE_ !== 'en'
      ) {
        return `${defaultHrefLang}-${window._DEFAULT_LOCALE_}`;
      }
      return defaultHrefLang;
    },
    [getHrefLangByLang],
  );

  const renderLangLink = useCallback(() => {
    if (!languages || !localeMap) {
      return null;
    }
    const doms = [];
    let _href = getUrl();
    if (useAlterLang) {
      languages.forEach((lang) => {
        if (currentLang !== lang) {
          const hrefLang = changeLangPath(lang);
          // eslint-disable-next-line react/no-unknown-property
          doms.push(
            <link rel="alternate" href={hrefLang} hrefLang={getHrefLang(lang)} key={lang} />,
          );
        }
      });
      if (_href && _href.endsWith('/')) {
        _href = _href.substring(0, _href.length - 1);
      }
      // eslint-disable-next-line react/no-unknown-property
      doms.push(
        <link rel="alternate" href={_href} hrefLang={getHrefLang(currentLang)} key={currentLang} />,
      );
      // 根据window._DEFAULT_LANG_获取当前站点的默认的语言
      const defaultUrl = changeLangPath(window._DEFAULT_LANG_ || 'en_US');
      // eslint-disable-next-line react/no-unknown-property
      doms.push(<link rel="alternate" href={defaultUrl} hrefLang="x-default" key="x-default" />);
    }
    doms.push(<meta property="og:url" content={_href} key="meta" />);
    doms.push(<link rel="canonical" href={_href} key="canonical" />);
    return doms;
  }, [useAlterLang, currentLang, languages, changeLangPath, getUrl, getHrefLang]);

  return (
    <HelmetProvider>
      <Helmet>
        <meta property="og:type" content={isArticle ? 'article' : 'website'} />
        {languages.map((lang) => {
          if (lang === currentLang) {
            return <meta property="og:locale" content={currentLang} key={lang} />;
          }
          if (useAlterLang) {
            return <meta property="og:locale:alternate" content={lang} key={lang} />;
          }
          return null;
        })}
        {renderLangLink()}
      </Helmet>
    </HelmetProvider>
  );
};

SEOmeta.propTypes = {
  currentLang: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  isArticle: PropTypes.bool,
  useAlterLang: PropTypes.bool,
  pathname: PropTypes.string,
  queryConfig: PropTypes.arrayOf(
    PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      route: PropTypes.any,
      // eslint-disable-next-line react/forbid-prop-types
      query: PropTypes.object,
    }),
  ),
};

SEOmeta.defaultProps = {
  isArticle: false,
  useAlterLang: true,
  pathname: '',
  queryConfig: null,
};

export default SEOmeta;
