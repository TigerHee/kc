/**
 * Owner: jesse.shao@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';

const useInviteLink = () => {
  const { isLogin } = useSelector(state => state.user);
  const { inviteCode, scode } = useSelector(state => state.cryptoCup);

  const inviteLink = useMemo(
    () => {
      // const baseLink = `https://kucoin.onelink.me/iqEP/lm6enwf8?kcapph5=%2Fland%2Fcrypto-cup`;
      const baseLink = `https://kucoin.onelink.me/iqEP/ojnk32bi?kcapph5=%2Fland%2Fcrypto-cup`;
      if (!isLogin) {
        return baseLink;
      }
      let fullLink = ``;
      if (inviteCode) {
        fullLink = baseLink + `&rcode=${inviteCode}`;
      }
      if (scode) {
        fullLink += `&scode=${scode}`;
      }
      return fullLink;
    },
    [isLogin, inviteCode, scode],
  );

  return {
    inviteLink,
  };
};

export default useInviteLink;
