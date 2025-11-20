export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);

  // 提取各个部分
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // 自定义格式
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
};

export function formatDateToYYYYMMDDHHmmss(isoString: string) {
  const date = new Date(isoString); // 创建 Date 对象
  const year = date.getFullYear(); // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，注意月份从 0 开始
  const day = String(date.getDate()).padStart(2, '0'); // 获取日期
  const hours = String(date.getHours()).padStart(2, '0'); // 获取小时
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟
  const seconds = String(date.getSeconds()).padStart(2, '0'); // 获取秒

  // 组装并返回所需格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
