/**
 * Owner: iron@kupotech.com
 */
/**
 * 处理路径连接
 */
export default (base: string, path: string) => {
  const hasSlashes = path.indexOf('/') === 0;
  return `${base}${hasSlashes ? '' : '/'}${path}`;
};
