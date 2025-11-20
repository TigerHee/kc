import React, { ReactNode, ChangeEvent, MouseEvent, FocusEvent } from 'react';

export interface ITabProps {
  className?: string;
  label?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  value?: any;
}

declare const Tab: React.FC<ITabProps>;

export default Tab;
