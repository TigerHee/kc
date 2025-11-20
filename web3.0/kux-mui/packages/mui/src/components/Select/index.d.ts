/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import * as PopperJS from '@popperjs/core';

export type ISelectValue = string | number;
export interface IClassNamesType {
  // 容器
  container?: string;

  // 选择框
  select?: string;

  // 清除按钮
  clearIcon?: string;

  // 下拉选择的容器
  dropdownContainer?: string;

  // 下拉选择每一项的容器
  optionItem?: string;

  // 搜索框的placeholder
  searchPlaceholder?: string;

  // placeholder
  placeholder?: string;
}

type ILableRenderType = (isInSelectInput: boolean, selected: boolean) => React.ReactNode;
export interface IOptionItem {
  // 每个选项的内容，可以传JSX或render function：参数isInSelectInput代表是否在select输入框中，参数selected代表是否选中
  label: React.ReactNode | ILableRenderType;

  // 每个选项的值
  value: ISelectValue;

  // 用于筛选每个选项的参数（如果要启用allowSearch，务必填写次参数）
  title?: string;
}
export interface IOptionGroupItem {
  // 每个选项的内容，可以传JSX
  label: React.ReactNode | ILableRenderType;

  // 每个组的选项
  options: IOptionItem[];
}

export type IFilterOptionType = (searchStr: string, option: IOptionItem) => boolean;

export interface ISelectProps {
  /**
   * 选项的值
   */
  value?: ISelectValue;

  /**
   * 选择框内容变化时的回调
   */
  onChange?: React.MouseEventHandler<HTMLInputElement>;

  /**
   * 选择框的大小，默认为basic
   */
  size: 'small' | 'medium' | 'large' | 'xlarge';

  /**
   * 选择框的空值提示语
   */
  placeholder?: React.ReactNode;

  /**
   * 是否为错误状态的布尔值，默认为false
   */
  error?: boolean;

  /**
   * 是否展示可以清除内容的图标
   */
  allowClear?: boolean;

  /**
   * 选择时，是否展示搜索框
   */
  allowSearch?: boolean;

  /**
   * 是否禁用，true时无法打开下拉选择
   */
  disabled?: boolean;

  /**
   * 是否展示加载中状态，true时无法打开下拉选择
   */
  loading?: boolean;

  /**
   * 展示搜索框时，搜索框的提示语
   */
  searchPlaceholder?: React.ReactNode;

  /**
   * 是否让选择器匹配最大宽度，默认为true
   */
  fullWidth?: boolean;

  /**
   * 选择框类型，默认值为单选，即single（目前暂不支持multiple）
   */
  type?: 'single' | 'multiple';

  /**
   * 用于定制组件每个组成部分的样式
   * 注意：样式如果与组件已存在样式重复时，样式需要加!important
   */
  classNames?: IClassNamesType;

  /**
   * 选择器选项配置列表
   */
  options: (IOptionItem | IOptionGroupItem)[];

  /**
   * 用于定位下拉选项的DOM
   */
  reference?: HTMLElement;

  /**
   * 下拉选项宽度是否与定位DOM相同宽度，默认为true
   */
  matchWidth?: boolean;

  /**
   * 自定义的筛选函数
   */
  filterOption?: IFilterOptionType;

  /**
   * 下拉选择的显示位置
   */
  placement?: PopperJS.Placement;

  /**
   * 下拉选择自动滚动至选中的项，默认开启，值为true
   */
  autoScrollToSelected?: boolean;

  /**
   * 下拉选择器选项前渲染的内容
   */
  dropdownAddonBefore?: React.ReactNode;

  /**
   * 下拉选择器选项后渲染的内容
   */
  dropdownAddonAfter?: React.ReactNode;

  /**
   * 允许dropdown点击事件向上冒泡，默认为false
   */
  allowDropdownClickPropagation?: boolean;

  /**
   * 数据为空时的展示内容
   */
  emptyContent?:
    | boolean
    | { size?: 'small' | 'large'; text?: React.ReactNode; description?: React.ReactNode }
    | React.ReactNode;

  /**
   * 下拉选择器选项前渲染的内容的高度
   */
  dropdownAddonBeforeHeight?: number;

  /**
   * 下拉选择器选项后渲染的内容的高度
   */
  dropdownAddonAfterHeight?: number;

  /**
   * 下拉框的高度，默认为256
   */
  dropdownHeight?: number;

  /**
   * 每个选项的高度，默认和选择框高度相同
   */
  listItemHeight?: number;

  /**
   * 选择器失去焦点事件（也就是关闭了下拉框）的回调
   */
  onBlur?(): void;

  /**
   * 选择器获取焦点事件（也就是打开了下拉框）的回调
   */
  onFocus?(): void;

  /**
   * 是否支持多选
   */
  multiple?: boolean;
}

declare const Select: React.ForwardRefRenderFunction<HTMLDivElement, ISelectProps>;

export default Select;
