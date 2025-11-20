/**
 * Owner: solar@kupotech.com
 */
import { moduleFederation } from '@kucoin-biz/common-base';
const { init, loadRemote } = moduleFederation;
init({
  //当前消费者的名称
  name: 'ucenter-web',
  // 依赖的远程模块列表
  remotes: [
    {
      // 生产者名字
      name: 'assets-web',
      // 生产者的模块联邦map文件
      entry: process.env.APP_MF_ASSETS_WEB_MAP,
      // 是否需要预加载资源，默认是false，可不填
      preload: false,
    },
  ],
});
// 加载组件
const SubFundAccount = loadRemote('assets-web/SubFundAccount');
export default SubFundAccount;
