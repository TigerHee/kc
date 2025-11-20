import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading, type ILoadingProps } from './index';
import { HStack, VStack } from '../stack';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Loading',
  component: Loading,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['mini', 'small', 'medium', 'large', 'custom'],
      description: '组件尺寸, 需要自定义尺寸时使用 custom, 并配合 style 来设置尺寸',
      defaultValue: 'medium',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
  // https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Loading>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ShowCase: Story = {
  args: {},
  render: (args: ILoadingProps) => {
    return (
      <>
    <div style={{display: 'flex',  gap: '20px'}}>
      <VStack align='start'>
        type = brand (默认)
        <HStack>
          <Loading size="large" />
          64 * 64 large
        </HStack>
        <HStack>
          <Loading size="medium" />
          40 * 40 默认 medium
        </HStack>
        <HStack><Loading size="small" />
          32 * 32 small
        </HStack>
        <HStack><Loading size="mini" />
          24 * 24 mini
        </HStack>
      </VStack>
      <VStack align='start'>
        type = normal, 图标颜色可使用 style.color 自定义, 当前使用品牌色
        <HStack>
          <Loading type="normal" size="large" style={{color: 'var(--kux-brandGreen)'}} />
          64 * 64 large
        </HStack>
        <HStack><Loading type="normal" size="medium" style={{color: 'var(--kux-brandGreen)'}} />
          40 * 40 默认 medium
        </HStack>
        <HStack><Loading type="normal" size="small" style={{color: 'var(--kux-brandGreen)'}} />
          32 * 32 small
        </HStack>
        <HStack><Loading type="normal" size="mini" style={{color: 'var(--kux-brandGreen)'}} />
          24 * 24 mini
        </HStack>
      </VStack>

    </div>
      <VStack >
        受控的 loading, 在 storybook controls 中调整参数来查看效果
        <Loading {...args} />
      </VStack>
      </>
    )
  },
};

