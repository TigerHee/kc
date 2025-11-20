/**
 * 国内站配置
 */
import { defineConfig } from 'umi';
import pkg from '../package.json';

export default defineConfig({
  favicon: 'https://assets2.staticimg.com/cms/media/7AV75b9jzr9S8H3eNuOuoqj8PwdUjaDQGKGczGqTS.png',
  publicPath: `https://assets2.staticimg.com/${pkg.name}/${pkg.version}/`,
  define: {
    _SITE_: 'site-cn',
    IS_INSIDE_WEB: true,
    IS_TEST_ENV: false,
    IS_SANDBOX: false,
  },
});
