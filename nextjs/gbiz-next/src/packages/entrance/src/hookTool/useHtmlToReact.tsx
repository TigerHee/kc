/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect, useState } from 'react';

const useHtmlToReact = ({ html }: { html: string }) => {
  const [eles, setEles] = useState('');

  useEffect(() => {
    const getEles = () => {
      import('html-to-react').then((module) => {
        const ParserClass = module.Parser as any;
        const htmlToReactParser = new ParserClass();
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