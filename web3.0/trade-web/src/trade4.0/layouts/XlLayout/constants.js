/*
 * owner: Borden@kupotech.com
 */

// TabSet Header区域高度W
export const TABSET_HEADER_HEIGHT = 32;
// TabSet最小宽度
export const TABSET_MIN_WIDTH = 280;
// 模块圆角
export const TABSET_RADIUS = 4;
// 悬浮起来的模块初始化位置偏移量
export const INIT_FLOAT_DIFF_POSITION = 24;
// 分割线宽度
export const SPLITTER_SIZE = 3;

// FlexLayout通用Global配置
export const LAYOUT_GLOBAL = {
  splitterSize: SPLITTER_SIZE, // 分割线宽度
  borderSize: TABSET_MIN_WIDTH, // 工具栏内工具弹出的宽度
  borderMinSize: TABSET_MIN_WIDTH, // 工具栏内工具弹出的宽度
  borderBarSize: 48, // 工具栏宽度
  tabEnableRename: false, // 关闭Tab双击重命名功能
  borderEnableAutoHide: true, // 开启工具栏无工具时自动隐藏
  tabSetEnableMaximize: false, // 关闭TabSet最大化功能
  tabSetMinWidth: TABSET_MIN_WIDTH, // TabSet最小高度
  tabSetMinHeight: 240, // TabSet最小高度
  tabSetTabStripHeight: TABSET_HEADER_HEIGHT, // TabSet Header区域最小高度
  // tabSetEnableClose: true, // 关闭模块上的所有Tab
};

// FlexLayout通用borders配置
export const LAYOUT_BORDERS = [
  {
    type: 'border',
    location: 'right',
    children: [],
  },
];

// 新增模块的状态值
export const CREATED_MODULE_STATUS = {
  created: 1, // 已添加
  selected: 2, // 已添加并高亮
};
