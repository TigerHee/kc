/**
 * Owner: jesse.shao@kupotech.com
 */

import Link from './Link';
import router from 'umi/router';
import withRouter from './withRouter';

// console.log('Link', Link);

function push(...args) {
  router.push(...args);
}

export {
  Link,
  withRouter,
  push,
};
