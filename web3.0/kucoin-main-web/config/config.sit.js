/**
 * 集成测试，sandbox配置
 */
import { defineConfig } from 'umi';
import pkg from '../package.json';

export default defineConfig({
  publicPath: `/${pkg.name}/${pkg.version}/`,
  devtool: 'source-map',
  define: {
    _SITE_: 'sit',
    IS_INSIDE_WEB: false,
    IS_TEST_ENV: true,
    IS_SANDBOX: false,
  },
});
