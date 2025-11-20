import React from 'react';
import { Modal } from '@/components/modal';
import { ReactNode } from 'react';
import { clx } from '@/common/style';

interface MobileDrawerProps {
  show?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  show = false,
  onClose,
  title,
  children,
  className,
  style,
  ...props
}) => {
  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      title={title}
      mobileTransform
      maskClosable={true}
      className={clx('kux-mobile-picker__drawer', className)}
      style={style}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default MobileDrawer; 