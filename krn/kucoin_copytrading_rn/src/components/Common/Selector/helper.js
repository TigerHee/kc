/**
 * 判断当前元素是否在最后一行。
 *
 * @param {number} total - 总元素数量。
 * @param {number} perRow - 每行的元素数量。
 * @param {number} current - 当前元素的序号（从1开始）。
 * @return {boolean} 如果当前元素在最后一行返回true，否则返回false。
 */
export const isLastRow = (total, perRow, current) => {
  if (total <= 0 || perRow <= 0 || current <= 0 || current > total) {
    throw new Error('Invalid input parameters');
  }

  // 计算总行数
  const totalRows = Math.ceil(total / perRow);

  // 计算当前元素所在的行数
  const currentRow = Math.ceil(current / perRow);

  // 判断当前行是否为最后一行
  return currentRow === totalRows;
};
