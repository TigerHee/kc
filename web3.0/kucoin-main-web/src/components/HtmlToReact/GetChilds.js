/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState } from 'react';

export const parserHtml = (html) => {
  return import('html-to-react')
    .then(({ Parser }) => {
      const htmlToReactParser = new Parser();
      const nodes = htmlToReactParser.parse(`<div>${html}</div>`);
      const childs = [];
      React.Children.forEach(nodes.props.children, (child) => {
        childs.push(child);
      });
      return childs;
    })
    .catch((e) => {
      console.log(e);
    });
};

const GetChilds = (props) => {
  const { html, checkValid = false } = props;
  const [elements, setElements] = useState([]);

  useEffect(() => {
    let eles = [];
    import('html-to-react')
      .then(({ Parser }) => {
        const htmlToReactParser = new Parser();
        const nodes = htmlToReactParser.parse(`<div>${html}</div>`);
        React.Children.forEach(nodes.props.children, (child) => {
          if (!checkValid) {
            eles.push(child);
          } else {
            React.isValidElement(child) && eles.push(child);
          }
        });
        setElements(eles);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [html]);
  return elements;
};
export default GetChilds;
