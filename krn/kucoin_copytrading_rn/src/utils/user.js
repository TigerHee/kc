// 获取用户表示标示：昵称>邮箱>手机，从用户已有的里面选优先级最高的那个，取前两个字符展示
export const getUserFlag = user => {
  const {
    nickname = '',
    nickName = '',
    email = '',
    phone = '',
    subAccount = '',
    isSub,
  } = user || {};
  let userFlag = '';
  try {
    if (nickname || nickName) {
      const nicknameStr = `${nickname || nickName}`;
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
};

/** 传入 UC 的userInfo 返回 前端展示的uc全名 */
export const getUserShowFullName = ucUserInfo => {
  const {nickname, email, phone} = ucUserInfo || {};
  return nickname || email || phone || '';
};
