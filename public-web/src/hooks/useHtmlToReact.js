/**
 * Owner: chelsey.fan@kupotech.com
 */
import HtmlToReact from 'html-to-react';
import { useEffect, useState } from 'react';

const xss = require('xss');
const cssfilter = require('cssfilter');
export const xssfilter = new xss.FilterXSS({
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
  onTagAttr: function (tag, name, value, isWhiteAttr) {
    if (tag === 'span' && name === 'data-announcement-sub-id') return `${name}="${value}"`;
  },
  onIgnoreTagAttr: function (_, name, value) {
    if (name === 'style') {
      return name + '="' + cssfilter(value) + '"';
    }
  },
});

const getEles = async (html, setEles) => {
  const { Parser } = HtmlToReact;
  const htmlToReactParser = new Parser();
  const h = htmlToReactParser.parse(xssfilter.process(html));
  setEles(h);
};

const useHtmlToReact = ({ html }) => {
  const [eles, setEles] = useState('');
  useEffect(() => {
    getEles(html, setEles);
  }, [html]);
  return {
    eles,
  };
};
export default useHtmlToReact;
