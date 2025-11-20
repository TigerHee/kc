import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Alert',
  // component: Toast,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    duration: {
      control: { type: 'number' },
      description: '自定义持续时间，默认是 4000 毫秒',
    },
    message: {
      control: { type: 'text' },
      description: '自定义消息内容',
    },
    type: {
      control: { type: 'select' },
      options: ['success', 'error', 'info', 'warning'],
      description: '自定义消息类型, 默认是 "info"',
    },
    showClose: {
      control: { type: 'boolean' },
      description: '是否显示关闭图标。即便不设置，当duration为0时也会显示',
    },
    className: {
      control: { type: 'text' },
      description: '自定义类名',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'basic'],
      description: '尺寸',
    },
    onShow: {
      action: 'onShow',
      description: '显示回调',
    },
    onHide: {
      action: 'onHide',
      description: '隐藏回调',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
  // https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Alert>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

export const ShowCase: Story = {
  args: {
    duration: 0,
    message: 'This is a message',
    type: 'info',
    size: 'basic',
    showClose: true,
    onShow: () => {},
    onHide: () => {},
    className: '',
  },
  render: (args) => {
    return (
      <div>
        <span>Tips: 实际使用时 duration 默认为4000ms</span>
        <h4>普通尺寸，size=basic</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Alert
            {...args}
            type="info"
            message="Incorrect password. You have 4 more chances to input the correct password."
          />
          <Alert
            {...args}
            type="success"
            message="Incorrect password. You have 4 more chances to input the correct password.Incorrect password. You have 4 more chances to input the correct password."
          />
          <Alert
            {...args}
            type="error"
            message="Incorrect password. You have 4 more chances to input the correct password."
          />
          <Alert
            {...args}
            type="warning"
            message="Incorrect password. You have 4 more chances to input the correct password."
          />
        </div>
        <h4>小尺寸，size=small</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          <Alert
            {...args}
            type="info"
            size="small"
            message="Incorrect password. You have 4 more chances to input the correct password."
          />
          <Alert
            {...args}
            type="success"
            size="small"
            message="Incorrect password. You have 4 more chances to input the correct password.Incorrect password. You have 4 more chances to input the correct password."
          />
          <Alert
            {...args}
            type="error"
            size="small"
            message="Incorrect password. You have 4 more chances to input the correct password."
          />
          <Alert
            {...args}
            type="warning"
            size="small"
            message="Incorrect password. You have 4 more chances to input the correct password."
          />
        </div>
        <h4>没有关闭图标</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          <Alert
            {...args}
            showClose={false}
            type="info"
            size="small"
            message="Incorrect password. You have 4 more chances to input the correct password."
          />
          <Alert
            {...args}
            showClose={false}
            type="success"
            size="small"
            message="Incorrect password. You have 4 more chances to input the correct password.Incorrect password. You have 4 more chances to input the correct password."
          />
          <Alert
            {...args}
            showClose={false}
            type="error"
            size="small"
            message="Incorrect password. You have 4 more chances to input the correct password."
          />
          <Alert
            {...args}
            showClose={false}
            type="warning"
            size="small"
            message="Incorrect password. You have 4 more chances to input the correct password."
          />
        </div>
      </div>
    );
  },
};
