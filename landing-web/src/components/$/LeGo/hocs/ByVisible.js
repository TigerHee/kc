/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 作用: 基于visible进行校验，判断是否展示children
 */
export default ({ children, visible }) => {
  if (visible) {
    return children;
  }
  return null;
};
