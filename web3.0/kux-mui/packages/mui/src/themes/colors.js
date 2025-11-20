/**
 * Owner: victor.ren@kupotech.com
 */
import { fade } from 'utils/colorManipulator';

// 亮暗通用
const baseColor = {
  complementary: '#F8B200',
  complementary88: fade('#F8B200', 0.88),
  complementary60: fade('#F8B200', 0.6),
  complementary40: fade('#F8B200', 0.4),
  complementary20: fade('#F8B200', 0.2),
  complementary12: fade('#F8B200', 0.12),
  complementary8: fade('#F8B200', 0.08),

  // 字体特例主色
  walletPrimary: '#18CA51',

  icon: '#8C8C8C',
  icon40: fade('#8C8C8C', 0.4),
  icon60: fade('#8C8C8C', 0.6),
  tip: '#2D2D2F',
};

export const light = {
  ...baseColor,

  primary: '#01BC8D',
  primary88: fade('#01BC8D', 0.88),
  primary60: fade('#01BC8D', 0.6),
  primary40: fade('#01BC8D', 0.4),
  primary20: fade('#01BC8D', 0.2),
  primary12: fade('#01BC8D', 0.12),
  primary8: fade('#01BC8D', 0.08),
  primary4: fade('#01BC8D', 0.04),
  secondary: '#F65454',
  secondary88: fade('#F65454', 0.88),
  secondary60: fade('#F65454', 0.6),
  secondary40: fade('#F65454', 0.4),
  secondary20: fade('#F65454', 0.2),
  secondary12: fade('#F65454', 0.12),
  secondary8: fade('#F65454', 0.08),

  divider8: fade('#1D1D1D', 0.08),
  divider4: fade('#1D1D1D', 0.04),

  link: '#01BC8D',

  textPrimary: '#01BC8D',

  // 覆盖类
  cover: '#1D1D1D',
  cover2: fade('#1D1D1D', 0.02),
  cover4: fade('#1D1D1D', 0.04),
  cover8: fade('#1D1D1D', 0.08),
  cover12: fade('#1D1D1D', 0.12),
  cover16: fade('#1D1D1D', 0.16),
  cover20: fade('#1D1D1D', 0.2),
  cover40: fade('#1D1D1D', 0.4),

  // 背景类
  base: '#F7F8FB',
  background: '#F9F9F9',
  backgroundMajor: '#FFFFFF',
  overlay: '#FFFFFF',
  overlay60: fade('#FFFFFF', 0.6),

  // 文案类
  text: '#1D1D1D',
  text60: fade('#1D1D1D', 0.6),
  text40: fade('#1D1D1D', 0.4),
  text30: fade('#1D1D1D', 0.3),
  text24: fade('#1D1D1D', 0.24),
  text20: fade('#1D1D1D', 0.2),
  textEmphasis: '#FFFFFF',

  // 弹窗浮层
  layer: '#FFFFFF',
  mask: fade('#000D1D', 0.3),
  toast: '#222223',
};

export const dark = {
  ...baseColor,

  primary: '#00C288',
  primary88: fade('#00C288', 0.88),
  primary60: fade('#00C288', 0.6),
  primary40: fade('#00C288', 0.4),
  primary20: fade('#00C288', 0.2),
  primary12: fade('#00C288', 0.12),
  primary8: fade('#00C288', 0.08),
  primary4: fade('#00C288', 0.04),
  secondary: '#F66754',
  secondary88: fade('#F66754', 0.88),
  secondary60: fade('#F66754', 0.6),
  secondary40: fade('#F66754', 0.4),
  secondary20: fade('#F66754', 0.2),
  secondary12: fade('#F66754', 0.12),
  secondary8: fade('#F66754', 0.08),

  divider8: fade('#F3F3F3', 0.08),
  divider4: fade('#F3F3F3', 0.04),

  link: '#00C288',

  textPrimary: '#00C288',

  // 覆盖类
  cover: '#F3F3F3',
  cover2: fade('#F3F3F3', 0.02),
  cover4: fade('#F3F3F3', 0.04),
  cover8: fade('#F3F3F3', 0.08),
  cover12: fade('#F3F3F3', 0.12),
  cover16: fade('#F3F3F3', 0.16),
  cover20: fade('#F3F3F3', 0.2),
  cover40: fade('#F3F3F3', 0.4),

  // 背景类
  base: '#181E29',
  background: '#222222',
  backgroundMajor: '#0B0B0B',
  overlay: '#121212',
  overlay60: fade('#121212', 0.6),

  // 文案类
  text: '#F3F3F3',
  text60: fade('#F3F3F3', 0.6),
  text40: fade('#F3F3F3', 0.4),
  text30: fade('#F3F3F3', 0.3),
  text24: fade('#F3F3F3', 0.24),
  text20: fade('#F3F3F3', 0.2),
  textEmphasis: '#1D1D1D',

  // 弹窗浮层
  layer: '#222223',
  mask: fade('#000000', 0.6),
  toast: '#FFFFFF',
};
