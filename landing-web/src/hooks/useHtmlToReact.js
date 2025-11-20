/**
 * Owner: chelsey.fan@kupotech.com
 */
import { useState, useEffect } from 'react';
const xss = require('xss');
const cssfilter = require('cssfilter');
const xssfilter = new xss.FilterXSS({
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
  onIgnoreTagAttr: function (_, name, value) {
    if (name === 'style') {
      return name + '="' + cssfilter(value) + '"';
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
export default useHtmlToReact;
