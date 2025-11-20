import type { ReactNode } from 'react';

export type AfterNodeProps = {
  isHover: boolean;
};

export interface CommunityCardProps {
  title: ReactNode;
  description: ReactNode;
  buttonText?: string;
  buttonUrl?: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
  extraNode?: ReactNode;
  afterNode?: ReactNode | ((props: AfterNodeProps) => ReactNode);
}

export interface CommunityProps {
  className?: string;
}
