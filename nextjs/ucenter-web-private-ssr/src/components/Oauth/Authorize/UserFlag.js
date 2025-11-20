/**
 * Owner: willen@kupotech.com
 */
import { px2rem, styled, useTheme } from '@kux/mui';
import { useCallback } from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${px2rem(48)} 0 ${px2rem(55)};
`;

const UserFlag = styled.div`
  width: ${px2rem(90)};
  height: ${px2rem(90)};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.colors.text};
  font-weight: 400;
  font-size: ${px2rem(36)};
  color: ${(props) => props.theme.colors.text};
  border-radius: 50%;
`;
const UserName = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  margin-top: ${px2rem(10)};
`;
const Authorize = (props) => {
  const { userInfo, isSub } = props;
  const theme = useTheme();
  const { nickname = '', email = '', phone = '', subAccount = '' } = userInfo || {};
  const userName = isSub ? subAccount : nickname || email || phone || '';
  // 获取用户表示标示：昵称>邮箱>手机，从用户已有的里面选优先级最高的那个，取前两个字符展示
  const getUserFlag = useCallback((user, isSub = false) => {
    const { nickname = '', email = '', phone = '', subAccount = '' } = user || {};
    let userFlag = '';
    try {
      if (nickname) {
        const nicknameStr = `${nickname}`;
        userFlag += nicknameStr[0];
        if (
          nicknameStr[1] &&
          nicknameStr[0].charCodeAt() <= 255 &&
          nicknameStr[1].charCodeAt() <= 255
        ) {
          userFlag += nicknameStr[1];
        }
      } else if (email) {
        userFlag += email.substring(0, 2);
      } else if (phone) {
        userFlag += phone.substring(phone.length - 2);
      }
      if (isSub) {
        userFlag = subAccount.substring(0, 2) || '';
      }
    } catch (e) {
      console.log(e);
    }
    return userFlag.toUpperCase();
  }, []);
  return (
    <Wrapper>
      <UserFlag>{getUserFlag(userInfo, isSub)}</UserFlag>
      <UserName>{userName}</UserName>
    </Wrapper>
  );
};

export default Authorize;
