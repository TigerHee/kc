import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexGrid, type IFlexGridProps } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/FlexGrid',
  component: FlexGrid,
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
} satisfies Meta<typeof FlexGrid>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    columns: 3,
    gap: { row: 12, column: 24 },
    rowAlign: 'flex-start',
    children: Array.from({ length: 10 }, (_, index) => (
      <div
        key={index}
        style={{
          width: '100%',
          height: 50 + Math.floor(Math.random() * 50),
          backgroundColor: '#' + Math.random().toString(16).slice(2, 8).padEnd(6, '0'),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Item {index + 1}
      </div>
    )),
  },
  render: (args: IFlexGridProps) => {
    return <FlexGrid {...args} />;
  },
};

