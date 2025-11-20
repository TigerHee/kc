/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
// MULTI-SITE
import downloadLogo from 'static/download/logo_icon.png';
import QRCode from 'qrcode.react';

export default (props) => {
  return (
    <QRCode
      {...props}
      imageSettings={{
        src: downloadLogo,
        x: null,
        y: null,
        height: 40,
        width: 40,
        excavate: true,
      }}
    />
  );
};
