/**
 * Owner: willen@kupotech.com
 */
import dev from './dev';
import prod from './prod';

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
