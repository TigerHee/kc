import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Preview, type IPreviewImage } from './index'
import { getDocumentDir } from '@/common'

const sampleImages: IPreviewImage[] = [
  { src: 'https://fastly.picsum.photos/id/293/800/600.jpg?hmac=FhpUrGO62nAMVIWLpRcZsw9KfyyECEHtXzZBjqBSkhw', alt: '图片1' },
  { src: 'https://fastly.picsum.photos/id/502/800/600.jpg?hmac=EJI7wBG6sijyg5o-hT6XEn2w_36DzytnYC6uGby4-w0', alt: '图片2' },
  { src: 'https://fastly.picsum.photos/id/821/800/600.jpg?hmac=RC7w0iHPOwkZscAcCEhnzQaukftHQAINaFSfU_Fidno', alt: '图片3' },
  { src: 'https://fastly.picsum.photos/id/1065/800/600.jpg?hmac=geaomQ-9ZiszAV8qa7IbBsnm8d2RQ-jcqN_BDwt-EkA', alt: '图片4' },
  { src: 'https://fastly.picsum.photos/id/177/800/600.jpg?hmac=4rdOTxoMNZiroDNJI9CLi2F2GX4R0bhfgB4plLiLmm0', alt: '图片5' },
]

const meta: Meta<typeof Preview> = {
  title: 'base/Preview',
  component: Preview,
  parameters: {
    docs: {
      description: {
        component: '移动优先的全屏图片预览组件，支持多图片切换、键盘操作和流畅的动画效果。',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Basic: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          打开预览
        </Button>
        
        <Preview
          images={sampleImages}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onChange={setCurrentIndex}
        />
      </div>
    )
  },
}

// 单张图片预览
export const SingleImage: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const singleImage = [{ src: 'https://picsum.photos/800/600?random=1', alt: '单张图片' }]

    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          预览单张图片
        </Button>
        
        <Preview
          images={singleImage}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    )
  },
}

// 多张图片预览
export const MultipleImages: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          预览多张图片
        </Button>
        
        <Preview
          images={sampleImages}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onChange={setCurrentIndex}
        />
      </div>
    )
  },
}

// 删除功能演示
export const WithDelete: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [images, setImages] = useState<IPreviewImage[]>([
      { src: 'https://picsum.photos/800/600?random=1', alt: '图片1' },
      { src: 'https://picsum.photos/800/600?random=2', alt: '图片2' },
      { src: 'https://picsum.photos/800/600?random=3', alt: '图片3' },
      { src: 'https://picsum.photos/800/600?random=4', alt: '图片4' },
      { src: 'https://picsum.photos/800/600?random=5', alt: '图片5' },
    ])

    const handleDelete = (index: number) => {
      console.log('index:', index);
      const newImages = images.filter((_, i) => i !== index)
      setImages(newImages)
      
      // 如果删除的是当前图片，调整索引
      if (index === currentIndex) {
        if (currentIndex >= newImages.length) {
          setCurrentIndex(Math.max(0, newImages.length - 1))
        }
      } else if (index < currentIndex) {
        setCurrentIndex(currentIndex - 1)
      }
      
      // 如果没有图片了，关闭预览
      if (newImages.length === 0) {
        setIsOpen(false)
      }
    }

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            当前图片数量: {images.length}
          </p>
          <Button onClick={() => setIsOpen(true)}>
            打开预览 (可删除图片)
          </Button>
        </div>
        
        <Preview
          images={images}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onChange={setCurrentIndex}
          onDelete={handleDelete}
        />
      </div>
    )
  },
}

// maskClosable 演示
export const MaskClosableDemo: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [maskClosable, setMaskClosable] = useState(true)

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={maskClosable}
              onChange={(e) => setMaskClosable(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            允许点击背景关闭 (maskClosable)
          </label>
          <Button onClick={() => setIsOpen(true)}>
            打开预览
          </Button>
        </div>
        
        <Preview
          images={sampleImages}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onChange={setCurrentIndex}
          maskClosable={maskClosable}
        />
      </div>
    )
  },
}

// 缩略图画廊
export const ThumbnailGallery: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            点击缩略图打开预览
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {sampleImages.map((image, index) => (
              <div
                key={index}
                style={{
                  width: '100px',
                  height: '100px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#007bff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                }}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsOpen(true)
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        <Preview
          images={sampleImages}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onChange={setCurrentIndex}
        />
      </div>
    )
  },
}

// 移动端测试
export const MobileTest: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            请在移动设备或浏览器开发者工具中测试以下功能：
          </p>
          <ul style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            <li>• 图片区域距离屏幕两边最小16px</li>
            <li>• 箭头按钮在底部居中，间距32px</li>
            <li>• 箭头按钮距离底部24px</li>
            <li>• 触摸操作流畅</li>
            <li>• 顶部菜单栏高度44px</li>
          </ul>
        </div>
        
        <Button onClick={() => setIsOpen(true)}>
          测试移动端布局
        </Button>
        
        <Preview
          images={sampleImages}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onChange={setCurrentIndex}
        />
      </div>
    )
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// 可访问性演示
export const AccessibilityDemo: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>可访问性功能演示</h3>
          <ul style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            <li>• 使用 Tab 键在按钮间切换焦点</li>
            <li>• 使用 Enter 或 Space 键激活按钮</li>
            <li>• 使用方向键切换图片</li>
            <li>• 使用 ESC 键关闭预览</li>
            <li>• 屏幕阅读器会朗读当前图片信息</li>
          </ul>
        </div>
        
        <Button onClick={() => setIsOpen(true)}>
          测试可访问性功能
        </Button>
        
        <Preview
          images={sampleImages}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onChange={setCurrentIndex}
          aria-label="产品图片预览 - 支持键盘导航"
          aria-describedby="preview-description"
          tabIndex={0}
        />
        
        <div id="preview-description" style={{ display: 'none' }}>
          这是一个图片预览组件，支持键盘导航和屏幕阅读器。使用方向键切换图片，ESC键关闭预览。
        </div>
      </div>
    )
  },
}

// RTL 布局演示
export const RTLDemo: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isRTL, setIsRTL] = useState(false)

    // 切换 RTL 模式
    const toggleRTL = () => {
      const newDir = isRTL ? 'ltr' : 'rtl'
      document.documentElement.setAttribute('dir', newDir)
      setIsRTL(!isRTL)
    }

    // 获取当前方向
    const currentDirection = getDocumentDir()

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>RTL 布局支持演示</h3>
          <ul style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            <li>• 点击下方按钮切换 RTL/LTR 模式</li>
            <li>• 观察箭头方向、图标位置的变化</li>
            <li>• 键盘方向键在 RTL 模式下也会相应翻转</li>
            <li>• 使用 CSS 逻辑属性自动适配布局方向</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <Button onClick={() => setIsOpen(true)} style={{ marginRight: '10px' }}>
            打开预览
          </Button>
          <Button onClick={toggleRTL} type="outlined">
            切换为 {isRTL ? 'LTR' : 'RTL'} 模式
          </Button>
        </div>
        
        <div style={{ fontSize: '14px', color: '#666' }}>
          当前模式: <strong>{currentDirection === 'rtl' ? 'RTL (从右到左)' : 'LTR (从左到右)'}</strong>
        </div>
        
        <Preview
          images={sampleImages}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onChange={setCurrentIndex}
          aria-label={`图片预览 - ${currentDirection === 'rtl' ? 'RTL' : 'LTR'} 模式`}
        />
      </div>
    )
  },
}

// 缩放功能演示
export const ZoomDemo: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>缩放功能演示</h3>
          <ul style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            <li>• 点击放大/缩小图标进行缩放</li>
            <li>• 使用键盘 + 键放大，- 键缩小</li>
            <li>• 缩放范围：1倍 - 3倍</li>
            <li>• 切换图片时自动还原到1倍</li>
          </ul>
        </div>
        
        <Button onClick={() => setIsOpen(true)}>
          测试缩放功能
        </Button>
        
        <Preview
          images={sampleImages}
          isOpen={isOpen}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
          onChange={setCurrentIndex}
          aria-label="图片预览 - 支持缩放功能"
        />
      </div>
    )
  },
}

