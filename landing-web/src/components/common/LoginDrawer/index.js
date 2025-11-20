/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector, useDispatch } from 'dva';
import { getSpm } from 'utils/sensors';
import { MAINSITE_HOST } from 'utils/siteConfig';
import { updateQueryStringParameter } from 'helper';
import { addLangToPath } from 'utils/lang';
import { G2FALink } from './config';
import systemDynamic from 'utils/systemDynamic';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';

const LoginDrawer = systemDynamic('@remote/entrance', 'LoginDrawer');

export default ({ openLogin, handleCloseLogin, handleLoginSuccess, needBox = false }) => {
  const currentLang = useSelector(state => state.app.currentLang);
  const dispatch = useDispatch();
  const rcode = queryPersistence.getPersistenceQuery('rcode');

  const handleForgetPwd = () => {
    window.open(`${MAINSITE_HOST}/ucenter/reset-password?lang=${currentLang}`, '_blank');
  };

  const handleSignOrDownClick = async () => {
    handleCloseLogin();
    const signupQuery = rcode ? `?rcode=${rcode}` : '';
    const spm = await getSpm();
    const spmid = spm ? spm?.compose(['register', '1']) || '' : '';
    window.open(`${MAINSITE_HOST}/ucenter/signup${signupQuery}&spm=${spmid}`, '_blank');
  };

  const handleVerifyCanNotUseClick = (key, token, finishUpgrade) => {
    const pathMap = {
      GFA: `${MAINSITE_HOST}/ucenter/reset-g2fa/${token}`,
      SMS: `${MAINSITE_HOST}/ucenter/rebind-phone/${token}`,
    };
    if (key === 'GFA' && !finishUpgrade) {
      window.location.href = addLangToPath(G2FALink);
    }
    window.location.href = updateQueryStringParameter(pathMap[key], 'lang', currentLang);
  };

  const handleLogin = (data) => {
    dispatch({ type: 'update/app', payload: { user: data } });
    handleLoginSuccess();
  };

  return (
      <LoginDrawer
        anchor="right"
        showLoginSafeWord
        open={openLogin}
        onClose={handleCloseLogin}
        onSuccess={handleLogin}
        onForgetPwdClick={handleForgetPwd}
        verifyCanNotUseClick={handleVerifyCanNotUseClick}
        signOrDownClick={handleSignOrDownClick}
        BoxProps={ needBox ? {
          width: '100vw',
          p: 3,
        }: {} }
      />
  )
}
