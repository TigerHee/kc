// import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { toast } from './index';
import { Button } from '../button';

window.toast = toast; // Expose toast globally for testing

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Toast',
  // component: Toast,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  tags: ['!autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
  // https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
};// satisfies Meta<typeof Toast>;

export default componentMeta;

// type Story = StoryObj<typeof componentMeta>;

export function ShowCase() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button
        onClick={() => toast.info('This is an info toast!')}>
          Info</Button>
      <Button
        type="primary"
        onClick={() => toast.success('Action was successful!')}>
          Success</Button>
      <Button
        type="outlined"
        onClick={() => toast.warning('Something may need attention.')}>
          Warning</Button>
      <Button
        type="danger"
        onClick={() => toast.error('Something went wrong!')}>
          Error</Button>
    </div>
  );
}

export function PromiseToast() {
  const onPromiseClick = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('Promise resolved successfully!');
        }, 2000);
      }),
      {
        loading: 'Loading...',
        success: (res) => `Success: ${res}`,
        error: (err) => `Error: ${err.message || 'Something went wrong!'}`,
      }
    )
  }
  return (
    <div style={{ display: 'flex', gap: 12, margin: '12px 0', flexWrap: 'wrap' }}>
      <Button
        type="primary"
        onClick={onPromiseClick}>
          Trigger Promise Toast</Button>
      <Button
        type="danger"
        onClick={() => toast.remove()}>
          Remove All Toasts</Button>
      <Button
        type="outlined"
        sync
        onClick={() => toast('This is a simple toast message!')}>
          Show Simple Toast</Button>
      <Button
        type="outlined"
        sync
        onClick={() => toast('This is a custom class toast!', { className: 'custom-toast', duration: 5000 })}>
          Show Custom Class Toast</Button>
      <Button
        sync
        type="outlined"
        onClick={() => toast('This toast will not auto-close', { duration: 0 })}>
          Show Non-Auto-Closable Toast</Button>
    </div>
  );
}

export function PersistToast() {
  const toastRef = useRef('');

  const createNonAutoClosableToast = () => {
    if (toastRef.current) {
      toast.remove(toastRef.current);
    }
    toastRef.current = toast('This toast will not auto-close', { duration: 0 });
  };

  const removeToast = () => {
    if (toastRef.current) {
      toast.remove(toastRef.current);
      toastRef.current = '';
    }
  };


  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button
        type="outlined"
        sync
        onClick={createNonAutoClosableToast}>
          创建不会自动关闭的对话框</Button>
      <Button
        type="danger"
        sync
        onClick={removeToast}>
          关闭对话框</Button>
    </div>
  );
}
