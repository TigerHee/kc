/**
 * Owner: solar@kupotech.com
 * desc: 用于前端搜索，并返回排序好的列表
 */

export function sortedCurrency(searchText = '', items) {
  if (!searchText) {
    // 如果搜索文本不存在，则按余额进行降序排序
    return [...items].sort((a, b) => (b.total || 0) - (a.total || 0));
  }
  const lowerCaseSearchText = searchText.toLowerCase();
  try {
    return [...items].sort((a, b) => {
      const lowerA = a.currencyName.toLowerCase().trim();
      const lowerB = b.currencyName.toLowerCase().trim();
      // 全匹配currencyName优先
      if (lowerA === lowerCaseSearchText && lowerB === lowerCaseSearchText) {
        return 0;
      }
      if (lowerA === lowerCaseSearchText) {
        return -1;
      }
      if (lowerB === lowerCaseSearchText) {
        return 1;
      }

      // 部分匹配其次
      const aStartsWith = lowerA.indexOf(lowerCaseSearchText);
      const bStartsWith = lowerB.indexOf(lowerCaseSearchText);

      if (aStartsWith !== -1 && bStartsWith !== -1) {
        if (aStartsWith > bStartsWith) {
          return 1;
        }
        if (aStartsWith < bStartsWith) {
          return -1;
        }
        const aAmount = a.total || 0;
        const bAmount = b.total || 0;
        if (aAmount === bAmount) {
          return lowerA.localeCompare(lowerB);
        }
        return bAmount - aAmount;
      }
      if (aStartsWith !== -1) {
        return -1;
      }
      if (bStartsWith !== -1) {
        return 1;
      }

      // 最后按字母顺序比较
      return lowerA.localeCompare(lowerB);
    });
  } catch {
    return items;
  }
}
