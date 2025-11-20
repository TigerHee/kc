/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import { useTranslation } from '@tools/i18n';
import resolveHost from './resolveHost';
import useCmsCommon from './useCmsCommon';
import load from './load';

const CmsCommonLoad = () => {
  const [cmsCommonState, setCmsCommon] = useCmsCommon();
  const { i18n } = useTranslation();

  useEffect(() => {
    const { language } = i18n;
    if (!cmsCommonState[language]) {
      load('cms.common', language).then((res) => {
        setCmsCommon({ [language]: resolveHost(res.data, language) });
      });
    }
  }, [i18n, setCmsCommon, cmsCommonState]);

  return null;
};

export default React.memo(CmsCommonLoad);
