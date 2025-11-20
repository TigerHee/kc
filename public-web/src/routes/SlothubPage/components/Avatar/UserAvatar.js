/*
 * @Date: 2024-06-24 18:05:07
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 10:22:13
 */
/*
 * Owner: harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import { useMemo } from 'react';
import { getUserFlag } from 'utils/user';

const Wrap = styled.div`
  background: #e1f7f1;
  border: 1px solid rgba(1, 188, 141, 0.4);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  color: #01bc8d;
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar = (props) => {
  const { userInfo, className } = props;
  const { isSub = false, avatar = '' } = userInfo || {};
  const name = useMemo(() => getUserFlag(userInfo, isSub), [isSub, userInfo]);
  if (avatar) {
    return <img src={avatar} alt={name} className={className} />;
  }
  return <Wrap className={className}>{name}</Wrap>;
};

export default UserAvatar;
