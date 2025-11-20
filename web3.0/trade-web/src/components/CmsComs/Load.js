/**
 * Owner: borden@kupotech.com
 */
// import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Parser } from 'html-to-react';
import ErrorBoundary from './ErrorBoundary';
import { CmsComponents } from 'config';
import { getCmsCdnHost } from 'helper';


const htmlToReactParser = new Parser();
const LoadCmpt = ({ run, combine, isHead }) => {
  const body = useSelector(state => state.components.body);
  const currentLang = useSelector(state => state.app.currentLang);
  const linkRef = useRef(null);
  const dispatch = useDispatch();
  const makeStyle = useCallback((src) => {

    if (!document) return;

    const linkEle = document.createElement('link');
    linkEle.href = src;
    linkEle.rel = 'stylesheet';
    linkRef.current = linkEle;
    document.querySelector('head').append(linkEle);
  }, []);
  const isCombine = useMemo(() => {
    return combine || CmsComponents.combine.indexOf(run) > -1;
  }, [combine, run]);

  useEffect(() => {
    // 组合的不单独加载样式

    if (isHead || combine || !currentLang || isCombine) {
      return;
    }
    const cdnhost = getCmsCdnHost();
    const styleSrc = `${cdnhost}/c_${run}_${currentLang}.css`;
    makeStyle(styleSrc);
  }, [isCombine, run, isHead, currentLang]);

  // 销毁后移除样式表
  useEffect(() => {
    if (!isCombine && currentLang) {
      dispatch({
        type: 'components/fetch',
        payload: {
          componentsToload: [run],
        },
      });
    }

    return () => {
      if (linkRef.current) {
        linkRef.current.remove();
      }
    };
  }, [currentLang]);

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
