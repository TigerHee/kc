import {sentry} from '@krn/toolkit';

import {name, version} from '../../package.json';
export const initSentry = ({nativeInfo}) => {
  sentry.initSentry({
    name,
    version,
    dsn: 'https://d8cfe60e14ef43ad978cb2eb555aacda@sentry-v2.staticimg.co/72',
    webApiHost: nativeInfo.webApiHost,
    appVersion: nativeInfo.version,
    site: nativeInfo.siteType,
  });
};

export const reportIntlMissing = sentry.reportIntlMissing;
