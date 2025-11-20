import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MaskContainer } from './index';
import { Button } from '../button';
import type { IMaskContainerProps } from './index';

const meta = {
  title: 'base/MaskContainer',
  component: MaskContainer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    className: { control: 'text' },
    style: { control: 'object' }
  },
} satisfies Meta<typeof MaskContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

// 基础示例组件
const BasicDemo = (args: IMaskContainerProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setVisible(true)}>显示蒙层</Button>
      {visible && (
        <MaskContainer 
          {...args} 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setVisible(false)}
        >
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
          }}>
            点击蒙层关闭
          </div>
        </MaskContainer>
      )}
    </div>
  );
};

// 基础示例
export const Basic: Story = {
  render: (args) => <BasicDemo {...args} />,
};

// 多层蒙层示例的展示组件
const MultipleLayerDemo = (args: IMaskContainerProps) => {
  const [layer1, setLayer1] = useState(false);
  const [layer2, setLayer2] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setLayer1(true)} style={{ marginRight: 8 }}>显示蒙层1</Button>
      <Button type="primary" onClick={() => setLayer2(true)}>显示蒙层2</Button>
      
      {layer1 && (
        <MaskContainer 
          {...args}
          style={{ 
            backgroundColor: 'rgba(255,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setLayer1(false)}
        >
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 12px' }}>第一层蒙层</h3>
            <p style={{ margin: '0 0 12px' }}>z-index: 较低</p>
            <Button onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setLayer2(true);
            }}>打开第二层蒙层</Button>
          </div>
        </MaskContainer>
      )}
      
      {layer2 && (
        <MaskContainer
          {...args}
          style={{ 
            backgroundColor: 'rgba(0,0,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setLayer2(false)}
        >
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 12px' }}>第二层蒙层</h3>
            <p style={{ margin: '0 0 12px' }}>z-index: 自动递增</p>
            <Button onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setLayer2(false);
            }}>关闭</Button>
          </div>
        </MaskContainer>
      )}
    </div>
  );
};

// 多层蒙层示例
export const MultipleLayer: Story = {
  args: {},
  render: (args) => <MultipleLayerDemo {...args} />,
};

// 自定义样式示例组件
const CustomStyleDemo = (args: IMaskContainerProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setVisible(true)}>显示自定义样式蒙层</Button>
      {visible && (
        <MaskContainer 
          {...args}
          isOpen={visible}
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setVisible(false)}
        >
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <h2 style={{ margin: '0 0 16px' }}>自定义样式示例</h2>
            <p style={{ margin: '0 0 20px', color: '#666' }}>
              可以自定义背景色、渐变、动画等样式，实现各种蒙层效果
            </p>
            <Button onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setVisible(false);
            }}>关闭</Button>
          </div>
        </MaskContainer>
      )}
    </div>
    <div style={{ padding: 20, marginTop: 20, height: '150vh' }}>
      <p>滚动页面查看蒙层效果</p>
    </div>
    </div>
  );
};

// 自定义样式示例
export const CustomStyle: Story = {
  render: (args) => <CustomStyleDemo {...args} />,
};

