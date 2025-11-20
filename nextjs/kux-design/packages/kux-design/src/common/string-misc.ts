/**
 * 是否包含全角字符, 如CJK(日韩共用字符，包括汉字、平假名、片假名)文字及标点符号
 * @param str
 * @returns boolean
 */
export function hasFullWidthChar(str: string) {
  // Regular expression for matching full-width characters
  return /[\u3000-\u303F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uAC00-\uD7AF\uFF01-\uFF60]/.test(str);
}

/**
 * 处理用户昵称
 * - 中文只返回首字符
 * - 非中文返回两位字符
 * @param userName 
 * @returns 
 */
export function formatNickName(userName: string) {
  let splitName = app.is(userName, 'string') ? userName.slice(0, 2).toUpperCase() : '';

  if (hasFullWidthChar(splitName)) {
    splitName = splitName[0] || '';
  }

  return splitName;
}
