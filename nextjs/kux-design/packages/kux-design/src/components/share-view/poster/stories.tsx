import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useRef, forwardRef } from 'react';
import { Poster } from './index';
import { PosterFooter, renderFooter } from './footer';
import { saveFile, convertNode2image } from './utils';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/ShareView/Poster',
  component: Poster,
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
} satisfies Meta<typeof Poster>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const PosterPreview: Story = {
  args: {
    size: { width: 256, height: 454 },
    children: 'xxxxx',
  },
  render: (args) => {
    return <PosterContent {...args} />;
  },
};

const PosterContent = forwardRef(function PosterContent(_, ref: React.Ref<HTMLDivElement>) {
  return <Poster
      ref={ref}
      style={{backgroundColor: '#343'}}
      size={{ width: 256, height: 454 }}
      footer={{title: 'this is sss', subtitle: 'this is subtitle'}}
      background='https://images.unsplash.com/photo-1588938131406-681651a3f7fa?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      >
      <h1 style={{color: 'red'}}>Poster</h1>
    </Poster>
})

export const PosterSave: Story = {
  args: {
    size: { width: 256, height: 454 },
    children: 'xxxxx',
  },
  render: (args) => {
    return <PosterSaveView {...args} />;
  },
};

function PosterSaveView() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div>
      <PosterContent ref={ref} />
      <button onClick={() => {
        console.log(ref.current)
        convertNode2image(
          ref.current!,
          { size: { width: 256, height: 454 }, cacheId: 'poster' },
        ).then(canvas => {
          saveFile(canvas, 'poster');
        })
      }}>Save</button>
    </div>
  )
}



// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Footer: Story = {
  args: {
    size: { width: 256, height: 454 },
    children: 'xxxxx',
  },
  render: (args) => {
    return <PosterFooter
      {...args}
      link={location.href}
      title="this is sss"
      subtitle='this is subtitle'
      />;
  },
};


export const FooterRender: Story = {
  args: {
    size: { width: 256, height: 454 },
    children: 'xxxxx',
  },
  render: () => {
    return (
      <>
      {renderFooter({title: 'this is sss', subtitle: 'this is subtitle'}, {link: location.href})}
      {renderFooter(<h1>This is custom footer</h1>, {link: location.href})}
      </>
    )
  },
};

