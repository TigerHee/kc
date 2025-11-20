/**
 * Owner: willen@kupotech.com
 */
import { Avatar } from '@kux/mui';
import React from 'react';
import { connect } from 'react-redux';
import defaultAvatar from 'static/account/default-avatar.svg';

const KcAvaTar = ({ avatar, dispatch, ...others }) => {
  const avatarUrl = avatar || defaultAvatar;
  return (
    <React.Fragment>
      <Avatar src={avatarUrl} {...others} />
    </React.Fragment>
  );
};

export default connect((state) => {
  return {
    avatar: (state.user.user || {}).avatar || null,
  };
})(KcAvaTar);
