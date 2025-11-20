/**
 * Owner: odan.ou@kupotech.com
 */
import React, { useCallback, useState, memo } from 'react';
import LoginPwd from './LoginPwd';
import ForgetPwd from './ForgetPwd';

/**
 * 登录
 * @param {{
 *   open: boolean,
 *   setOpen: React.Dispatch<React.SetStateAction<boolean>>,
 *   callback?: () => void
 * }} props
 */
const Login = (props) => {
  const { open, setOpen, callback } = props;

  const [forgetOpen, setForgetOpen] = useState(false);

  const onForgetClose = useCallback(() => {
    return setForgetOpen(false);
  }, []);

  const onForgetOpen = useCallback(() => {
    return setForgetOpen(true);
  }, []);

  const onLoginClose = useCallback(() => {
    return setOpen(false);
  }, [setOpen]);

  const onLoginOpen = useCallback(() => {
    return setOpen(true);
  }, [setOpen]);

  return (
    <>
      <LoginPwd
        visible={open}
        callback={callback}
        onClose={onLoginClose}
        onOpenForget={onForgetOpen}
      />
      <ForgetPwd onLoginOpen={onLoginOpen} onClose={onForgetClose} visible={forgetOpen} />
    </>
  );
};

export default memo(Login);
