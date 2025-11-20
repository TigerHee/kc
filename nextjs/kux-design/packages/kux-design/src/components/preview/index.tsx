/**
 * Owner: victor.ren@kupotech.com
 *
 * @description Preview component
 */
import React, { useEffect, useCallback, useState } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';
import { clx, getDocumentDir } from '@/common';
import { ArrowLeft2Icon, ArrowRight2Icon, ZoominIcon, ZoomoutIcon, CloseIcon, DeleteIcon } from '@kux/iconpack';
import './style.scss';

export interface IPreviewImage {
  src: string;
  alt?: string;
}

export interface IPreviewProps {
  /**
   * 图片列表
   */
  images: IPreviewImage[];
  /**
   * 当前显示的图片索引
   * @default 0
   */
  currentIndex?: number;
  /**
   * 是否显示预览组件
   * @default false
   */
  isOpen?: boolean;
  /**
   * 关闭预览的回调函数
   */
  onClose?: () => void;
  /**
   * 图片切换的回调函数
   */
  onChange?: (index: number) => void;
  /**
   * 删除图片的回调函数
   */
  onDelete?: (index: number) => void;
  /**
   * 是否允许点击背景关闭组件
   * @default true
   */
  maskClosable?: boolean;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 自定义 aria-label
   */
  'aria-label'?: string;
  /**
   * 自定义 aria-describedby
   */
  'aria-describedby'?: string;
  /**
   * 自定义 tabIndex
   */
  tabIndex?: number;
}

/**
 * 顶部菜单栏组件
 */
interface IHeaderProps {
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClose: () => void;
}

function Header({ onDelete, onZoomIn, onZoomOut, onClose }: IHeaderProps) {
  return (
    <div className="kux-preview_header">
      <div className="kux-preview_header-left">
        <div 
          className="kux-preview_header-icon kux-preview_header-icon--delete"
          onClick={onDelete}
          role="button"
          aria-label="delete current img"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onDelete();
            }
          }}
        >
          <DeleteIcon size={20} />
        </div>
      </div>
      <div className="kux-preview_header-right">
        <div 
          className="kux-preview_header-icon kux-preview_header-icon--zoomin"
          onClick={onZoomIn}
          role="button"
          aria-label="zoom in"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onZoomIn();
            }
          }}
        >
          <ZoomoutIcon size={20} />
        </div>
        <div 
          className="kux-preview_header-icon kux-preview_header-icon--zoomout"
          onClick={onZoomOut}
          role="button"
          aria-label="zoom out"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onZoomOut();
            }
          }}
        >
          <ZoominIcon size={20} />
        </div>
        <div 
          className="kux-preview_header-icon kux-preview_header-icon--close"
          onClick={onClose}
          role="button"
          aria-label="close preview"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClose();
            }
          }}
        >
          <CloseIcon size={20} />
        </div>
      </div>
    </div>
  );
}

/**
 * 箭头组件
 */
interface IArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
}

function Arrow({ direction, onClick, className }: IArrowProps) {
  const isLeft = direction === 'left';
  const xOffset = isLeft ? -20 : 20;
  
  return (
    <motion.div
      className={clx('kux-preview_arrow', `kux-preview_arrow--${direction}`, className)}
      initial={{ opacity: 0, x: xOffset }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: xOffset }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      role="button"
      aria-label={isLeft ? 'prev img' : 'next img'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <div className="kux-preview_arrow-circle">
        {isLeft ? <ArrowLeft2Icon size={20} className={"kux-preview_arrow-icon--left"} /> : <ArrowRight2Icon size={20} className="kux-preview_arrow-icon--right" />}
      </div>
    </motion.div>
  );
}

/**
 * Preview component
 */
export function Preview({
  images,
  currentIndex = 0,
  isOpen = false,
  onClose,
  onChange,
  onDelete,
  maskClosable = true,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  tabIndex,
  ...restProps
}: IPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
  const [scale, setScale] = useState(1);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // 拖动相关的 motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // 检测屏幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // 当外部 currentIndex 变化时，更新内部状态
  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  // 当图片切换时，重置缩放和拖动位置
  useEffect(() => {
    setScale(1);
    x.set(0);
    y.set(0);
  }, [currentImageIndex, x, y]);

  // 当缩放重置时，也重置拖动位置
  useEffect(() => {
    if (scale <= 1) {
      x.set(0);
      y.set(0);
    }
  }, [scale, x, y]);

  // 处理图片切换
  const handleImageChange = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentImageIndex(newIndex);
      onChange?.(newIndex);
    }
  }, [images.length, onChange]);

  // 处理放大
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.5, 3)); // 最大放大3倍
  }, []);

  // 处理缩小
  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.5, 1)); // 最小还原到1倍
  }, []);

  // 处理拖动结束
  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    // 拖动结束后立即停止，不添加任何惯性
  }, []);

  // 处理键盘事件
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = getDocumentDir();
      
      switch (event.key) {
        case 'Escape':
          onClose?.();
          break;
        case 'ArrowLeft':
          // RTL 模式下方向键逻辑翻转
          if (direction === 'rtl') {
            handleImageChange(currentImageIndex + 1);
          } else {
            handleImageChange(currentImageIndex - 1);
          }
          break;
        case 'ArrowRight':
          // RTL 模式下方向键逻辑翻转
          if (direction === 'rtl') {
            handleImageChange(currentImageIndex - 1);
          } else {
            handleImageChange(currentImageIndex + 1);
          }
          break;
        case '+':
        case '=':
          event.preventDefault();
          handleZoomIn();
          break;
        case '-':
          event.preventDefault();
          handleZoomOut();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex, handleImageChange, onClose, handleZoomIn, handleZoomOut]);

  // 处理背景点击关闭
  const handleBackgroundClick = useCallback((event: React.MouseEvent) => {
    if (!maskClosable) return;
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  }, [onClose, maskClosable]);

  // 处理删除图片
  const handleDelete = useCallback(() => {
    onDelete?.(currentImageIndex);
  }, [currentImageIndex, onDelete]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentImageIndex];
  
  if (!currentImage) return null;

  return (
    <motion.div
      className={clx('kux-preview', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleBackgroundClick}
      style={{ display: isOpen ? 'flex' : 'none' }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || `img preview - ${currentImageIndex + 1} / ${images.length}`}
      aria-describedby={ariaDescribedby}
      tabIndex={tabIndex}
      {...restProps}
    >
      {/* 顶部菜单栏 */}
      <Header
        onDelete={handleDelete}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onClose={onClose || (() => {})}
      />

      {/* 左箭头 - 大屏幕显示 */}
      {!isSmallScreen && currentImageIndex > 0 && (
        <Arrow
          direction="left"
          onClick={() => handleImageChange(currentImageIndex - 1)}
        />
      )}

      {/* 图片展示区域 */}
      <div className="kux-preview_content">
        <motion.div
          key={currentImageIndex}
          className="kux-preview_image-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.img
            src={currentImage.src}
            alt={currentImage.alt || `img ${currentImageIndex + 1}`}
            className="kux-preview_image"
            aria-label={currentImage.alt || `img ${currentImageIndex + 1}`}
            animate={{
              scale: scale,
            }}
            style={{
              x: scale > 1 ? x : 0,
              y: scale > 1 ? y : 0,
            }}
            drag={scale > 1} // 只在放大时允许拖动
            dragConstraints={{
              left: -300,
              right: 300,
              top: -300,
              bottom: 300,
            }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
            dragTransition={{
              bounceStiffness: 600,
              bounceDamping: 50,
              power: 0.8,
              timeConstant: 200
            }}
            transition={{
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }
            }}
          />
        </motion.div>
      </div>

      {/* 右箭头 - 大屏幕显示 */}
      {!isSmallScreen && currentImageIndex < images.length - 1 && (
        <Arrow
          direction="right"
          onClick={() => handleImageChange(currentImageIndex + 1)}
        />
      )}

      {/* 左箭头 - 小屏幕显示 */}
      {isSmallScreen && currentImageIndex > 0 && (
        <Arrow
          direction="left"
          onClick={() => handleImageChange(currentImageIndex - 1)}
        />
      )}

      {/* 右箭头 - 小屏幕显示 */}
      {isSmallScreen && currentImageIndex < images.length - 1 && (
        <Arrow
          direction="right"
          onClick={() => handleImageChange(currentImageIndex + 1)}
        />
      )}
    </motion.div>
  );
}
