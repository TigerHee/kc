import { ReactNode, useEffect, useState } from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { clx } from '@/common';
import './style.scss';

let container: HTMLDivElement | null = null;
let listeners: ((items: IToastItem[]) => void)[] = [];
let toasts: IToastItem[] = [];

interface IToastItem {
  id: string;
  message: ReactNode;
  className?: string;
  type: 'default' | 'success' | 'error' | 'info' | 'warning';
}

export interface IToastOptions {
  /**
   * 自定义消息类型, 默认是 'info'
   */
  type?: IToastItem['type'];
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义 ID, 如果不传则自动生成
   */
  id?: string;
  /**
   * 自定义持续时间, 默认是 4000 毫秒, 传 0 则不会自动关闭
   */
  duration?: number;
}

let idSeed = 0;
function notify() {
  listeners.forEach((cb) => cb([...toasts]));
}

function createToast(message: ReactNode, options: IToastOptions = {}) {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);

    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<ToastContainer />, container);
  }
  const toastId = options.id || `toast_${++idSeed}`;
  const item: IToastItem = {
    id: toastId,
    message,
    className: options.className,
    type: options.type || 'info'
  };
  toasts = [...toasts.filter(t => t.id !== toastId), item];
  notify();
  if (options.duration === 0) return toastId; // 如果 duration 为 0，则不自动关闭
  setTimeout(() => remove(toastId), options.duration ?? 4000);
  return toastId;
}

/**
 * 移除指定 ID 的 Toast, 如果不传 ID 则移除所有 Toast
 * @param id Toast 的 ID
 */
function remove(id?: string) {
  toasts = id ? toasts.filter((t) => t.id !== id) : [];
  notify();
}

export const toast = Object.assign(
  (message: ReactNode, options?: IToastOptions) => createToast(message, options),
  {
    success: (message: ReactNode, options?: IToastOptions) => createToast(message, { ...options, type: 'success' }),
    error: (message: ReactNode, options?: IToastOptions) => createToast(message, { ...options, type: 'error' }),
    info: (message: ReactNode, options?: IToastOptions) => createToast(message, { ...options, type: 'info' }),
    warning: (message: ReactNode, options?: IToastOptions) => createToast(message, { ...options, type: 'warning' }),
    remove,
    promise<T>(promise: Promise<T>, messages: {
      /**
       * 加载中的消息内容
       */
      loading: ReactNode;
      /**
       * 成功的消息内容
       * 可以是 ReactNode 或者一个函数，接收成功的结果并返回消息内容
       */
      success: ReactNode | ((res: T) => ReactNode);
      /**
       * 错误的消息内容
       * 可以是 ReactNode 或者一个函数，接收错误对象并返回消息内容
       */
      error: ReactNode | ((err: any) => ReactNode);
    }) {
      const id = createToast(messages.loading, { type: 'info', duration: 0 });
      promise.then(
        (res) => {
          const msg = typeof messages.success === 'function' ? messages.success(res) : messages.success;
          createToast(msg, { id, type: 'success' });
        },
        (err) => {
          const msg = typeof messages.error === 'function' ? messages.error(err) : messages.error;
          createToast(msg, { id, type: 'error' });
        }
      );
      return id;
    }
  }
);

function ToastContainer() {
  const [items, setItems] = useState<IToastItem[]>([]);
  useEffect(() => {
    listeners.push(setItems);
    setItems([...toasts]);
    return () => {
      listeners = listeners.filter((fn) => fn !== setItems);
    };
  }, []);

  return createPortal(
    <div className="kux-toast">
      {/* @ts-expect-error  motion type error */}
      <AnimatePresence initial={false} mode="popLayout">
        {items.map(({ id, message, type, className }) => (
          <motion.div
            key={id}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className={clx('kux-toast-item',  `is-${type}`, className)}
          >
            {message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
