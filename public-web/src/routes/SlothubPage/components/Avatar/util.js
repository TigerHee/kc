/*
 * Owner: harry.lai@kupotech.com
 */

/**
 *获取用户表示标示：昵称>邮箱>手机，从用户已有的里面选优先级最高的那个，取前两个字符展示
 **/
export const generateUserFlag = (user, isSub = false) => {
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
    } else if (isSub) {
      userFlag = subAccount.substring(0, 2) || '';
    } else if (email) {
      userFlag += email.substring(0, 2);
    } else if (phone) {
      userFlag += phone.substring(phone.length - 2);
    }
  } catch (e) {
    console.log(e);
  }
  return userFlag.toUpperCase();
};
