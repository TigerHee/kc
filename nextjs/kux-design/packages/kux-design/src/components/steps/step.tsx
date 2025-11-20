/**
 * Owner: simen.zhang@kupotech.com
 *
 * @description Step component
 */
import { ReactNode } from 'react';
import { clx } from '@/common';
import { ArrowRightIcon, InfoFilledIcon, SuccessFilledIcon, WaitIcon } from '@kux/iconpack';
import './style.scss';

export type StepStatus = 'default' | 'warning' | 'finish' | 'error';

export interface IStepsBaseProps {
  current?: number;
  className?: string;
}

export interface IStepProps extends Pick<IStepsBaseProps, 'current' | 'className'> {
  index?: number;
  isLast?: boolean;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  status?: StepStatus;
  action?: {
    text: string;
    onClick: () => void;
  };
}

export function Step(props: IStepProps) {
  const { index = 0, current = 0, isLast, className, status, action } = props;
  const isCurrent = index === current;
  const isPass = index < current;
  const isNext = index > current;
  const isFinish = isLast && current > index;
  console.log('isFinish', isFinish, index, current, isLast);

  // step 状态：finish/warning/error/pass/default
  const getInnerStatus = () => {
    if (isFinish) {
      return 'finish';
    }

    if (isCurrent) {
      if (status === 'error') {
        return 'error';
      }

      if (status === 'warning') {
        return 'warning';
      }
    }

    if (isPass) {
      return 'pass';
    }

    return 'default';
  };

  const baseState = getInnerStatus();

  const renderStatusIcon = () => {
    switch (baseState) {
      case 'finish':
      case 'pass':
        return <SuccessFilledIcon className="kux-step-finish_icon" />;
      case 'warning':
        return <WaitIcon className="kux-step-warning_icon" />;
      case 'error':
        return <InfoFilledIcon className="kux-step-error_icon" />;
      default:
        return null;
    }
  };

  const isCustomStatus = ['finish', 'warning', 'error', 'pass'].includes(baseState);

  return (
    <div
      className={clx(
        'kux-step',
        className,
        {
          'kux-step-last': isLast,
          'kux-step-finish': baseState === 'finish', // 含 finish 的样式等效
          'kux-step-warning': baseState === 'warning',
          'kux-step-error': baseState === 'error',
          'kux-step-pass': baseState === 'pass',
          'kux-step-next': baseState === 'default' && isNext,
        },
        {
          'kux-step-divider-after_highlight': index <= current && !isCustomStatus,
        },
      )}
    >
      <div className="kux-step-indicator">
        <div className="kux-step-tag" data-content={isCustomStatus ? '' : index + 1}>
          {renderStatusIcon()}
        </div>
      </div>

      <div className="kux-step-content-wrapper">
        <div className="kux-step-content">
          {props.title && <div className="kux-step-title">{props.title}</div>}
          {props.description && <div className="kux-step-desc">{props.description}</div>}
          {props.children}
        </div>

        {action && (
          <div className="kux-step-action">
            <span className="kux-step-action-text" onClick={action.onClick}>
              {action.text}
            </span>

            <ArrowRightIcon className="kux-step-action-icon" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Step;
