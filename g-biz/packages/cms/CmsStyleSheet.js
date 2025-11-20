/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from '@tools/i18n';
import { cmsHost } from './config';
import createLink from './createLink';

const CmsStyleSheet = ({ run }) => {
  const { i18n } = useTranslation();
  const href = useMemo(() => `${cmsHost}/c_${run}_${i18n.language}.css`, [i18n.language, run]);
  const meta = useMemo(() => (run || '').replace(/\./g, '_'), [run]);

  useEffect(() => {
    const remove = createLink(href, meta);

    return remove;
  }, [href, meta]);

  return null;
};

export default React.memo(CmsStyleSheet);
