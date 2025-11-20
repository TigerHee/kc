import type { Meta, StoryObj } from '@storybook/react-vite';
import { Empty, STATUS_ICON_MAP } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Empty',
  component: Empty,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    theme: {
      control: {
        type: 'select',
      },
      options: ['light', 'dark', 'auto'],
      description: '主题模式,  默认 auto',
      defaultValue: 'auto',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'auto'],
      description: '组件尺寸, 默认 auto',
      defaultValue: 'auto',
    },
    title: {
      control: { type: 'text' },
      description: '状态标题',
      defaultValue: false,
    },
    description: {
      control: { type: 'text' },
      description: '状态描述',
      defaultValue: false,
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
  // https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Empty>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ShowCase: Story = {
  // @ts-expect-error ignore
  args: {
    // name: 'warn',
    theme: 'auto', // 'light' | 'dark' | 'auto'
    size: 'auto', // 'small' | 'medium' | 'auto'
    immediate: false, // 是否立即渲染动画, 为 false 则会等到页面 LCP 就绪后再渲染动画
  },
  render: (args) => {
    return (
      <div style={{ display: 'flex',  flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        {
          Object.keys(STATUS_ICON_MAP).map((key) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Empty
                {...args}
                name={key as keyof typeof STATUS_ICON_MAP}
                title={key}
                description={` ${key} 描述`}
              />
            </div>
          ))
        }
      </div>
    )
  },
};


export const IconPlayground: Story = {
  args: {
    name: 'warn',
    theme: 'auto',
    size: 'auto',
  },
};
