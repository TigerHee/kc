/**
 * Owner: chelsey.fan@kupotech.com
 */
import { useState, useEffect } from 'react';

const xss = require('xss');
const cssfilter = require('cssfilter');

const commonAttr = ['id', 'class', 'name'];
const xssfilter = new xss.FilterXSS({
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
  onIgnoreTagAttr(_, name, value) {
    if (name === 'style') {
      return `${name }="${ cssfilter(value) }"`;
    }
    if (commonAttr.includes(name)) {
      return `${name }="${ xss.escapeAttrValue(value) }"`;
    }
    if (name.substring(0, 5) === 'data-') {
      return `${name }="${ xss.escapeAttrValue(value) }"`;
    }
  },
});

const useHtmlToReact = ({ html }) => {
  const [eles, setEles] = useState('');
  const getEles = () => {
    import('html-to-react').then((HtmlToReact) => {
      const { Parser } = HtmlToReact;
      const htmlToReactParser = new Parser();
      const h = htmlToReactParser.parse(xssfilter.process(html));
      setEles(h);
    });
  };
  useEffect(() => {
    getEles();
  }, [html]);
  return {
    eles,
  };
};

export const htmlToReactSync = (html) => {
  const HtmlToReact = require('html-to-react');
  const { Parser } = HtmlToReact;
  const htmlToReactParser = new Parser();
  const h = htmlToReactParser.parse(xssfilter.process(html));
  return h;
};

export default useHtmlToReact;
