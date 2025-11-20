/**
 * Owner: willen@kupotech.com
 */
import { searchToJson } from 'helper';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'utils/router';

const AuthLayout = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const { verifyToken, isCommon, bizType } = searchToJson() || {};
    if (verifyToken) {
      dispatch({
        isCommon,
        bizType,
        type: 'user/loginVerify',
        payload: { token: verifyToken },
      });
      return;
    }
    push('/');
  }, []);

  return props.children;
};

export default AuthLayout;
