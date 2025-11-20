/**
 * Owner: borden@kupotech.com
 */
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import CmsComs from 'components/CmsComs';
import { genComponentCssPath } from 'utils/cmptUtils';
import { getTimeStampOnHour, getCmsCdnHost } from 'helper';

function createLink(src, ref) {
  const linkEl = document.createElement('link');
  linkEl.rel = 'stylesheet';
  linkEl.href = src;
  if (ref) {
    ref.current = linkEl;
  }
  document.querySelector('head').appendChild(linkEl);
}

let timer = null;
const ThemeHelmet = ({ currentTheme, currentLang }) => {
  const t = getTimeStampOnHour(-6);
  const cdnhost = getCmsCdnHost();
  const currentRef = useRef(null);
  const lastRef = useRef(null);


  // 延后删除可以避免抖动
  useEffect(() => {
    const _src = `${_PUBLIC_PATH_}static/css/${currentTheme}.css`;
    if (currentRef.current) {
      lastRef.current = currentRef.current;
    }
    createLink(_src, currentRef);
    // TIPS: 延迟一些删除时间，避免抖动
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (lastRef.current && lastRef.current.remove) {
        lastRef.current.remove();
      }
    }, 32);
  }, [currentTheme]);

  return (
    <React.Fragment>
      <Helmet>
        {/* <link rel="stylesheet" href={genComponentCssPath(currentLang, CmsComponents)} /> */}
        <link rel="stylesheet" href={`${cdnhost}/c_cms.common_${currentLang}.css?t=${t}`} />
      </Helmet>
      {/* <CmsComs.Heads /> */}
    </React.Fragment>
  );
};

export default connect(({ theme, app }) => {
  return {
    currentLang: app.currentLang,
    currentTheme: theme.current,
  };
})(ThemeHelmet);
