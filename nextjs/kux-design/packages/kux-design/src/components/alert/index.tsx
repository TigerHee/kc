/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Alert component
 */

import { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { clx } from '@/common';
import { CloseIcon, SuccessIcon, WarningIcon } from '@kux/iconpack';
import { Spacer } from '../spacer';

import './style.scss';

const IcoMap = {
  success: SuccessIcon,
  error: WarningIcon,
  warning: WarningIcon,
  info: WarningIcon,
};

export interface IAlertProps {
  message: ReactNode;
  /**
   * 自定义消息类型, 默认是 'info'
   */
  type?: 'success' | 'error' | 'info' | 'warning';
  /** 尺寸 */
  size?: 'small' | 'basic';
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义持续时间，默认是 4000 毫秒，传 0 则不会自动关闭
   */
  duration?: number;
  /** 是否显示关闭图标 */
  showClose?: boolean;
  /** 显示回调 */
  onShow?: () => void;
  /** 隐藏回调 */
  onHide?: () => void;
}

export const Alert = (props: IAlertProps) => {
  const {
    message,
    type = 'info',
    size = 'basic',
    className,
    duration = 4000,
    showClose,
    onShow,
    onHide,
  } = props;

  const [isVisible, setIsVisible] = useState(true);

  const gap = size === 'basic' ? 8 : 6;
  const IcoSize = size === 'basic' ? 16 : 14;
  const AlertIco = IcoMap[type];

  const closeHandler = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className="kux-alert">
      <AnimatePresence initial={false}>
        {isVisible && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={clx('kux-alert-item', `is-${type}`, `in-${size}`, className)}
            onAnimationComplete={(definition) => {
              if (definition?.opacity === 0) {
                onHide?.();
              } else {
                onShow?.();
              }
            }}
          >
            <AlertIco size={IcoSize} className="kux-alert-icon" data-testid="alert-ico" />
            <Spacer direction="horizontal" length={gap} />
            {message}
            {showClose && (
              <>
                <Spacer direction="horizontal" length={gap} />
                <CloseIcon size={IcoSize} className="kux-alert-close-icon" data-testid="alert-close-ico" onClick={closeHandler} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
