/**
 * Owner: terry@kupotech.com
 */
import { useLocation } from 'react-router-dom';
import { useSelector } from 'hooks';
import keysEquality from 'utils/tools/keysEquality'
import systemDynamic from 'utils/systemDynamic';

const RestrictNotice = systemDynamic('@remote/header', 'RestrictNotice');

export default () => {
  const user = useSelector((state) => state.user?.user, 'ignore');
  const { pathname } = useLocation();
  const { currentLang } = useSelector(
    (state) => state.app,
    keysEquality(['currentLang'])
  );
  return (
    <RestrictNotice
      userInfo={user}
      pathname={pathname}
      currentLang={currentLang}
    />
  )
};