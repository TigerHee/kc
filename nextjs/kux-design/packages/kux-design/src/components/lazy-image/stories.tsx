import type { Meta, StoryObj } from '@storybook/react-vite';
import { LazyImage } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/LazyImage',
  component: LazyImage,
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
} satisfies Meta<typeof LazyImage>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    src: 'https://assets.staticimg.com/kc-v2-seo-content-eco/202406/6673f1bda404930001aad04a_MicrosoftTeams-image%20%2848%29.png',
  },
};

export const ErrorLoading: Story = {
  args: {
    src: '123',
  },
};


