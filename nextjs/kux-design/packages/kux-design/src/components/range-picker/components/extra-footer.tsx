import React from 'react';
import { clx } from '@/common/style';
import './extra-footer.scss';

interface ExtraFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface ExtraItemProps {
  onClick: () => void;
  selected?: boolean;
  children: React.ReactNode;
}

export const ExtraFooter: React.FC<ExtraFooterProps> = ({ children, className }) => {
  return (
    <div className={clx('kux-range-picker__extra-footer', className)}>
      {children}
    </div>
  );
};

export const ExtraItem: React.FC<ExtraItemProps> = ({ onClick, selected, children }) => {
  return (
    <div
      className={clx('kux-range-picker__extra-item', {
        'selected': selected,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
}; 