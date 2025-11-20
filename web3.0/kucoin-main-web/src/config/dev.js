/**
 * Owner: willen@kupotech.com
 */
// 暂时注销， react-dom 16.4.2 没有lib,考虑根据react-dom 自行封装,
// const Perf = require('react-addons-perf');

// 注入调试工具
// window.Perf = Perf;

// const inet = 'https://www.kucoin.net/_api'; // whistle 代理app到本地调试用
const inet = '/_api';
const poolx = '/_pxapi';
const robot = '/_api_robot';
// const inet = 'https://v2.kucoin.net/_api';

export default {
  v2ApiHosts: {
    CMS: inet,
    WEB: inet,
    POOLX: poolx,
    ROBOT: robot,
  },
};
