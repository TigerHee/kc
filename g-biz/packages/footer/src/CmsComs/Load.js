/**
 * Owner: iron@kupotech.com
 */
import { useDispatch, useSelector } from 'react-redux';

import React, { useCallback, useEffect, useRef } from 'react';
import { Parser } from 'html-to-react';
import ErrorBoundary from './ErrorBoundary';

import { namespace } from './model';
import { getCmsCdnHost } from './config';

// const removeLangQuery = (url) => {
//   const langIndex = url.indexOf('lang=');
//   if (langIndex !== -1) {
//     const query = url.substr(url.indexOf('?') + 1);
//     const queryArr = query.split('&');
//     if (queryArr && queryArr.length === 1) {
//       if (queryArr[0].indexOf('lang=') === 0) {
//         return url.substr(0, url.indexOf('?'));
//       }
//       return url;
//     }
//     let langQueryLen = 0;
//     queryArr.forEach((item) => {
//       if (item.indexOf('lang=') === 0) {
//         langQueryLen = item.length;
//       }
//     });
//     // 有多个参数
//     if (url[langIndex - 1] === '?') {
//       return `${url.substr(0, url.indexOf('?') + 1)}${url.slice(url.indexOf('&') + 1)}`;
//     }
//     const delIndex = url.indexOf('&lang=');
//     return `${url.substr(0, delIndex)}${url.substr(delIndex + langQueryLen + 1, url.length)}`;
//   }
//   return url;
// };

const htmlToReactParser = new Parser();
const LoadCmpt = ({ run, combine, isHead, lang }) => {
  const { body } = useSelector((state) => state[namespace]);
  const linkRef = useRef(null);
  const dispatch = useDispatch();
  const makeStyle = useCallback((src, run) => {
    const flag = (run || '').replace(/\./g, '_');
    // 如果不是浏览器，不执行
    if (!window) {
      return;
    }
    const isExist = document.querySelector(`link[data-meta=${flag}]`);
    if (isExist) {
      return;
    }
    const linkEle = document.createElement('link');
    linkEle.href = src;
    linkEle.setAttribute('data-meta', flag);
    linkEle.rel = 'stylesheet';
    linkRef.current = linkEle;
    document.querySelector('head').append(linkEle);
  }, []);

  useEffect(() => {
    if (isHead || combine || !lang) {
      return;
    }
    const styleSrc = `${getCmsCdnHost()}/c_${run}_${lang}.css`;
    makeStyle(styleSrc, run);
  }, [combine, run, isHead, lang]);

  // 销毁后移除样式表
  useEffect(() => {
    if (!combine && lang) {
      dispatch({
        type: `${namespace}/fetch`,
        payload: {
          componentsToload: [run],
          currentLang: lang,
        },
      });
    }

    return () => {
      if (linkRef.current) {
        linkRef.current.remove();
      }
    };
  }, [lang]);

  // const run = this.getComponentId();

  const html = body[run];
  if (!html) {
    return null;
  }

  const nodes = htmlToReactParser.parse(`<div>${html}</div>`);

  const childs = [];
  React.Children.forEach(nodes.props.children, (child) => {
    if (React.isValidElement(child)) {
      childs.push(child);
    }
  });

  return (
    <ErrorBoundary>
      <React.Fragment key={run}>{childs}</React.Fragment>
    </ErrorBoundary>
  );
};

export default LoadCmpt;
