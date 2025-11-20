/*
 * @Date: 2024-06-24 18:05:07
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 00:37:25
 */
/*
 * Owner: harry.lai@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import UserAvatar from './UserAvatar';

const CurrentUserAvatar = ({ className }) => {
  const userInfo = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) return;
    dispatch({ type: 'user/pullUser' });
  }, [dispatch, userInfo]);

  return <UserAvatar className={className} userInfo={userInfo} />;
};

export default CurrentUserAvatar;
