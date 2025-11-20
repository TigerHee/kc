
import React from 'react';
import './style.scss';

export interface ICalloutProps {
  /** 
   * callout 类型
   * * note: 一般用于提示信息
   * * tip: 一般用于小技巧提示
   * * warning: 一般用于警告信息
   * * danger: 一般用于错误/危险信息
   */
  type?: 'note' | 'tip' | 'warning' | 'danger';
  /**
   * 标题
   * 如果不传则使用默认标题
   */
  title?: string;
  /** 
   * 内容
   */
  children: React.ReactNode;
}

const TYPE_INFO: Record<Required<ICalloutProps>['type'], { icon: string; defaultTitle: string }> = {
  note: { icon: '💡', defaultTitle: 'Note' },
  tip: { icon: '✨', defaultTitle: 'Tip' },
  warning: { icon: '⚠️', defaultTitle: 'Warning' },
  danger: { icon: '🔴', defaultTitle: 'Danger' },
};

export function Callout({ type = 'note', title, children }: ICalloutProps) {
  const info = TYPE_INFO[type] || TYPE_INFO.note;
  const infoType = TYPE_INFO[type] ? type : 'note';

  return (
    <div className={`callout callout-${infoType}`}>
      <div className="callout-header">
        <span className="callout-icon">{info.icon} </span>
        <span className="callout-title">{title || info.defaultTitle}</span>
      </div>
      <div className="callout-body">{children}</div>
    </div>
  );
}
