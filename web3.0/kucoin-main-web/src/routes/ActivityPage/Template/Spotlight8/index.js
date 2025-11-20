/**
 * Owner: saiya.lee@kupotech.com
 */
import React, { useEffect } from 'react';
import siteConfig from 'utils/siteConfig';
import { addLangToPath } from 'tools/i18n';

const { KUCOIN_HOST } = siteConfig;
const Spotlight8 = ({ item = {}, id }) => {
  useEffect(() => {
    // admin里显示的url是 /spotlight/:id 这里需要兼容一下
    if (id) {
      const query = window.location.search || '';
      window.location.href = addLangToPath(`${KUCOIN_HOST}/spotlight_r8/${id}${query}`);
    }
  }, [id]);
  return null;
};
export default Spotlight8;
