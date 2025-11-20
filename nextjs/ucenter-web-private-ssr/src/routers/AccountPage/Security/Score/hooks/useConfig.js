import JsBridge from 'gbiz-next/bridge';
import { useMultiSiteConfig } from 'gbiz-next/hooks';
import { useEffect, useMemo, useState } from 'react';
import { passkeysSupported } from 'utils/webauthn-json';
import { METHOD_ENUMS, METHOD_INFOS } from '../constants';

const IS_APP = JsBridge.isApp();

function toCamelCase(str) {
  return str.replace(/[A-Z]/g, (letter) => '_' + letter).toUpperCase();
}

function getConfig({ key, isDeviceSupport = false, isSiteSupport = false } = {}) {
  const { name, desc, checkDeviceSupport, noSupportedTitle, noSupportedDesc, webUrl, appUrl } =
    METHOD_INFOS[key] ?? {};
  const _name = name?.();
  const _desc = desc?.();
  const _noSupportedTitle = noSupportedTitle?.();
  const _noSupportedDesc = noSupportedDesc?.();
  const _isDeviceSupport = checkDeviceSupport ? isDeviceSupport : true;
  return {
    isSiteSupport,
    isDeviceSupport: checkDeviceSupport ? isDeviceSupport : true,
    title: !_isDeviceSupport ? _noSupportedTitle || _name : _name,
    desc: !_isDeviceSupport ? _noSupportedDesc || _desc : _desc,
    webUrl,
    appUrl,
  };
}

const useConfig = () => {
  const [appConfig, setAppConfig] = useState([]);
  const { multiSiteConfig } = useMultiSiteConfig();

  const webConfig = useMemo(() => {
    return [
      {
        key: METHOD_ENUMS.PASSKEY,
        isSiteSupport: multiSiteConfig?.securityConfig?.passkeyOpt,
        isDeviceSupport: passkeysSupported(),
      },
      {
        key: METHOD_ENUMS.EMAIL,
        isSiteSupport: multiSiteConfig?.securityConfig?.emailBindOpt,
        isDeviceSupport: true,
      },
      {
        key: METHOD_ENUMS.PHONE,
        isSiteSupport: multiSiteConfig?.securityConfig?.phoneBindOpt,
        isDeviceSupport: true,
      },
      {
        key: METHOD_ENUMS.G2FA,
        isSiteSupport: multiSiteConfig?.securityConfig?.google2faOpt,
        isDeviceSupport: true,
      },
      {
        key: METHOD_ENUMS.SAFE_WORD,
        isSiteSupport: multiSiteConfig?.securityConfig?.antiPhishingCodeOpt,
        isDeviceSupport: true,
      },
    ];
  }, [multiSiteConfig]);

  const finalConfig = useMemo(() => {
    return (IS_APP ? appConfig : webConfig).reduce((res, cur) => {
      res[cur.key] = getConfig(cur);
      return res;
    }, {});
  }, [appConfig, webConfig]);

  useEffect(() => {
    if (IS_APP) {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'getSafeGuardStatus' },
        },
        ({ data }) => {
          const result = Object.keys(data || {}).map((key) => {
            const newKey = toCamelCase(key);
            const { isDeviceSupport, isSiteSupport } = data[key] || {};
            return { key: newKey, isDeviceSupport, isSiteSupport };
          });
          setAppConfig(result);
        },
      );
    }
  }, []);

  return finalConfig;
};

export default useConfig;
