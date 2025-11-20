/**
 * 集成测试，sandbox配置
 */
import { defineConfig } from 'umi';
import pkg from '../package.json';

export default defineConfig({
  publicPath: `/${pkg.name}/${pkg.version}/`,
  define: {
    _SITE_: 'site-sdb',
    IS_INSIDE_WEB: false,
    IS_TEST_ENV: false,
    IS_SANDBOX: true,
  },
});
