/**
 * Owner: jesse@kupotech.com
 */
import React from 'react';
import router from 'umi/router';

export default () => {
  React.useEffect(() => {
    console.error('ErrorFallback...');
    router.push('/404');
  }, []);

  return null;
};
