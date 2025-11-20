import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Text } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Text',
  component: Text,
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
} satisfies Meta<typeof Text>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    children: '文本',
    as: 'h1'
  },
  render: (args) => {
    return (
      <>
        <Text {...args} />
        <Text as='a' href='https://www.kucoin.com'>这是个链接</Text>
      </>
    )
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('default', async () => {
      await expect(canvas.getByText(args.children)).toBeInTheDocument();
      await expect(canvas.getByRole('heading', { level: 1 })).toBeInTheDocument();

      await expect(canvas.getByRole('link')).toHaveAttribute('href', 'https://www.kucoin.com');
      await expect(canvas.getByRole('link')).toHaveTextContent('这是个链接');
    });
  }
};

