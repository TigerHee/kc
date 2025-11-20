/**
 * Owner: victor.ren@kupotech.com
 *
 * @description Dropdown stories
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './index';
import { Button } from '../button';

const componentMeta = {
  title: 'base/Dropdown',
  component: Dropdown,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
  // https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Dropdown>;

export default componentMeta;

// 基础下拉菜单示例
export const Basic = {
  render: () => {
    const menuItems = [
      { key: '1', label: '菜单项 1' },
      { key: '2', label: '菜单项 2' },
      { key: '3', label: '菜单项 3' },
    ];

    const overlay = (
      <div>
        {menuItems.map(item => (
          <div key={item.key} className="kux-dropdown__item">
            {item.label}
          </div>
        ))}
      </div>
    );

    return (
      <Dropdown overlay={overlay} trigger="click">
        <Button>点击显示下拉菜单</Button>
      </Dropdown>
    );
  },
};

// 悬停触发示例
export const Hover = {
  render: () => {
    const menuItems = [
      { key: '1', label: '选项 1' },
      { key: '2', label: '选项 2' },
      { key: '3', label: '选项 3' },
    ];

    const overlay = (
      <div>
        {menuItems.map(item => (
          <div key={item.key} className="kux-dropdown__item">
            {item.label}
          </div>
        ))}
      </div>
    );

    return (
      <Dropdown overlay={overlay} trigger="hover">
        <Button>悬停显示下拉菜单</Button>
      </Dropdown>
    );
  },
};

// 带分隔线的下拉菜单
export const WithDivider = {
  render: () => {
    const overlay = (
      <div>
        <div className="kux-dropdown__item">编辑</div>
        <div className="kux-dropdown__item">复制</div>
        <div className="kux-dropdown__divider"></div>
        <div className="kux-dropdown__item">删除</div>
      </div>
    );

    return (
      <Dropdown overlay={overlay} trigger="click">
        <Button>更多操作</Button>
      </Dropdown>
    );
  },
};
