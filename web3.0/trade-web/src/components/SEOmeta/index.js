/**
 * Owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { pathToRegexp } from 'path-to-regexp';
import { languages, getPathByLang } from 'utils/lang';
import { addLangPathToUrl } from 'utils/seoTools';
import OgImage from './OgImage';

// 全部使用/trade/币对的url
const SEOmeta = (props) => {
  const { currentLang, pathname } = props;

  const renderLangLink = useCallback(() => {
    const doms = [];
    let _href = `${window.location.origin}/trade${pathname}`;
    const pathRe = pathToRegexp('/:type/(.*)?');
    const execResult = pathRe.exec(pathname);
    if (_href.endsWith('/')) {
      _href = _href.substring(0, _href.length - 1);
    }
    let canonicalUrl = _href;
    if (execResult && execResult[2]) {
      canonicalUrl = `${window.location.origin}/trade/${execResult[2]}`;
    }
    languages.forEach((lang) => {
      if (currentLang !== lang) {
        const hrefLang = addLangPathToUrl(canonicalUrl, lang);
        // eslint-disable-next-line react/no-unknown-property, max-len
        doms.push(<link rel="alternate" href={hrefLang} hreflang={getPathByLang(lang)} key={lang} />);
      }
    });
    const currentUrl = addLangPathToUrl(canonicalUrl, currentLang);
    // eslint-disable-next-line react/no-unknown-property, max-len
    doms.push(<link rel="alternate" href={currentUrl} hreflang={getPathByLang(currentLang)} key={currentLang} />);
    // 英文链接
    const enUrl = addLangPathToUrl(canonicalUrl, 'en_US');
    // eslint-disable-next-line react/no-unknown-property
    doms.push(<link rel="alternate" href={enUrl} hreflang="x-default" key="x-default" />);
    doms.push(<link rel="canonical" href={currentUrl} key="canonical" />);
    return doms;
  }, [languages, currentLang, pathname]);

  return (
    <React.Fragment>
      <OgImage />
      <Helmet>
        <meta
          property="og:url"
          content={`${window.location.origin}${window.location.pathname}`}
        />
        {languages.map((lang) => {
          if (lang === currentLang) {
            return <meta property="og:locale" content={currentLang} key={lang} />;
          } else {
            return <meta property="og:locale:alternate" content={lang} key={lang} />;
          }
        })}
        {renderLangLink()}
      </Helmet>
    </React.Fragment>
  );
};

export default SEOmeta;
