import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './index';

const meta: Meta<typeof Skeleton> = {
  title: 'base/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '骨架屏组件，用于在内容加载时显示占位符，提供更好的用户体验。',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础用法
export const Basic: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Skeleton.Avatar size={32} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton.Node width={200} height={16} />
          <Skeleton.Node width={150} height={14} />
        </div>
      </div>
      <Skeleton.Input width={320} height={32} />
    </div>
  ),
};

// 移动端 App Skeleton 界面
export const MobileAppSkeleton: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        width: '390px',
        height: '844px',
        border: '1px solid var(--kux-divider8)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--kux-backgroundApp)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        {/* 状态栏 */}
        <div style={{
          height: '44px',
          backgroundColor: 'var(--kux-backgroundOverlay)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid var(--kux-divider8)'
        }}>
          <Skeleton.Node width={60} height={16} />
          <Skeleton.Node width={80} height={16} />
          <Skeleton.Node width={60} height={16} />
        </div>

        {/* 头部区域 */}
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--kux-backgroundOverlay)',
          borderBottom: '1px solid var(--kux-divider8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Skeleton.Avatar size={48} />
            <div style={{ flex: 1 }}>
              <Skeleton.Node width={120} height={18} style={{ marginBottom: '8px' }} />
            </div>
          </div>
          <Skeleton.Input width="100%" height={40} />
        </div>

        {/* 内容区域 */}
        <div style={{ flex: 1, padding: '16px' }}>
          {/* 卡片列表 */}
          <div style={{ marginBottom: '20px' }}>
            <Skeleton.Node width={100} height={20} style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map((item) => (
                <div key={item} style={{
                  backgroundColor: 'var(--kux-backgroundOverlay)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--kux-divider8)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Skeleton.Avatar size={40} />
                    <div style={{ flex: 1 }}>
                      <Skeleton.Node width={140} height={16} style={{ marginBottom: '6px' }} />
                    </div>
                  </div>
                  <Skeleton.Node width="100%" height={14} style={{ marginBottom: '8px' }} />
                  <Skeleton.Node width="80%" height={14} style={{ marginBottom: '8px' }} />
                  <Skeleton.Node width="60%" height={14} />
                </div>
              ))}
            </div>
          </div>

          {/* 功能区域 */}
          <div style={{ marginBottom: '20px' }}>
            <Skeleton.Node width={120} height={20} style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} style={{
                  flex: 1,
                  backgroundColor: 'var(--kux-backgroundOverlay)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--kux-divider8)',
                  textAlign: 'center'
                }}>
                  <Skeleton.Avatar size={32} style={{ margin: '0 auto 8px' }} />
                  <Skeleton.Node width={60} height={12} style={{ margin: '0 auto' }} />
                </div>
              ))}
            </div>
          </div>

          {/* 推荐内容 */}
          <div>
            <Skeleton.Node width={100} height={20} style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '12px', overflow: 'hidden' }}>
              {[1, 2, 3].map((item) => (
                <div key={item} style={{
                  flex: '0 0 120px',
                  backgroundColor: 'var(--kux-backgroundOverlay)',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid var(--kux-divider8)'
                }}>
                  <Skeleton.Node width="100%" height={80} style={{ marginBottom: '8px', borderRadius: '8px' }} />
                  <Skeleton.Node width="80%" height={14} style={{ marginBottom: '6px' }} />
                  <Skeleton.Node width="60%" height={12} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部导航栏 */}
        <div style={{
          height: '60px',
          backgroundColor: 'var(--kux-backgroundOverlay)',
          borderTop: '1px solid var(--kux-divider8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 16px'
        }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} style={{ textAlign: 'center' }}>
              <Skeleton.Avatar size={24} style={{ margin: '0 auto 4px' }} />
              <Skeleton.Node width={40} height={10} style={{ margin: '0 auto' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// 列表页面 Skeleton
export const ListPageSkeleton: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        width: '390px',
        height: '844px',
        border: '1px solid var(--kux-divider8)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--kux-backgroundApp)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        {/* 状态栏 */}
        <div style={{
          height: '44px',
          backgroundColor: 'var(--kux-backgroundOverlay)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid var(--kux-divider8)'
        }}>
          <Skeleton.Node width={60} height={16} />
          <Skeleton.Node width={80} height={16} />
          <Skeleton.Node width={60} height={16} />
        </div>

        {/* 搜索栏 */}
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--kux-backgroundOverlay)',
          borderBottom: '1px solid var(--kux-divider8)'
        }}>
          <Skeleton.Input width="100%" height={40} />
        </div>

        {/* 筛选标签 */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'var(--kux-backgroundOverlay)',
          borderBottom: '1px solid var(--kux-divider8)'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton.Node key={item} width={60} height={28} style={{ borderRadius: '14px' }} />
            ))}
          </div>
        </div>

        {/* 列表内容 */}
        <div style={{ flex: 1, padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} style={{
                backgroundColor: 'var(--kux-backgroundOverlay)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--kux-divider8)'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Skeleton.Node width={80} height={80} style={{ borderRadius: '8px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Skeleton.Node width="80%" height={16} style={{ marginBottom: '8px' }} />
                    <Skeleton.Node width="60%" height={14} style={{ marginBottom: '8px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Skeleton.Node width={60} height={16} />
                      <Skeleton.Node width={40} height={20} style={{ borderRadius: '10px' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// 详情页面 Skeleton
export const DetailPageSkeleton: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        width: '390px',
        height: '844px',
        border: '1px solid var(--kux-divider8)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--kux-backgroundApp)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        {/* 状态栏 */}
        <div style={{
          height: '44px',
          backgroundColor: 'var(--kux-backgroundOverlay)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid var(--kux-divider8)'
        }}>
          <Skeleton.Node width={60} height={16} />
          <Skeleton.Node width={80} height={16} />
          <Skeleton.Node width={60} height={16} />
        </div>

        {/* 图片区域 */}
        <div style={{
          height: '200px',
          backgroundColor: 'var(--kux-backgroundOverlay)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Skeleton.Node width="100%" height="100%" style={{ borderRadius: 0 }} />
        </div>

        {/* 内容区域 */}
        <div style={{ flex: 1, padding: '16px' }}>
          {/* 标题和价格 */}
          <div style={{ marginBottom: '20px' }}>
            <Skeleton.Node width="80%" height={20} style={{ marginBottom: '8px' }} />
            <Skeleton.Node width="60%" height={16} style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Skeleton.Node width={80} height={24} />
              <Skeleton.Node width={60} height={16} />
            </div>
          </div>

          {/* 规格选择 */}
          <div style={{ marginBottom: '20px' }}>
            <Skeleton.Node width={100} height={18} style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4].map((item) => (
                <Skeleton.Node key={item} width={60} height={32} style={{ borderRadius: '16px' }} />
              ))}
            </div>
          </div>

          {/* 描述信息 */}
          <div style={{ marginBottom: '20px' }}>
            <Skeleton.Node width={100} height={18} style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton.Node width="100%" height={14} />
              <Skeleton.Node width="90%" height={14} />
              <Skeleton.Node width="80%" height={14} />
              <Skeleton.Node width="70%" height={14} />
            </div>
          </div>

          {/* 评价区域 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <Skeleton.Node width={100} height={18} />
              <Skeleton.Node width={60} height={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2].map((item) => (
                <div key={item} style={{
                  backgroundColor: 'var(--kux-backgroundOverlay)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid var(--kux-divider8)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Skeleton.Avatar size={24} />
                    <Skeleton.Node width={80} height={14} />
                  </div>
                  <Skeleton.Node width="100%" height={14} style={{ marginBottom: '6px' }} />
                  <Skeleton.Node width="80%" height={14} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div style={{
          height: '60px',
          backgroundColor: 'var(--kux-backgroundOverlay)',
          borderTop: '1px solid var(--kux-divider8)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 16px'
        }}>
          <Skeleton.Node width={80} height={40} style={{ borderRadius: '20px' }} />
          <Skeleton.Node width={80} height={40} style={{ borderRadius: '20px' }} />
          <Skeleton.Node width="100%" height={40} style={{ borderRadius: '20px' }} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

