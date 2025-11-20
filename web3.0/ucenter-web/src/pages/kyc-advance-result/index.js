/**
 * Owner: tiger@kupotech.com
 */
import { useEffect } from 'react';
import { replace } from 'utils/router';

export default () => {
  useEffect(() => {
    replace('/account/kyc');
  }, []);

  return <></>;
};
