export const isEarnPathValid = (pathname) => {
  if (!pathname) return false;
  // 匹配 /earn 开头的 pathname
  const regex = /^\/earn(\/.*)?$/;
  return regex.test(pathname);
}

/**
 * 校验合约域名是否进入基座
 * 匹配 /futures 或者 /futures/xxx
 * 不包括 /futures/lite /futures/h5 后期迁移了可以去掉
 * @param {*} pathname
 * @returns
 */
export const isFuturesPathValid = (pathname) => {
  if (!pathname) return false;

  // 检查是否以 /futures 开头
  if (!pathname.startsWith('/futures')) return false;

  // 去掉前缀 "/futures"，以便进一步分析
  const subPath = pathname.slice(8);  // 字符索引 8 是 "/futures" 的长度

  // 匹配 "/futures" 或 "/futures/" 完整路径
  if (subPath === '' || subPath === '/') return true;

  // 检查是否以 "/" 开头，例如
  if (!subPath.startsWith('/')) return false;

  // 检查子路径部分，确保不以 "/lite" 或 "/h5" 开头
  if (subPath.startsWith('/lite') || subPath.startsWith('/h5')) return false;

  // 其他情况均为有效路径
  return true;
};

export const isTradePathValid = (pathname) => {
  if (!pathname) return false;
  // 匹配 /trade 开头的 pathname
  const regex = /^\/trade(\/.*)?$/;
  return regex.test(pathname);
}

// 机器人特殊前缀
export const isBotTradePathValid = (pathname) => {
  if (!pathname) return false;
  // 匹配 /trading-bot 开头的 pathname
  const regex = /^\/trading-bot(\/.*)?$/;
  return regex.test(pathname);
}
