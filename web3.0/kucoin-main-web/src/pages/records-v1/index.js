/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { addLangToPath } from 'tools/i18n';
// import UserRoot from 'components/UserRoot';
// import Records from 'routes/RecordsV1';

export default () => {
  useEffect(() => {
    window.location.href = addLangToPath(`/assets/record`);
  }, []);
  return <div />;
};
