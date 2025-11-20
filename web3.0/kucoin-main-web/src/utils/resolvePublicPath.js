/**
 * Owner: willen@kupotech.com
 */
/**
 * 所有显式使用 window.publicPath 或者 __webpack_public_path__ 变量的地方都调用这个方法
 * MPA 将原本复制到 publicPath 下的 cdnAssets 的内容移动到每个 subApp 产物目录的上层作为共享目录
 */
export default () => {
  const publicPath = window.publicPath || __webpack_public_path__;
  if (process.env.NODE_ENV === 'development') {
    return publicPath;
  } else {
    // MPA build 去掉 publicPath 配置中的 subApp 内容
    return publicPath.replace(/[a-zA-Z0-9\-]+\/$/, '');
  }
};
