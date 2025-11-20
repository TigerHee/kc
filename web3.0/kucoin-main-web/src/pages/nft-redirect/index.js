/**
 * Owner: solar@kupotech.com
 */
import { useEffect } from 'react';
import { replace } from 'utils/router';

export default function RedirectNft() {
  useEffect(() => {
    replace('/spot-nft/collection');
  }, []);
  return null;
}
