/**
 * Owner: iron@kupotech.com
 */

import { useDispatch, useSelector } from 'react-redux';

import React, { useCallback, useEffect, useRef } from 'react';
import { Parser } from 'html-to-react';
import ErrorBoundary from './ErrorBoundary';

import { namespace } from './model';
import { getCmsCdnHost } from './config';

const htmlToReactParser = new Parser();
const LoadCmpt = ({ run, combine, isHead, lang }) => {
  const { body } = useSelector((state) => state[namespace]);
  const linkRef = useRef(null);
  const dispatch = useDispatch();
  const makeStyle = useCallback((src) => {
    if (!window) return;
    const flag = (run || '').replace(/\./g, '_');
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
    makeStyle(styleSrc);
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
