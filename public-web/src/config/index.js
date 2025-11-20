/**
 * Owner: willen@kupotech.com
 */
import prod from './prod';
import dev from './dev';

let config = null;

if (!_DEV_) {
  // eslint-disable-next-line
  config = prod;
} else {
  // eslint-disable-next-line
  config = dev;
}

export default {
  ...config,
};
