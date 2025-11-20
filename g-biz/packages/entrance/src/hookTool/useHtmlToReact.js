/**
 * Owner: chelsey.fan@kupotech.com
 */
import { useEffect, useState } from 'react';

const useHtmlToReact = ({ html }) => {
  const [eles, setEles] = useState('');

  useEffect(() => {
    const getEles = () => {
      import('html-to-react').then((HtmlToReact) => {
        const { Parser } = HtmlToReact;
        const htmlToReactParser = new Parser();
        const h = htmlToReactParser.parse(html);
        setEles(h);
      });
    };
    getEles();
  }, [html]);

  return {
    eles,
  };
};
export default useHtmlToReact;
