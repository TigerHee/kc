import type { Meta, StoryObj } from '@storybook/react-vite';
import { Statistic, type IStatisticProps } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Statistic',
  component: Statistic,
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
} satisfies Meta<typeof Statistic>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    /** 终值 */
    value: 11111526763.8898,
    /** 时长 */
    duration: 0,
    suffix: 'BTC',
    prefix: '+',
    decimals: 1
  },
  render: (args: IStatisticProps) => {
    return <div style={{ display: 'flex', gap: '60px' }}>
      <Statistic {...args} hideAmount />
      <Statistic {...args} value={123.46} decimals={2} />
      <Statistic style={{fontSize: 32}} {...args} duration={0} decimals={undefined} />
      <Statistic {...args} style={{fontSize: 42}} duration={3000} value={-12456.48} prefix={null} />
    </div>;
  },
};

