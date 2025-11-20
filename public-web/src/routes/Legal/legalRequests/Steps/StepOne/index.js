/**
 * Owner: odan.ou@kupotech.com
 */

import { useCallback, useState } from 'react';
import LogIn from './LogIn';
import SignUp, { ResetPassword } from './SignUp';

const LoginStepOne = (props) => {
  const [conf, setConf] = useState({
    type: 'login', // login, signup, reset
  });
  const onChange = useCallback((type) => {
    setConf((item) => ({
      ...item,
      type,
    }));
  }, []);
  const hash = {
    login: <LogIn onChange={onChange} linkKey="signup" resetKey="reset" {...props} />,
    signup: <SignUp onChange={onChange} linkKey="login" />,
    reset: <ResetPassword onChange={onChange} linkKey="login" />,
  };

  return <div>{hash[conf.type]}</div>;
};

export default LoginStepOne;
