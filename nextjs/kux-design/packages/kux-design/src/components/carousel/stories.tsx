import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Carousel',
  component: Carousel,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    visibleCount: {
      control: { type: 'number', min: 1, max: 5 },
      description: '同时可见的元素数量',
    },
    gap: {
      control: { type: 'number', min: 0, max: 100 },
      description: '元素间距',
    },
    hideIndicators: {
      control: 'boolean',
      description: '是否隐藏分页指示器',
    },
    hideControls: {
      control: 'boolean',
      description: '是否隐藏控制按钮',
    },
    autoplay: {
      control: 'boolean',
      description: '是否自动播放',
    },
    autoplayInterval: {
      control: { type: 'number', min: 1000, max: 10000, step: 500 },
      description: '自动播放间隔（毫秒）',
    },
  },
} satisfies Meta<typeof Carousel>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// 基本用法
export const Basic: Story = {
  args: {
    style: { margin: '0 100px' },
    children: Array.from({ length: 5 }, (_, index) => (
      <div key={index} style={{
        height: '200px',
        backgroundColor: `hsl(${index * 60}, 80%, 80%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: '#666',
      }}>
        Item {index + 1}
      </div>
    )),
  },
};

// 多个可见元素
export const MultipleVisible: Story = {
  args: {
    visibleCount: 3,
    gap: 20,
    style: { margin: '0 100px' },
    children: Array.from({ length: 7 }, (_, index) => (
      <div key={index} style={{
        height: '150px',
        backgroundColor: `hsl(${index * 60}, 70%, 85%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: '#666',
        borderRadius: '8px',
      }}>
        Item {index + 1}
      </div>
    )),
  },
};

// 自动播放
export const AutoPlay: Story = {
  args: {
    autoplay: true,
    autoplayInterval: 2000,
    style: { margin: '0 100px' },
    children: Array.from({ length: 4 }, (_, index) => (
      <div key={index} style={{
        height: '200px',
        backgroundColor: `hsl(${index * 90}, 70%, 85%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: '#666',
        borderRadius: '8px',
      }}>
        Autoplay Item {index + 1}
      </div>
    )),
  },
};

