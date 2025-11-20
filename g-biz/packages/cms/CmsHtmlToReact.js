/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState, useMemo } from 'react';
import { Parser } from 'html-to-react';
import { useTranslation } from '@tools/i18n';
import { exposeCmsHtmlForSSG } from '@tools/exposeCmsForSSG';
import resolveHost from './resolveHost';
import loadTemp from './load';
import useCmsCommon from './useCmsCommon';

const parser = new Parser();

const CmsHtmlToReact = ({
  run,
  load = false,
  parseChildren = false,
  processTag,
  Portal,
  renderDynamicData, // 渲染动态数据
  exposeSSG = false,
}) => {
  let parsedHtml = null;
  if (window.g_cmsCommonState && window.g_cmsCommonState[run]) {
    parsedHtml = parser.parse(window.g_cmsCommonState[run]);
  }
  const [temp, setTemp] = useState('');
  const [elements, setElements] = useState(parsedHtml);
  const {
    i18n: { language },
  } = useTranslation();
  const [cmsCommonState] = useCmsCommon();

  const needProcess = typeof processTag === 'function';
  const needRenderDynamicData = typeof renderDynamicData === 'function';

  useEffect(() => {
    if (load) {
      loadTemp(run, language).then((res) => {
        let { data } = res;
        data = resolveHost(data, language);

        setTemp(data ? data[run] : '');
      });
    }
  }, [language, load, run]);

  const html = useMemo(() => {
    if (load) {
      return temp;
    }
    if (!cmsCommonState[language]) {
      return '';
    }

    return cmsCommonState[language][run];
  }, [cmsCommonState, language, load, run, temp]);

  useEffect(() => {
    if (html) {
      const parsedHtml = parser.parse(html);
      if (parseChildren) {
        const children = React.Children.map(parsedHtml.props.children, (child) => child);
        setElements(needProcess ? processTag(children) : children);
      } else {
        setElements(needProcess ? processTag(parsedHtml) : parsedHtml);
      }
      // 暂不支持 renderDynamicData
      if (exposeSSG && !needRenderDynamicData) {
        exposeCmsHtmlForSSG(run, html);
      }
    }
  }, [html, parseChildren, processTag, needProcess, run, exposeSSG, needRenderDynamicData]);

  // 动态渲染
  useEffect(() => {
    if (elements && needRenderDynamicData) {
      renderDynamicData();
    }
  }, [elements, renderDynamicData, needRenderDynamicData]);

  return Portal ? elements && <Portal>{elements}</Portal> : elements;
};

export default React.memo(CmsHtmlToReact);
