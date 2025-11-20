import React, { useEffect, useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { Button, useResponsive } from '@kux/design';
import { CloseIcon } from '@kux/iconpack';
import styles from './styles.module.scss';

interface AlertProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  onOk?: () => void;
  className?: string;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  visible?: boolean;
  closable?: boolean;
}

const ANIMATION_MS = 240;

export default function Alert({
  title,
  children,
  onClose,
  onOk,
  className,
  okText,
  cancelText,
  closable,
  visible = true,
}: AlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rv = useResponsive();

  useEffect(() => {
    if (!visible) return;
    setIsClosing(false);
    setIsOpen(false);
    const id = window.requestAnimationFrame(() => {
      // force reflow to ensure transition starts from translateY(100%)
      void containerRef.current?.offsetHeight;
      setIsOpen(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, [visible]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    window.setTimeout(() => {
      onClose && onClose();
    }, ANIMATION_MS);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className={clsx(styles.Alert, className, { [styles.open]: isOpen, [styles.closing]: isClosing })}
      role="dialog"
      data-nosnippet={true}
    >
      <div className={clsx(styles.Inner, closable && styles.InnerClosable)}>
        <div className={styles.Content}>
          {title ? <div className={styles.Title}>{title}</div> : null}
          <div className={styles.Content}>{children}</div>
        </div>
        <div className={styles.Actions}>
          <div className={styles.ActionsButtons}>
            {cancelText ? (
              <Button className={styles.cancelButton} onClick={onClose} size={rv === 'sm' ? 'small' : "basic"} style={{ fontWeight: rv === 'sm' ? 600 : 700 }}>
                {cancelText}
              </Button>
            ) : null}
            {okText ? (
              <Button className={styles.okButton} onClick={onOk} type="primary" size={rv === 'sm' ? 'small' : "basic"} style={{ fontWeight: rv === 'sm' ? 600 : 700 }}>
                {okText}
              </Button>
            ) : null}
          </div>
          {closable ? (
            <CloseIcon className={styles.CloseIcon} onClick={handleClose} color='rgba(243, 243, 243, 0.4)' />
          ) : null}
        </div>
      </div>
    </div>
  );
}
