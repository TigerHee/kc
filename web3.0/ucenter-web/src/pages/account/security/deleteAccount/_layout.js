/**
 * Owner: borden@kupotech.com
 */
import { useEffect } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { push } from 'utils/router';

export default (props) => {
  const { user } = useSelector((state) => state.user);
  const { isSub } = user || {};

  useEffect(() => {
    if (isSub) push('/account/security');
  }, [isSub]);

  return props.children;
};
