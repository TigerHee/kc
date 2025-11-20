import * as Sentry from '@sentry/react-native';
import {Platform} from 'react-native';
import {name, version} from '../../package.json';

export default (webApiHost, appVersion, site) => {
  const env = __DEV__
    ? 'local'
    : webApiHost?.includes?.('nginx-web-')
    ? 'sit'
    : 'prod';
  Sentry.init({
    dsn: 'https://4fb3967d0e924976ab45ce451fa883c2@sentry-v2.staticimg.co/71',
    enableNative: false,
    enableNativeNagger: false,
    tracesSampleRate: 0.001,
    sampleRate: 1,
    environment: env,
  });
  Sentry.setTag('platform_os', Platform.OS);
  Sentry.setTag('bundle_name', name);
  Sentry.setTag('bundle_version', version);
  Sentry.setTag('api_host', webApiHost);
  Sentry.setTag('app_version', appVersion);
  // 多站点
  Sentry.setTag('site', site);
};
