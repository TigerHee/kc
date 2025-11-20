/**
 * Owner: odan.ou@kupotech.com
 */
import React from 'react';
import { ForgetPwdDrawer } from '@kucoin-biz/entrance';

/**
 * 忘记密码
 * @param {{
 *  visible: boolean,
 *  onClose(): void,
 *  onLoginOpen(): void,
 * }} props
 */
const ForgetPwd = (props) => {
  const { onClose, onLoginOpen, visible } = props;
  return (
    <ForgetPwdDrawer
      anchor="right"
      onClose={onClose}
      open={visible}
      onSuccess={() => {
        onClose();
        onLoginOpen();
      }}
    />
  );
};
export default ForgetPwd;
