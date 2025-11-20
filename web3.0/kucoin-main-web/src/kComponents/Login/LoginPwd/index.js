/**
 * Owner: odan.ou@kupotech.com
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'utils/router';
import { $loginKey } from 'components/Entrance/const';
import { LoginDrawer } from '@kucoin-biz/entrance';

const pathMap = {
  GFA: '/ucenter/reset-g2fa/',
  SMS: '/ucenter/rebind-phone/',
};

/**
 * 用户登录
 * @param {{
 *  visible: boolean,
 *  onClose(): void,
 *  onOpenForget(): void,
 *  callback?: () => void,
 * }} props
 */
const UserLogin = (props) => {
  const { callback, visible, onClose, onOpenForget } = props;
  const dispatch = useDispatch();

  return (
    <LoginDrawer
      loginKey={$loginKey}
      open={visible}
      showLoginSafeWord
      anchor="right"
      onClose={() => {
        onClose();
      }}
      onSuccess={async () => {
        try {
          await dispatch({
            type: 'user/pullUser',
          });
          onClose();
        } finally {
          callback?.();
        }
      }}
      onForgetPwdClick={() => {
        onClose();
        onOpenForget();
      }}
      verifyCanNotUseClick={(key, token) => {
        push(`${pathMap[key]}${token}`);
        onClose();
      }}
      signOrDownClick={() => {
        push('/ucenter/signup');
        onClose();
      }}
      BoxProps={{
        maxWidth: 528,
        width: '100%',
        p: 8,
        pb: 5,
        height: '100%',
      }}
    />
  );
};

export default UserLogin;
