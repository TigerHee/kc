/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const CodeShow = (props) => {
  const { code, lang } = props;
  return (
    <pre>
      <SyntaxHighlighter language={lang} PreTag="div">
        {code}
      </SyntaxHighlighter>
    </pre>
  );
};

export default CodeShow;
