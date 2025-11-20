/**
 * Owner: simen.zhang@kupotech.com
 *
 * @description Steps component
 */
import React, { ReactElement } from 'react';
import { clx } from '@/common';
import { Step } from './step';
import type { IStepProps, StepStatus } from './step';
import './style.scss';

export interface IStepsProps {
  /** 从 0 开始 */
  current?: number;
  /** 支持 1 个或多个 Step 元素 */
  children: ReactElement<IStepProps, typeof Step> | Array<ReactElement<IStepProps, typeof Step>>;
  className?: string;
  /** 当前步骤状态，例如 'warning' | 'finish' | 'error' | 'default' */
  status?: StepStatus;
}

export function Steps(props: IStepsProps) {
  const { children, current = 0, className = '', status } = props;

  const items = React.Children.toArray(children) as Array<ReactElement<IStepProps, typeof Step>>;
  const stepSize = items.length;

  const clampCurrent = (value: number): number => {
    if (status === 'finish') return stepSize; // 父级 finish：强制到最后一步
    if (value < 0) return 0;
    if (value > stepSize) return stepSize;
    return value;
  };

  return (
    <div className={clx('kux-steps', className)}>
      <div className="kux-steps-content">
        {items.map((child, index) => {
          return React.cloneElement<IStepProps>(child, {
            index,
            current: clampCurrent(current),
            isLast: index === stepSize - 1,
            status,
            key: child.key ?? index, // Attributes
          });
        })}
      </div>
    </div>
  );
}

Steps.Step = Step;
export { Step };
