/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import ReactCopyToClipboard from 'react-copy-to-clipboard';

const CopyToClipboard = ({ text, onCopy, children }) => {
  return (
    <ReactCopyToClipboard
      text={text}
      onCopy={onCopy}
    >
      {children}
    </ReactCopyToClipboard>
  );
};

export default CopyToClipboard;
