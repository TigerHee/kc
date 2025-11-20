import { type ReactNode } from 'react';
import './style.scss';

export interface IIconButtonProps {
  icon: ReactNode;
  text: string;
  onClick?: undefined | (() => void);
  as?: 'button' | 'a';
  href?: string; // Only applicable if `as` is 'a'
}

export function IconButton ({ onClick, icon: iconUrl, text, as = 'button', href }: IIconButtonProps) {
  const prefix = 'kux-share-view_icon-button'; // Assuming the prefix is 'share-view'

  const Component = as;

  return (
    <Component
      className={`${prefix}`}
      target={as === 'a' ? '_blank' : undefined}
      onClick={onClick}
      href={as === 'a' ? href : undefined}>
      {app.is(iconUrl, 'string') ?
        <img src={iconUrl} alt="icon" className={`${prefix}-icon`} />
        : iconUrl
      }
      <span className={`${prefix}-text`}>{text}</span>
    </Component>
  );
};

