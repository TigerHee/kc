/**
 * Owner: willen@kupotech.com
 */
import QRCode from 'qrcode.react';
import downloadLogo from 'static/download/logo-icon.svg';

export default (props) => {
  return (
    <QRCode
      {...props}
      imageSettings={{
        src: props?.cover || downloadLogo,
        x: null,
        y: null,
        height: 40,
        width: 40,
        excavate: true,
      }}
    />
  );
};
