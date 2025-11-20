import type { Meta, StoryObj } from '@storybook/react-vite';
import { Marquee, type IMarqueeProps } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Marquee',
  component: Marquee,
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
} satisfies Meta<typeof Marquee>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Horizontal: Story = {
  args: {
    duration: '10s',
    pauseOnHover: true,
    children: <div style={{width: 300, background: 'lightgreen'}}>Hello</div>,
  },
  render: (args: IMarqueeProps) => {
    return <Marquee {...args} />;
  },
};

export const vertical: Story = {
  args: {
    vertical: true,
    duration: '10s',
    pauseOnHover: true,
    children: <div style={{height: 300}}>Hello</div>,
  },
  render: (args: IMarqueeProps) => {
    return <Marquee {...args} />;
  },
};

