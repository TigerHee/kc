import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
import { i18nAddons } from './i18n';

// 创建自定义主题
const theme = create({
  base: 'light', // 主题基调，'light' 或 'dark'
  // 品牌相关
  brandTitle: 'Kux Design', // 左上角显示的名称
  // brandUrl: 'https://your-website-url.com', // 点击名称时跳转的链接
  // brandTarget: '_self', // 链接打开方式 (_self 或 _blank)
  
  // 如果你有自定义的 logo，可以在这里设置
  // brandImage: './logo.png', // 相对于 .storybook/public 目录的路径
});

// 应用自定义主题
addons.setConfig({
  theme,
});

Object.entries(i18nAddons).forEach(([name, addon]) => {
  addons.register(name, addon);
});