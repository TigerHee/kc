import React, { ReactNode, ElementType, ChangeEvent } from "react";

export interface ITabsProps {
  action?: ((...args: any[]) => void) | object;
  children?: ReactNode;
  className?: string;
  component?: ElementType;
  onChange?: (event: ChangeEvent<{}>, value: string | number) => void;
  value?: string | number;
  variant?: "line" | "bordered";
  bordered?: boolean;
  size?: "small" | "medium" | "large" | "xlarge";
  activeType?: "default" | "primary";
  type: ? "default" | "text",
  indicator?: boolean;
  centeredActive?: boolean;
  enableWheel?: boolean;
}

export const TabsDefaultProps: Partial<TabsProps> = {
  component: "div",
  variant: "line",
  size: "large",
  bordered: false,
  activeType: "default",
  type: "default",
  indicator: true,
  centeredActive: false,
  enableWheel: false
};

declare const Tabs: React.FC<ITabsProps>;

export default Tabs;
