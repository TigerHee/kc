import React, { memo, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import styles from './index.module.scss';
import { useHeaderStore } from '../../model';
import { OVERLAY_CONTENT_FLAG } from '../NavigationColumns/constants';

interface FixedDropdownProps {
  children: React.ReactElement;
  overlay: React.ReactNode;
  onVisibleChange?: (visible: boolean) => void;
  className?: string;
  inTrade?: boolean;
  visible?: boolean;
  trigger?: 'click' | 'hover';
  keepMounted?: boolean;
  uniqueKey?: string | number;
  zIndex?: number;
  disablePortal?: boolean;
}

const map: any = {};

const dropdownVisibleMap: Record<string | number, boolean> = {};
let timer: NodeJS.Timeout | null = null;

const rootId = 'kc-header-fixed-dropdown-root';

function getOverlayRoot(style: React.CSSProperties) {
  let root = document.getElementById(rootId);
  if (!root) {
    root = document.createElement('div');
    root.id = rootId;
    Object.assign(root.style, {
      position: 'fixed',
      opacity: 1,
      // transform: 'translateY(-10px)',
      'transition-timing-function': 'ease',
      'transition-delay': '0s',
      'transition-property': 'opacity, height, background',
      'will-change': 'opacity, height, background',
      left: '0 !important',
      'border-bottom': '1px solid var(--kux-cover8)',
      overflow: 'hidden',
    });

    document.body.appendChild(root);
  }

  // 无论是否是新创建的元素，都执行样式赋值
  Object.assign(root.style, {
    opacity: 1,
    background: 'var(--kux-backgroundOverlay)',
    'transition-duration': '0.3s',
    ...style,
  });

  return root;
}

const FixedDropdown: React.FC<FixedDropdownProps> = ({
  children,
  inTrade,
  overlay,
  onVisibleChange,
  uniqueKey = '',
  className,
  visible: propVisible,
  trigger = 'click',
  keepMounted = true,
  zIndex = 1000,
}) => {
  const [visible, setVisible] = useState(propVisible ?? false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const totalHeaderHeight = useHeaderStore(state => state.totalHeaderHeight);
  const [contentHeight, setContentHeight] = useState(0);

  // 同步受控状态
  useEffect(() => {
    if (propVisible !== undefined) {
      setVisible(propVisible);
    }
  }, [propVisible]);

  // 处理挂载状态
  useEffect(() => {
    if (visible) {
      setIsMounted(true);
    } else if (!keepMounted) {
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }

    setTimeout(() => {
      const contentElem = overlayRef.current?.querySelector(`#${OVERLAY_CONTENT_FLAG}`);
      const contentHeight = (contentElem as any)?.offsetHeight || 0;

      if (contentHeight) {
        map[uniqueKey] = contentHeight;
        setContentHeight(overlayRef.current?.offsetHeight || 0);
      }
    }, 100);
  }, [visible, keepMounted]);

  // 事件处理
  const toggleVisibility = (newVisible: boolean) => {
    if (propVisible === undefined) {
      setVisible(newVisible);
    }
    onVisibleChange?.(newVisible);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      trigger === 'click' &&
      !triggerRef.current?.contains(e.target as Node) &&
      !overlayRef.current?.contains(e.target as Node)
    ) {
      toggleVisibility(false);
    }
  };

  // 渲染下拉内容
  const renderOverlay = () => {
    // if (!isMounted) return null;

    const style: React.CSSProperties = { zIndex, top: `${totalHeaderHeight}px` };
    if (visible && contentHeight > 0) {
      style.height = `${contentHeight}px`;
    }

    const overlayContent = (
      <div
        ref={overlayRef}
        onMouseEnter={() => trigger === 'hover' && toggleVisibility(true)}
        // onMouseEnter={() => trigger === 'hover' && toggleVisibility(true)}
        // onMouseLeave={() => trigger === 'hover' && toggleVisibility(false)}
        className={clsx('fixedDropDownOverlay', styles.fixedDropDownOverlay, className, {
          [styles.visible]: visible && isMounted,
          [styles.hidden]: !visible || !isMounted,
          [styles.inTradeFixedOverlay]: inTrade,
        })}
      >
        {overlay}
      </div>
    );

    return ReactDOM.createPortal(overlayContent, getOverlayRoot(style));
  };

  useEffect(() => {
    if (trigger === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [trigger, visible]);

  useEffect(() => {
    dropdownVisibleMap[uniqueKey] = visible;
  }, [visible]);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    if (Object.values(dropdownVisibleMap).every(visible => !visible)) {
      timer = setTimeout(() => {
        if (Object.values(dropdownVisibleMap).every(visible => !visible)) {
          Object.assign(root.style, {
            opacity: 0,
            height: 0,
            background: 'transparent',
            'transition-duration': '0.1s',
          });
        }
      }, 100);
    } else {
      // contentHeight && (root.style.height = `${contentHeight}px`);
      if (timer) clearTimeout(timer);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, contentHeight]);

  return (
    <div
      ref={triggerRef}
      onClick={() => trigger === 'click' && toggleVisibility(!visible)}
      onMouseEnter={() => trigger === 'hover' && toggleVisibility(true)}
      onMouseLeave={() => trigger === 'hover' && toggleVisibility(false)}
      // style={{ position: 'relative', display: 'inline-block' }}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <div className={styles.contentBox}>{children}</div>
      {renderOverlay()}
      {visible && (
        <div className={styles.headerPlaceholder} onMouseEnter={() => trigger === 'hover' && toggleVisibility(true)} />
      )}
    </div>
  );
};

export default memo(FixedDropdown);
