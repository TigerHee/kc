import { ReactNode } from "react";

export type TValue = string | number;

export interface ICheckboxOption {
  label: ReactNode;
  value: TValue;
  disabled?: boolean;
  onChange?: (event: any) => void;
  style?: React.CSSProperties;
}

export interface ICheckboxGroupProps {
  options: (ICheckboxOption | TValue)[];
  defaultValue?: TValue[];
  children?: ReactNode;
  disabled?: boolean;
  onChange?: (value: TValue[]) => void;
  value?: TValue[];
  name?: string;
  className?: string;
  classNames?: Record<string, string>;
  size?: 'small' | 'basic' | 'large';
}