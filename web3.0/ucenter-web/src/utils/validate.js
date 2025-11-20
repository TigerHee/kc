/**
 * Owner: willen@kupotech.com
 */
import { restrictedInfo, restrictedStatusList } from 'config/base';
import { debounce, includes } from 'lodash';
import { replace } from 'utils/router';
/**
 * 密码校验
 * @param {*} pwd 密码
 */
export const validatePwd = (pwd) => {
  let strength = 'L'; // 安全等级，L M H
  let check = true; // 校验通过与否
  let valid = 0;
  const len = pwd.length;
  // 密码中至少有一个字符，并且至少包含一个数字
  if (/^.*[0-9].*$/.test(pwd)) {
    valid += 1;
  }
  // 包含至少一个英文字母（无论大小写）
  if (/^.*[a-zA-Z].*$/.test(pwd)) {
    valid += 1;
  }
  // 不能出现空格
  if (/\s/g.test(pwd)) {
    check = false;
  }
  // 长度7～32位
  if (len >= 7 && len <= 32) {
    valid += 1;
  }
  if (valid >= 3) {
    strength = 'H';
  } else {
    check = false;
    if (valid > 1) strength = 'M';
  }
  return {
    check,
    strength,
  };
};
export const isRestrictedStatus = (restrictedStatus, isOpen) => {
  return isOpen && includes(restrictedStatusList, restrictedStatus);
};

export const getRestrictedTipMessage = (restrictedStatus, currentLang, isOpen) => {
  if (!isRestrictedStatus(restrictedStatus, isOpen)) return;
  const isCN = currentLang === 'zh_CN' || currentLang === 'zh_HK';
  return restrictedInfo[isCN ? 'zh_CN' : 'en_US'];
};
let redirectTimeout = null;
export const checkRestrictedPageAuth = debounce(
  (restrictedStatus, currentLang, path, isOpen, message) => {
    const tipMsg = getRestrictedTipMessage(restrictedStatus, currentLang, isOpen);
    if (tipMsg) {
      message && message?.warning(tipMsg);
      clearTimeout(redirectTimeout);
      redirectTimeout = setTimeout(() => {
        replace(path);
      }, 3000);
    }
  },
  500,
);

// 密码强度对输入密码长度分水岭
export const PASSWORD_STRENGTH_LELNGTH = 12;
// 密码强度等级对应值
export const PASSWORD_STRENGTH = {
  low: 0,
  middle: 1,
  high: 2,
};

// 是否包含特殊字符
export const containsSpecialChars = (str) => {
  const specialCharsReg = /[!@#$%^&*_+={}\\[\]\\|\\:;"'<>,\\.\\?\\/~`-]/g;
  return specialCharsReg.test(str);
};

// 获取密码强度
export const getStrengthLevel = (pwd) => {
  // 没有输入密码，兜底强度是低
  if (!pwd) {
    return PASSWORD_STRENGTH.low;
  }
  const len = pwd.length;
  const hasSpecialChars = containsSpecialChars(pwd);
  if (!hasSpecialChars) {
    // 没有特殊字符，大于12强度为中等，小于12强度为低
    return len > PASSWORD_STRENGTH_LELNGTH ? PASSWORD_STRENGTH.middle : PASSWORD_STRENGTH.low;
  }
  // 有特殊字符，大于12强度为高，小于12强度为中等
  return len > PASSWORD_STRENGTH_LELNGTH ? PASSWORD_STRENGTH.high : PASSWORD_STRENGTH.middle;
};

// 密码校验规则
export const validatePwdRule = (pwd) => {
  let strength;
  let check = true; // 校验通过与否
  let valid = 0;
  let hasWhiteSpace = false;
  let invalidLength = true;
  const len = pwd.length;
  // 密码中至少有一个字符，并且至少包含一个数字
  if (/^.*[0-9].*$/.test(pwd)) {
    valid += 1;
  }
  // 包含至少一个大小写英文字母
  if (/^.*[a-z].*$/.test(pwd) && /^.*[A-Z].*$/.test(pwd)) {
    valid += 1;
  }
  // 不能出现空格
  if (/\s/g.test(pwd)) {
    hasWhiteSpace = true;
    check = false;
  }
  // 长度10～32位
  if (len >= 10 && len <= 32) {
    valid += 1;
    invalidLength = false;
  }
  if (valid >= 3 && !hasWhiteSpace) {
    // 只有满足密码基本要求才展示密码强度
    strength = getStrengthLevel(pwd);
  } else {
    check = false;
  }
  return {
    check,
    hasWhiteSpace,
    invalidLength,
    strength,
  };
};
