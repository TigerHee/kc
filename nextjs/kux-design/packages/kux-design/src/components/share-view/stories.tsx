import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShareView, sharePoster, type IShareViewProps, type ISharePosterOptions } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/ShareView',
  component: ShareView,
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
} satisfies Meta<typeof ShareView>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ShareViewSimple: Story = {
  // @ts-expect-error ignore storybook type error
  args: {
    dlgTitle: 'Share this page',
    link: 'https://www.kupotech.com',
    onShared: (action: string) => {
      console.log(`User shared on ${action}`);
    },
    poster: {
      size: { width: 256, height: 454 },
      children: (
        <div
          style={{
            color: '#222',
            border: '1px solid lightgreen',
            fontSize: 24,
            textAlign: 'center',
            lineHeight: '667px',
          }}
        >
          xxxxx
        </div>
      ),
    },
  },
  render: (args: IShareViewProps) => {
    return <SimpleShareComponent {...args} />;
  },
};

function SimpleShareComponent(args: Partial<IShareViewProps>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle ShareView</button>
      {/* @ts-expect-error ignore storybook error */}
      <ShareView
        isOpen={isOpen}
        cacheId="share-view-1"
        copySuccessText="Copied to clipboard!"
        copyBtnText="Copy Link"
        saveBtnText="Save Poster"
        errorText="Error occurred, please try again later."
        onClose={() => setIsOpen(false)}
        title="Share this page"
        link="https://www.kupotech.com"
        {...args}
      />
    </div>
  );
}

export const SharePosterFunction: Story = {
  // @ts-expect-error ignore storybook type error
  args: {
    dlgTitle: 'Share this page',
    link: 'https://www.kupotech.com',
    // onShared: (action: string) => {
    //   console.log(`User shared on ${action}`);
    // },
    poster: {
      size: { width: 256, height: 454 },
      children: 'xxxxx',
    },
    ads: [
      {
        id: 43203523,
        title: 'basic-share-referral-web-gl-content',
        url: 'https://www.kucoin.com/zh-hant/markets',
        imageUrl:
          'https://asset-v2.kucoin.net/kucoin-sitoperation-center/renderImage/685e4760a71cc2000180a21a_685e444f655415000167a7b1_ZH_HK_night.png',
      },
      {
        id: 6477,
        title: '分享组件-新增广告位-TOC- Mason-web',
        url: 'https://www.kucoin.com/platform/earn-crypto-rewards-by-referring?loading=2&appNeedLang=true?utm_source=cashgift',
        imageUrl:
          'https://assets.staticimg.com/cms/media/7iq16xGW95EaXSbin6LSGyCxGK3KmpT2Mv4aqFP7Z.png',
      },
    ],
    // content: <div style={{height: 300, backgroundColor: 'lightblue'}}> content </div>
  },
  render: (args: ISharePosterOptions) => {
    return <ShareWithFunction {...args} />;
  },
};

function ShareWithFunction(props: Partial<ISharePosterOptions>) {
  const onClick = () => {
    sharePoster({
      title: 'Share this page',
      cacheId: 'share-view-2',
      errorText: 'Error occurred, please try again later.',
      copyBtnText: 'Copy Link',
      saveBtnText: 'Save Poster',
      copySuccessText: 'Copied to clipboard!',
      link: 'https://www.kupotech.com',
      poster: {
        style: { backgroundColor: '#343' },
        size: { width: 375, height: 667 },
        children: 'xxxxx',
      },
      ...props,
    });
  };
  return (
    <div>
      <button onClick={onClick}>Toggle ShareView with Function</button>
    </div>
  );
}
