/**
 * Owner: borden@kupotech.com
 */
import Raven from 'raven-js';

const config = {
  release: `Trade.${_VERSION_}`,
};

Raven.config(
  _DEV_
    ? ''
    : 'https://8972e9d380a34446b8391f3508465153@sentry.kcsfile.com/6',
  config,
).install();

export default Raven;
