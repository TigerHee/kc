import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './index';
import { DisplayBox } from './display/box';
import { IInputProps } from './type';
import { useState } from 'react';
import { CopyIcon } from '@kux/iconpack';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Input',
  component: Input,
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
} satisfies Meta<typeof Input>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

const IInput = (props: IInputProps) => {
  const [value, setValue] = useState(props.defaultValue || '');

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        console.log('e.target.value :>> ', e.target.value);
        setValue(e.target.value);
      }}
    />
  );
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ShowCase: Story = {
  args: {},
  render: () => {
    return (
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* base */}
        <DisplayBox>
          <IInput name="medium" />
          <IInput name="medium" size="small" />
        </DisplayBox>

        {/* size */}
        <DisplayBox>
          <IInput name="medium" label="Title" />
          <IInput name="medium" size="small" label="Title" />
        </DisplayBox>

        {/* shrink */}
        <DisplayBox>
          <IInput name="medium" label="Title" labelProps={{ shrink: true }} />
          <IInput name="medium" size="small" label="Title" labelProps={{ shrink: true }} />
        </DisplayBox>

        {/* error */}
        <DisplayBox>
          <IInput name="medium" error statusInfo="error reason" label="Title" />
          <IInput name="medium" size="small" error statusInfo="error reason" label="Title" />
        </DisplayBox>
        {/* placeholder */}
        <DisplayBox>
          <IInput
            name="suffix"
            placeholder="أدخل النص هنا"
            label="Title"
            suffix="USDT"
            addonAfter="Max"
          />
          <IInput
            name="suffix"
            placeholder="Place Holder"
            label="Title"
            suffix="USDT"
            addonAfter="Max"
            size="small"
          />
        </DisplayBox>
        {/* disabled */}
        <DisplayBox>
          <IInput
            name="suffix"
            placeholder="Place Holder"
            disabled
            label="Title"
            suffix="USDT"
            addonAfter="Max"
          />
          <IInput
            name="suffix"
            placeholder="Place Holder"
            disabled
            size="small"
            label="Title"
            suffix="USDT"
            addonAfter="Max"
          />
        </DisplayBox>

        {/* suffix */}
        <DisplayBox>
          <IInput name="suffix" label="Title" suffix="USDT" addonAfter="Max" />
          <IInput name="suffix" label="Title" suffix="USDT" addonAfter="Max" size="small" />
        </DisplayBox>
        <DisplayBox>
          <IInput
            name="suffix"
            label="Title"
            suffix={<CopyIcon size={20} />}
            addonAfter="Paste"
            reverseSuffix
          />
          <IInput
            name="suffix"
            size="small"
            label="Title"
            suffix={<CopyIcon size={20} />}
            addonAfter="Paste"
            reverseSuffix
          />
        </DisplayBox>

        {/* label outline */}
        <DisplayBox>
          <IInput
            name="outline"
            placeholder="Place Holder"
            labelProps={{
              position: 'outline',
            }}
            suffix="USDT"
            addonAfter="Max"
          />
          <IInput
            name="outline"
            placeholder="Place Holder"
            size="small"
            labelProps={{
              position: 'outline',
            }}
            suffix="USDT"
            addonAfter="Max"
          />
        </DisplayBox>
        <DisplayBox>
          <IInput
            name="outline"
            placeholder="Place Holder"
            error
            statusInfo="error reason"
            label="Error"
            labelProps={{
              position: 'outline',
            }}
            suffix="USDT"
            addonAfter="Max"
          />
          <IInput
            name="outline"
            placeholder="Place Holder"
            error
            size="small"
            label="Error"
            statusInfo="error reason"
            labelProps={{
              position: 'outline',
            }}
            suffix="USDT"
            addonAfter="Max"
          />
        </DisplayBox>
        <DisplayBox>
          <IInput
            name="outline"
            placeholder="Place Holder"
            error
            disabled
            statusInfo="error reason"
            labelProps={{
              position: 'outline',
            }}
            suffix="USDT"
            addonAfter="Max"
          />
          <IInput
            name="outline"
            placeholder="Place Holder"
            error
            disabled
            size="small"
            statusInfo="error reason"
            labelProps={{
              position: 'outline',
            }}
            suffix="USDT"
            addonAfter="Max"
          />
        </DisplayBox>

        {/* loading */}
        <DisplayBox>
          <IInput
            name="loading"
            placeholder="Place Holder"
            loading
            label="loading"
            labelProps={{
              position: 'inline',
            }}
          />
          <IInput
            name="loading"
            size="small"
            loading
            addonAfter="AddonAfter"
            placeholder="Place Holder"
            label="loading"
            labelProps={{
              position: 'inline',
            }}
          />
        </DisplayBox>
        {/* password */}
        <DisplayBox>
          <IInput
            name="password"
            type="password"
            label="password"
            labelProps={{
              position: 'inline',
            }}
          />
          <IInput
            name="password-small"
            size="small"
            type="password"
            addonAfter="password"
            label="password"
            labelProps={{
              position: 'inline',
            }}
          />
        </DisplayBox>

        {/* Search */}
        <DisplayBox>
          <IInput type="search" placeholder="Search" />
          <IInput type="search" placeholder="Search" size="small" />
        </DisplayBox>
        <DisplayBox>
          <IInput type="search" placeholder="Search" allowClear defaultValue={123123123} />
          <IInput
            type="search"
            placeholder="Search"
            size="small"
            allowClear
            defaultValue={123123123}
          />
        </DisplayBox>
        <DisplayBox>
          <IInput type="search" placeholder="Search" size="mini" />
          <IInput type="search" placeholder="Search" size="mini" allowClear />
        </DisplayBox>
      </section>
    );
  },
};
