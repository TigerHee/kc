import { useMemo } from 'react';
import { LEVEL_COPY_TEXT_ENUMS, LEVEL_ENUMS } from '../constants';

export default ({ config, data }) => {
  return useMemo(() => {
    const {
      userSecurityLevel = LEVEL_ENUMS.LOW,
      userSecurityScore = 0,
      userNeedSecurityMethods,
    } = data ?? {};
    const { title, desc } = LEVEL_COPY_TEXT_ENUMS[userSecurityLevel] ?? {};
    return {
      score: userSecurityScore,
      level: userSecurityLevel,
      title: title?.(),
      desc: desc?.(),
      list: Object.keys(userNeedSecurityMethods ?? {})
        .map((key) => {
          const { isSiteSupport, isDeviceSupport, title, desc, webUrl, appUrl } = config[key] ?? {};
          return {
            key,
            title,
            desc,
            webUrl,
            appUrl,
            weight: userNeedSecurityMethods[key],
            isSiteSupport,
            isDeviceSupport,
          };
        })
        .filter(({ isSiteSupport }) => isSiteSupport)
        .sort((a, b) => {
          if (!b.isDeviceSupport) return -1;
          return b.weight - a.weight;
        }),
    };
  }, [config, data]);
};
