import type { Meta, StoryObj } from '@storybook/react-vite';
import { LottiePlayer } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/LottiePlayer',
  component: LottiePlayer,
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
} satisfies Meta<typeof LottiePlayer>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    // 是否立即渲染动画, 为 false 则会等到页面 LCP 就绪后再渲染动画
    // * 若页面已经渲染完毕, 即使 immediate 为false 也会立即渲染动画
    immediate: false,
    // 动画未播放前的占位图
    poster: 'https://placehold.co/200',
    // 循环播放动画
    loop: true,
    // 渲染方式
    renderer: 'svg',
    // 自动播放动画
    autoplay: true,
    // json文件路径
    path: 'https://assets.staticimg.com/marketing-growth-web/2.2.24/static/tocReferral/gift-box.json',
  },
  render: (args) => {
    return (
      <div style={{ width: '400px', height: '400px' }}>
        <LottiePlayer {...args} />
      </div>
    );
  },
};

