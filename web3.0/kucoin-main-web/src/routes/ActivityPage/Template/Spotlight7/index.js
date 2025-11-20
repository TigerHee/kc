/**
 * Owner: jessie@kupotech.com
 */
import React, { useEffect } from 'react';
import siteConfig from 'utils/siteConfig';
import { addLangToPath } from 'tools/i18n';

const { KUCOIN_HOST } = siteConfig;
const Spotlight7 = ({ item = {}, id }) => {
  useEffect(() => {
    // admin里显示的url是 /spotlight/:id 这里需要兼容一下
    if (id) {
      const query = window.location.search || '';
      window.location.href = addLangToPath(`${KUCOIN_HOST}/spotlight7/${id}${query}`);
    }
  }, [id]);
  return null;
};
export default Spotlight7;
