/**
 * Owner: willen@kupotech.com
 */
// 暂时注销， react-dom 16.4.2 没有lib,考虑根据react-dom 自行封装,
// const Perf = require('react-addons-perf');

// 注入调试工具
// window.Perf = Perf;

// const inet = 'https://www.kucoin.net/_api'; // whistle 代理app到本地调试用
const inet = '/_api';
// const inet = 'http://192.168.30.2:2999/next-web/_api'; // 本地ip调试

// const inet = 'https://v2.kucoin.net/_api';

export default {
  v2ApiHosts: {
    CMS: inet,
    WEB: inet,
  },
};
