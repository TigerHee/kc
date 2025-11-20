/**
 * Owner: jesse.shao@kupotech.com
 */
/* eslint-disable google-trans/should-be-only */
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { APP_HOST_NAME } from 'config';
import { changeLangPath } from 'utils/seoTools';
import { languages, getPathByLang } from 'utils/langTools';
import OgImage from './OgImage';

const canonicalOrigin = APP_HOST_NAME;

const SEOmeta = (props) => {
  const { currentLang } = props;

  const renderLangLink = useCallback(() => {
    const doms = [];
    languages.forEach((lang) => {
      if (currentLang !== lang) {
        // 首页不支持日语
        if (lang === 'ja_JP' && window.location.pathname === '/') {
          return;
        }
        let hrefLang = changeLangPath(lang);
        hrefLang = hrefLang.replace(window.location.hostname, canonicalOrigin);
        doms.push(<link rel="alternate" href={hrefLang} hrefLang={getPathByLang(lang)} key={lang} />);
      }
    });
    let _href = `${window.location.origin}${window.location.pathname}`;
    _href = _href.replace(window.location.hostname, canonicalOrigin);
    if (_href.endsWith('/')) {
      _href = _href.substring(0, _href.length - 1);
    }
    doms.push(<link rel="alternate" href={_href} hrefLang={getPathByLang(currentLang)} key={currentLang} />);
    // 英文链接
    let enUrl = changeLangPath(window._DEFAULT_LANG_);
    enUrl = enUrl.replace(window.location.hostname, canonicalOrigin);
    doms.push(<link rel="alternate" href={enUrl} hrefLang='x-default' key="x-default" />);
    doms.push(<meta property="og:url" content={_href} key="meta" />);
    doms.push(<link rel="canonical" href={_href} key="canonical" />);
    return doms;
  }, [currentLang]);

  return (
    <React.Fragment>
      <OgImage />
      <Helmet>
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
