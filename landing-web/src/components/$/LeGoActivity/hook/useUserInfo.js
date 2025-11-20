/**
 * Owner: terry@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';

const newInviteCodes = ['newcomer'];

export const useNewCode = (templateCode) => {
  return newInviteCodes.includes(templateCode);
};

const useUserInfo = ({user, templateCode} = {}) => {
  const { inviteCode } = useSelector(state => state.legoActivityPage);
  const userInfo = useMemo(() => {
    if (user && newInviteCodes.includes(templateCode)) {
      user.referralCode = inviteCode;
      return {...user}
    }
    return user;
  }, [user, templateCode, inviteCode]);
  return userInfo
};

export default useUserInfo;