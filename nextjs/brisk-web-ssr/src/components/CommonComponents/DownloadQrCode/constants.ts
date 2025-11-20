import type { Options } from 'qr-code-styling';
import { bootConfig } from 'kc-next/boot';

export const DEFAULT_QRCODE_COFIG: Options = {
  width: 172,
  height: 172,
  image: bootConfig._BRAND_FAVICON_,
  type: 'svg', // 这里必须用 svg，不然在 safari 上经常出现中间的图片看不见的问题
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.3,
    margin: 2,
  },
  dotsOptions: {
    type: 'dots',
  },
  cornersSquareOptions: {
    type: 'dot',
  },
  cornersDotOptions: {
    type: 'dot',
  },
  qrOptions: {
    typeNumber: 6,
    errorCorrectionLevel: 'H',
    mode: 'Byte',
  },
};
