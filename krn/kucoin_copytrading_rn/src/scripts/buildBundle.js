const buildBundle = require('@krn/build/src/buildBundle');
const {PLATFORM, UNUSED_CHECK, BUILD_ENV} = process.env || {};

buildBundle({
  biz: 'follow', // 必填，业务名，仅支持字母、数字
  entry: 'main', // 必填，包名，仅支持字母、数字
  moduleName: 'krn_follow_trade', // RN根组件启动入口key
  entryFile: 'index.js', // 打包入口文件
  platform: PLATFORM,
  // 是否开启静态图片CDN化（静态图片放在CDN不再打入bundle zip包，以减小包体积）
  // 若要开启，请在项目下src/App.js添加如下代码：
  // import transferAssetsSource from '@krn/build/src/transferAssetsSource';
  // const nativeInfo = await getNativeInfo();
  // transferAssetsSource(nativeInfo.webApiHost);
  openAssetsCDN: true,
  // 是否开启未使用文件检测，"1"：仅检测，"2": 检测并自动删除。其他情况不开启
  // 可在根目录配置.keep.unused.files.txt，格式参考：dist/unusedFiles.txt，脚本会跳过这些文件检测
  unusedCheck: UNUSED_CHECK,
  multiTenantSite: {
    // 多租户配置
    turkey: {
      name: 'tr',
      sourceName: 'source_tr',
      appVersion: '1.0.0', // app最低支持版本
    },
    thailand: {
      name: 'th',
      sourceName: 'source_th',
      appVersion: '1.0.0', // app最低支持版本
    },
    global: {
      name: 'kc',
      sourceName: 'source',
      appVersion: require('../../package.json').appVersion || '3.122.0', // app最低支持版本
    },
  },
});
