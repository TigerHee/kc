/**
 * Owner: willen@kupotech.com
 */
import dev from './dev';
import prod from './prod';
import { IS_DEV } from 'kc-next/env';

let config = null;
if (!IS_DEV) {

  config = prod;
} else {

  config = dev;
}

export default {
  ...config,
};
