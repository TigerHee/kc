import React from 'react';
import { TValue } from './type'

export const CheckBoxGroupContext = React.createContext<{
  name?: string;
  value?: TValue[];
  disabled?: boolean;
  registerValue: (value: TValue) => void;
  cancelValue: (value: TValue) => void;
  toggleOption?: (option: { label: React.ReactNode; value: TValue }) => void;
} | null>(null);
CheckBoxGroupContext.displayName = 'CheckBoxGroupContext';