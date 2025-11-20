/**
 * Owner: ella.wang@kupotech.com
 */
// 带queryNumber的converter路由的tdk从模板拿数据
// 不从接口拿数据
const isConverterTemplate = (location) => {
  const { pathname, query } = location;
  if (/\/converter\/.*/.test(pathname) && query.queryNumber) {
    return true;
  }
  return false;
};

// 需要单独处理tdk的路由
export const TDK_EXCLUDE_PATH = [
  /\/blog\/.*/,
  /\/how-to-buy\/[0-9a-z\-\.&\(\)]+($|\/$)/i, // how-to-buy 二级页面
  /\/learn\/.+\/.+/, // learn 文章详情页
  isConverterTemplate,
];
