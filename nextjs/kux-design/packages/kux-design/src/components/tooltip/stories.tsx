import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './index';
import { Button } from '../button';
import { setup } from '@/setup'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Tooltip',
  component: Tooltip,
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
} satisfies Meta<typeof Tooltip>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

setup({
  getOkText: () =>'okk'
})

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ShowCase: Story = {
  args: {
    placement: 'top',
    content: 'This is a popover!This is a popover!This is a popover!This is a popover!',
  },
  render: (args) => {
    return (
      <div style={{height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
        <Tooltip
          content={args.content}
          trigger="click"
          colors={{ background: 'yellow', border: 'green' }}
          placement={args.placement!}
          className='custom-tooltip'
          showArrow={false}
          onShow={() => {console.log('Tooltip show')}}
          onHide={() => {console.log('Tooltip hide')}}
        >
          <Button type='primary'>无箭头</Button>
        </Tooltip>

        <Tooltip
          content={args.content}
          trigger="click"
          colors={{ background: 'yellow', border: 'green' }}
          placement={args.placement!}
          className='custom-tooltip'
          onShow={() => {console.log('Tooltip show')}}
          onHide={() => {console.log('Tooltip hide')}}
        >
          <Button type='primary'>click me</Button>
        </Tooltip>
      </div>
    );
  },
};
