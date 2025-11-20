import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapse, type ICollapseProps } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Collapse',
  component: Collapse,
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
} satisfies Meta<typeof Collapse>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    accordion: true,
    items: [
      {
        key: '1',
        title: 'Panel 1',
        content: 'Content 1',
      },
      {
        key: '2',
        title: 'Panel 2',
        content: 'Content 2',
      },
      {
        key: '3',
        title: 'Panel 3',
        content: 'Content 3',
      }
    ]
  },
  render: (args: ICollapseProps) => {
    // const [newArgs, updateArgs] = useArgs<ICollapseProps>();
    return <Collapse {...args} />;
  },
};



// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const UseChildren: Story = {
  args: {
    accordion: false,
    children: (<>
      <Collapse.Panel
        key="1"
        header="Panel 1"
        content="Content 1"
      />
      <Collapse.Panel
        key="2"
        header="Panel 2"
        content="Content 2"
      />
      <Collapse.Panel
        key="3"
        header="Panel 3"
        content="Content 3"
      />
    </>)
  },
  render: (args: ICollapseProps) => {
    // const [newArgs, updateArgs] = useArgs<ICollapseProps>();
    return <Collapse {...args} />;
  },
};

