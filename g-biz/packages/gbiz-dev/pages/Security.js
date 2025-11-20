/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { useDispatch, routerRedux } from 'dva';
import { Route, Switch } from 'dva/router';
import { SecurityHome, UpdatePwd, G2fa, SecurityVerify } from '@kc/security/lib/componentsBundle';
import { useVerify } from '@kc/security';

const Security = () => {
  const dispatch = useDispatch();
  const handleClick = (key) => {
    if (key === 'PASSWORD') {
      dispatch(routerRedux.push('/security/updatePwd'));
    } else if (key === 'GOOGLE2FA') {
      dispatch(routerRedux.push('/security/g2fa'));
    }
  };
  return <SecurityHome onClick={handleClick} />;
};

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const onSuccess = () => {
    dispatch(routerRedux.push('/security'));
  };
  return <UpdatePwd onSuccess={onSuccess} onClickBread={onSuccess} />;
};

const G2FA = () => {
  const dispatch = useDispatch();
  const onSuccess = () => {
    dispatch(routerRedux.push('/security'));
  };
  return <G2fa onSuccess={onSuccess} onClickBread={onSuccess} />;
};

const SecurityVerifyPage = () => {
  const securityVerify = useVerify();

  return (
    <div>
      <SecurityVerify boxProps={{ width: 480 }} />
      <button type="button" onClick={() => securityVerify('SET_WITHDRAWAL_PASSWORD', () => {})}>
        Verify
      </button>
    </div>
  );
};

export default () => {
  return (
    <Switch>
      <Route exact path="/security" component={Security} />
      <Route path="/security/updatePwd" component={UpdatePassword} />
      <Route path="/security/g2fa" component={G2FA} />
      <Route path="/security/verify" component={SecurityVerifyPage} />
    </Switch>
  );
};
