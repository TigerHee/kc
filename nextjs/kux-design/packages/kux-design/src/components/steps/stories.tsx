import type { Meta, StoryObj } from '@storybook/react-vite';
import { Steps, type IStepsProps } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Steps',
  component: Steps,
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
} satisfies Meta<typeof Steps>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    current: 0,
    status: 'default',
    children: [],
  },
  render: (args: IStepsProps) => {
    return (
      <Steps {...args}>
        <Steps.Step
          title="测试"
          description={
            <>
              <div>测试描述</div>
              <p>测试描述1</p>
              <p>测试描述2</p>
              <p>测试描述3</p>
            </>
          }
        ></Steps.Step>
        <Steps.Step
          title="报名参与活动"
          description="副文案一副文案一副文案一副文案一副文案一副文案一副文案一副文案一副文案一"
          action={{
            text: 'Verify',
            onClick: () => {
              console.log('报名参与活动');
            },
          }}
        ></Steps.Step>
        <Steps.Step title="测试3" description="描述3"></Steps.Step>
        <Steps.Step title="测试4"></Steps.Step>
        <Steps.Step title="测试5"></Steps.Step>
      </Steps>
    );
  },
};
