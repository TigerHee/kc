import prod from './prod';
import dev from './dev';
import { _DEV_ } from '../tools/env';

let config: any = null;

if (!_DEV_) {
  config = prod;
} else {
  config = dev;
}

export default {
   ...config as { v2ApiHosts: { CMS: string, WEB: string, POOLX: string, ROBOT: string } },
};
