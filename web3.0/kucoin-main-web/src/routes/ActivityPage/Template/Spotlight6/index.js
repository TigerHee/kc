/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import siteConfig from 'utils/siteConfig';
import { addLangToPath } from 'tools/i18n';

const { KUCOIN_HOST } = siteConfig;
const Spotlight6 = ({ item = {}, id }) => {
  useEffect(() => {
    // 申购迁移到了landing-web，此处做跳转
    if (id) {
      const query = window.location.search || '';
      window.location.href = addLangToPath(`${KUCOIN_HOST}/spotlight_r6/${id}${query}`);
    }
  }, [id]);
  return null;
};
export default Spotlight6;
