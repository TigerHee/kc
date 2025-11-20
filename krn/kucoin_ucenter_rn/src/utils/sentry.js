import {name, version} from '../../package.json';
import {sentry} from '@krn/toolkit';

const dsn =
  'https://237a0801119841489fbd01c3bb3f3c11@sentry-v2.staticimg.co/76';

const reportIntlMissing = sentry.reportIntlMissing;

export {reportIntlMissing};

export default (webApiHost, appVersion, site) => {
  sentry.initSentry({webApiHost, appVersion, site, name, version, dsn});
};
