import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popover, PopoverContent, type IPopoverProps } from './index';
import { Button } from '../button';

// import Drew from ' /assets/drew.svg?react';
import Drew from './assets/drew.svg?react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Popover',
  component: Popover,
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
} satisfies Meta<typeof Popover>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  // @ts-expect-error ignore types
  args: {
    placement: 'top',
    content: 'This is a popover!This is a popover!This is a popover!This is a popover!',
    showArrow: true,
  },
  render: (args: IPopoverProps) => {
    return (
      <>
        <div style={{ background: 'get-theme(background)', width: '100%', height: 200 }}></div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Popover
            trigger="hover"
            colors="red"
            onShow={() => {
              console.log('is opened');
            }}
            onHide={() => {
              console.log('is closed');
            }}
            {...args}
          >
            <Button>Hover me {`${args.placement}`}</Button>
          </Popover>
          <Popover
            content={args.content}
            trigger="click"
            colors={{ background: 'yellow', border: 'green' }}
            placement="left"
          >
            <Button>Click me</Button>
          </Popover>
          {/* <Popover content={args.content} trigger="persist" placement={args.placement}>
            <Button>Persist</Button>
          </Popover> */}
          <Popover
            trigger="hover"
            placement={args.placement}
            content={<div style={{ width: '219px' }}>ssss</div>}
          >
            <Drew data-testid="kux_tasks_task_control_ico_box_draw" />
          </Popover>
        </div>
        <PopoverContent isStatic={true} {...args} />
        <div style={{ background: 'get-theme(background)', width: '100%', height: 1200 }}></div>
      </>
    );
  },
};

export const Many: Story = {
  // @ts-expect-error ignore types
  args: {
    placement: 'top',
    content: 'This is a popover!This is a popover!This is a popover!This is a popover!',
  },
  render: (args: IPopoverProps) => {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
        <Popover content={args.content} trigger="hover" colors="red" placement={args.placement}>
          <Button>Hover me {`${args.placement}`}</Button>
        </Popover>
        <Popover content={args.content} trigger="hover" colors="red" placement={args.placement}>
          <Button>Hover me {`${args.placement}`}</Button>
        </Popover>
        <Popover content={args.content} trigger="hover" colors="red" placement={args.placement}>
          <Button>Hover me {`${args.placement}`}</Button>
        </Popover>
        <Popover content={args.content} trigger="hover" colors="red" placement={args.placement}>
          <Button>Hover me {`${args.placement}`}</Button>
        </Popover>
        <Popover content={args.content} trigger="hover" colors="red" placement={args.placement}>
          <Button>Hover me {`${args.placement}`}</Button>
        </Popover>
        <Popover content={args.content} trigger="hover" colors="red" placement={args.placement}>
          <Button>Hover me {`${args.placement}`}</Button>
        </Popover>
        <Popover content={args.content} trigger="hover" colors="red" placement={args.placement}>
          <Button>Hover me {`${args.placement}`}</Button>
        </Popover>
        <Popover content={args.content} trigger="hover" colors="red" placement={args.placement}>
          <Button>Hover me {`${args.placement}`}</Button>
        </Popover>
      </div>
    );
  },
};
