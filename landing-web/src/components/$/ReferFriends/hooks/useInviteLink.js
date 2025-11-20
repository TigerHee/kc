/**
 * Owner: jesse.shao@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';
import { UTM_SOURCE } from './../config';

const useInviteLink = () => {
  const { isLogin } = useSelector((state) => state.user);
  const inviteCode = useSelector((state) => state.referFriend.invitationCode);

  const inviteLink = useMemo(() => {
    // const baseLink = `https://kucoin.onelink.me/iqEP/ojnk32bi?kcapph5=%2Fland%2Fcrypto-cup`;
    // 测试环境地址
    // const baseLink = `https://kucoin.onelink.me/iqEP/freetraveltest?kcapph5=%2Fland%2Frefer-friends-to-kucoin-and-win-free-travel&utm_source=${UTM_SOURCE}`;
    // // 线上环境地址
    const baseLink = `https://kucoin.onelink.me/iqEP/freetravel?kcapph5=%2Fland%2Frefer-friends-to-kucoin-and-win-free-travel&utm_source=${UTM_SOURCE}`;

    if (!isLogin) {
      return baseLink;
    }

    if (inviteCode) {
      return `${baseLink}&rcode=${inviteCode}`;
    }

    return baseLink;
  }, [isLogin, inviteCode]);

  return {
    inviteLink,
  };
};

export default useInviteLink;
