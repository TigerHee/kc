import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { FixedContainer } from './index';

const componentMeta = {
  title: 'base/FixedContainer',
  component: FixedContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '一个用于创建固定定位元素的容器组件，自动处理内容高度变化，避免页面跳动。'
      }
    }
  },
  // 该组件不需要自动生成文档
  tags: ['!autodocs'],
  argTypes: {
    children: {
      description: '需要固定定位的内容',
      type: { name: 'string', required: true }
    },
    onHeightChange: {
      description: '容器高度变化时的回调函数',
      type: { name: 'function' },
      control: false
    }
  }
} satisfies Meta<typeof FixedContainer>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// 创建一个可复用的滚动内容组件
function ScrollContent() {
  return (
    <div style={{ padding: '16px' }}>
      {Array(20).fill(null).map((_, index) => (
        <div
          key={index}
          style={{
            padding: '16px',
            margin: '16px 0',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          内容区域 #{index + 1}
        </div>
      ))}
    </div>
  );
}

// 1. 基础示例：固定顶部导航栏
export const BasicNavbar: Story = {
  name: '基础示例：固定导航栏',
  args: {
    children: null
  },
  render: function BasicNavbarStory() {
    return (
      <div>
        <FixedContainer>
          <nav style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Logo</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>首页</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>产品</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>关于</a>
            </div>
          </nav>
        </FixedContainer>
        <div>
          <ScrollContent />
        </div>
      </div>
    );
  }
};

// 2. 动态高度：可展开的搜索栏
export const ExpandableSearch: Story = {
  name: '动态高度：可展开的搜索栏',
  args: {
    children: null,
    onHeightChange: undefined
  },
  render: function ExpandableSearchStory() {
    const [expanded, setExpanded] = useState(false);
    const [searchText, setSearchText] = useState('');
    
    return (
      <div>
        <FixedContainer
          onHeightChange={(height, prev) => {
            console.log('容器高度变化:', height, prev);
          }}
        >
          <div style={{
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <input
                type="search"
                placeholder="搜索..."
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '100%'
                }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {expanded ? '收起' : '高级搜索'}
              </button>
            </div>
            
            {expanded && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <select style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '100%'
                  }}>
                    <option value="">选择类型</option>
                    <option value="1">类型一</option>
                    <option value="2">类型二</option>
                  </select>
                  <select style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '100%'
                  }}>
                    <option value="">选择状态</option>
                    <option value="1">已完成</option>
                    <option value="2">进行中</option>
                  </select>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      搜索
                    </button>
                    <button style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      重置
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FixedContainer>
        <div>
          <ScrollContent />
        </div>
      </div>
    );
  }
};

// 3. 带加载状态的固定头部
export const LoadingHeader: Story = {
  name: '带加载状态的固定头部',
  args: {
    children: null
  },
  render: function LoadingHeaderStory() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string[]>([]);

    const simulateLoad = () => {
      setLoading(true);
      setTimeout(() => {
        setData(['数据1', '数据2', '数据3']);
        setLoading(false);
      }, 1500);
    };

    useEffect(() => {
      simulateLoad();
    }, []);

    return (
      <div>
        <FixedContainer>
          <div style={{
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0 }}>数据展示</h2>
              <button
                onClick={simulateLoad}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={loading}
              >
                {loading ? '加载中...' : '刷新数据'}
              </button>
            </div>
            
            {loading ? (
              <div style={{
                marginTop: '16px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                加载中...
              </div>
            ) : (
              <div style={{
                marginTop: '16px',
                display: 'flex',
                gap: '16px'
              }}>
                {data.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      padding: '16px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </FixedContainer>
        <div>
          <ScrollContent />
        </div>
      </div>
    );
  }
};

// 4. 高度变化回调演示
export const HeightChangeCallback: Story = {
  name: '高度变化回调演示',
  args: {
    children: null,
    onHeightChange: (height: number) => console.log('容器高度变化:', height)
  },
  render: function HeightChangeCallbackStory() {
    const [height, setHeight] = useState(0);
    const [blocks, setBlocks] = useState(3);
    
    return (
      <div>
        <FixedContainer
          onHeightChange={setHeight}
        >
          <div style={{
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '16px'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#e3f2fd',
              borderRadius: '4px',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              当前容器高度: {height}px
            </div>
            
            <div style={{
              marginBottom: '16px',
              display: 'flex',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setBlocks(b => Math.max(1, b - 1))}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                减少内容
              </button>
              <button
                onClick={() => setBlocks(b => b + 1)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                增加内容
              </button>
            </div>

            <div style={{
              display: 'grid',
              gap: '12px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
            }}>
              {Array(blocks).fill(null).map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}
                >
                  内容块 {i + 1}
                </div>
              ))}
            </div>
          </div>
        </FixedContainer>
        <div>
          <ScrollContent />
        </div>
      </div>
    );
  }
};
