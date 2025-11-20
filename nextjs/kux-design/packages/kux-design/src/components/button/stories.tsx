import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ShareIcon, TradeAddIcon, ArrowRight2Icon } from '@kux/iconpack';
import { Button } from './index';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
    delay: 4000,
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    startIcon: { control: false },
    endIcon: { control: false },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    style: { control: false },
    block: { control: 'boolean' },
    href: { control: 'text' },
    className: { control: false },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
  // https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ShowCase: Story = {
  args: {
    children: 'Button',
    endIcon: <ShareIcon size="small" />,
  },
  render: (args) => {
    return (
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="primary" size="mini" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="primary" size="small" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="primary" size="basic" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="primary" size="large" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="primary" size="huge" startIcon={<TradeAddIcon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="primary" disabled size="mini" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="primary" disabled size="small" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="primary" disabled size="basic" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="primary" disabled size="large" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="primary" disabled size="huge" startIcon={<TradeAddIcon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="primary" size="mini">
            Button
          </Button>
          <Button type="primary" size="small">
            Button
          </Button>
          <Button type="primary" size="basic">
            Button
          </Button>
          <Button type="primary" size="large">
            Button
          </Button>
          <Button type="primary" size="huge">
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="primary" disabled size="mini">
            Button
          </Button>
          <Button type="primary" disabled size="small">
            Button
          </Button>
          <Button type="primary" disabled size="basic">
            Button
          </Button>
          <Button type="primary" disabled size="large">
            Button
          </Button>
          <Button type="primary" disabled size="huge">
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="primary" loading size="mini">
            Button
          </Button>
          <Button type="primary" loading size="small">
            Button
          </Button>
          <Button type="primary" loading size="basic">
            Button
          </Button>
          <Button type="primary" loading size="large">
            Button
          </Button>
          <Button type="primary" loading size="huge">
            Button
          </Button>
        </div>
         {/* ------------------------ default ------------------------ */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="default" size="mini" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="default" size="small" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="default" size="basic" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="default" size="large" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="default" size="huge" startIcon={<TradeAddIcon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="default" disabled size="mini" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="default" disabled size="small" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="default" disabled size="basic" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="default" disabled size="large" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="default" disabled size="huge" startIcon={<TradeAddIcon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="default" size="mini">
            Button
          </Button>
          <Button type="default" size="small">
            Button
          </Button>
          <Button type="default" size="basic">
            Button
          </Button>
          <Button type="default" size="large">
            Button
          </Button>
          <Button type="default" size="huge">
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="default" disabled size="mini">
            Button
          </Button>
          <Button type="default" disabled size="small">
            Button
          </Button>
          <Button type="default" disabled size="basic">
            Button
          </Button>
          <Button type="default" disabled size="large">
            Button
          </Button>
          <Button type="default" disabled size="huge">
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="default" loading size="mini">
            Button
          </Button>
          <Button type="default" loading size="small">
            Button
          </Button>
          <Button type="default" loading size="basic">
            Button
          </Button>
          <Button type="default" loading size="large">
            Button
          </Button>
          <Button type="default" loading size="huge">
            Button
          </Button>
        </div>

        {/* ------------------------ outline ------------------------ */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="outlined" size="mini" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="outlined" size="small" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="outlined" size="basic" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="outlined" size="large" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="outlined" size="huge" startIcon={<TradeAddIcon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="outlined" disabled size="mini" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="outlined" disabled size="small" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="outlined" disabled size="basic" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="outlined" disabled size="large" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="outlined" disabled size="huge" startIcon={<TradeAddIcon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="outlined" size="mini">
            Button
          </Button>
          <Button type="outlined" size="small">
            Button
          </Button>
          <Button type="outlined" size="basic">
            Button
          </Button>
          <Button type="outlined" size="large">
            Button
          </Button>
          <Button type="outlined" size="huge">
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="outlined" disabled size="mini">
            Button
          </Button>
          <Button type="outlined" disabled size="small">
            Button
          </Button>
          <Button type="outlined" disabled size="basic">
            Button
          </Button>
          <Button type="outlined" disabled size="large">
            Button
          </Button>
          <Button type="outlined" disabled size="huge">
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="outlined" loading size="mini">
            Button
          </Button>
          <Button type="outlined" loading size="small">
            Button
          </Button>
          <Button type="outlined" loading size="basic">
            Button
          </Button>
          <Button type="outlined" loading size="large">
            Button
          </Button>
          <Button type="outlined" loading size="huge">
            Button
          </Button>
        </div>

        {/*  danger */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="danger" size="mini" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="danger" size="small" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="danger" size="basic" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="danger" size="large" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="danger" size="huge" startIcon={<TradeAddIcon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="danger" disabled size="mini" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="danger" disabled size="small" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="danger" disabled size="basic" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="danger" disabled size="large" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="danger" disabled size="huge" startIcon={<TradeAddIcon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="danger" size="mini">
            Button
          </Button>
          <Button type="danger" size="small">
            Button
          </Button>
          <Button type="danger" size="basic">
            Button
          </Button>
          <Button type="danger" size="large">
            Button
          </Button>
          <Button type="danger" size="huge">
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="danger" disabled size="mini">
            Button
          </Button>
          <Button type="danger" disabled size="small">
            Button
          </Button>
          <Button type="danger" disabled size="basic">
            Button
          </Button>
          <Button type="danger" disabled size="large">
            Button
          </Button>
          <Button type="danger" disabled size="huge">
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="danger" loading size="mini">
            Button
          </Button>
          <Button type="danger" loading size="small">
            Button
          </Button>
          <Button type="danger" loading size="basic">
            Button
          </Button>
          <Button type="danger" loading size="large">
            Button
          </Button>
          <Button type="danger" loading size="huge">
            Button
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="text" size="mini" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="text" size="small" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="text" size="basic" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="text" size="large" startIcon={<TradeAddIcon />}>
            Button
          </Button>
          <Button type="text" size="huge" startIcon={<TradeAddIcon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="text" size="mini" endIcon={<ArrowRight2Icon />}>
            Button
          </Button>
          <Button type="text" size="small" endIcon={<ArrowRight2Icon />}>
            Button
          </Button>
          <Button type="text" size="basic" endIcon={<ArrowRight2Icon />}>
            Button
          </Button>
          <Button type="text" size="large" endIcon={<ArrowRight2Icon />}>
            Button
          </Button>
          <Button type="text" size="huge" endIcon={<ArrowRight2Icon />}>
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="text" size="mini">
            Button
          </Button>
          <Button type="text" size="small">
            Button
          </Button>
          <Button type="text" size="basic">
            Button
          </Button>
          <Button type="text" size="large">
            Button
          </Button>
          <Button type="text" size="huge">
            Button
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button type="primary-text" size="mini">
            Button
          </Button>
          <Button type="primary-text" size="small">
            Button
          </Button>
          <Button type="primary-text" size="basic">
            Button
          </Button>
          <Button type="primary-text" size="large">
            Button
          </Button>
          <Button type="primary-text" size="huge">
            Button
          </Button>
        </div>
      </div>
    );
  },
};
export const Block: Story = {
  args: {
    type: 'outlined',
    children: '容器有多宽我就有多宽',
    size: 'large',
    block: true,
  },
};
export const Loading: Story = {
  args: {
    type: 'primary',
    animate: true,
    async: true,
    // @ts-expect-error - This is a test
    onClick: async () => {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },
    children: '如果回调是Promise，则按钮会自动loading',
    startIcon: <ShareIcon size="small"/>,
  },
};
export const LongText: Story = {
  args: {
    type: 'default',
    size: 'small',
    endIcon: <ShareIcon size="small" />,
    children: '这是一个长文本的Button组件。如果你还是不信，那我就再说一遍',
  },
};
