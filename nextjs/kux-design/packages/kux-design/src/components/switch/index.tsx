/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description Switch component
 */
import { motion, type Transition } from 'framer-motion'
import { clsx } from '@/common'
import { IInputSharedProps, useFormInput } from '@/hooks'
import type { IBasicSize } from '@/shared-type'

import './style.scss'

export interface ISwitchProps extends IInputSharedProps<boolean> {
  /**
   * 组件尺寸
   * 可选值为 'small'、'medium'
   * 默认值为 'medium'
   */
  size?: IBasicSize
  /**
   * 自定义样式类名
   */
  className?: string
}

const defaultTransition: Transition = {
  type: 'spring',
  visualDuration: 0.3,
  bounce: 0.2,
}

/**
 * Switch component
 */
export function Switch({
  defaultValue = false,
  size = 'medium',
  className,
  ...rest
}: ISwitchProps) {
  const { value,  onChange, disabled } = useFormInput<boolean>({
    ...rest,
    defaultValue,
  });

  const handleClick = () => {
    onChange(!value);
  };

  return (
    <button
      type="button"
      className={clsx(
        'kux-switch',
        className,
        `is-${size}`,
        {
          'is-on': value,
        }
      )}
      onClick={handleClick}
      disabled={disabled}
      aria-checked={value}
      role="switch"
    >
      <motion.div
        className="kux-switch-handle"
        layout
        transition={defaultTransition}
      />
    </button>
  );
}

