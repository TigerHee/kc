/**
 * 共享的类型定义
 */

/**
 * 组件尺基础版尺寸
 * 定义了常用的两种尺寸：小、中
 */
export type IBasicSize = 'small' | 'medium';

/**
 * 组件尺寸
 * 定义了常用的三种尺寸：小、中、大
 * 一般默认值使用 'medium'
 */
export type ISize = IBasicSize | 'large';

/**
 * 扩展的组件尺寸
 * 包括了额外的 'mini' 和 'huge' 尺寸
 */
export type ISizeExtended = ISize | 'mini' | 'huge';

/**
 * 自动尺寸, 用于表示组件尺寸可以根据屏幕尺寸自动调整
 */
export type ISizeAuto = 'auto';

/**
 * 组件方向
 * 定义了两种方向：水平和垂直
 */
export type IDirection = 'horizontal' | 'vertical';

/**
 * 主题类型
 */
export type ITheme = 'light' | 'dark';

/**
 * 自动主题类型
 * 用于表示主题可以根据系统或页面设置自动调整
 */
export type IThemeAuto = 'auto';
