/**
 * 集成测试，sandbox配置
 */
import { defineConfig } from 'umi';
import pkg from '../package.json';

export default defineConfig({
  publicPath: `https://assets.staticimg.com/${pkg.name}/${pkg.version}/`,
  define: {
    _SITE_: 'sit',
    IS_INSIDE_WEB: false,
    // IS_TEST_ENV: true,
    IS_SANDBOX: false,
    _PUBLIC_PATH_: `https://assets.staticimg.com/${pkg.name}/${pkg.version}/`,
    CMS_CDN: 'https://assets.staticimg.com/cms-static',
  },
});
