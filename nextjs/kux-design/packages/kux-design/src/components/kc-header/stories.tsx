import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, within } from 'storybook/test';

import { KcHeader, type IKcHeaderProps } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/KcHeader',
  component: KcHeader,
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
} satisfies Meta<typeof KcHeader>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: 'Hello',
  },
  render: (args: IKcHeaderProps) => {
    const [newArgs, updateArgs] = useArgs<IKcHeaderProps>();
    return <KcHeader {...newArgs} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('back', async () => {
      expect(canvas.getByTestId('back-ico')).toBeInTheDocument();
    })

    await step('share', async () => {
      expect(canvas.getByTestId('share-ico')).toBeInTheDocument();
    })
  }
};
