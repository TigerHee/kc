/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description Segmented component
 */
import { useMemo, type ReactNode } from 'react'
import { motion, type Transition } from 'framer-motion'
import { clsx } from '@/common'
import { type ISize } from '@/shared-type'
import { type IInputSharedProps, useFormInput, useId } from '@/hooks'
import './style.scss'

type TValue = string | number

export interface ISegmentedOptionObject<T extends TValue> {
  label: ReactNode
  value: T
  disabled?: boolean
}

type TPrimitiveOption<T extends TValue> = T

export type ISegmentedOption<T extends TValue> =
  | TPrimitiveOption<T>
  | ISegmentedOptionObject<T>

export interface ISegmentedProps<T extends TValue> extends IInputSharedProps<T> {
    /**
   * 组件选项
   * 可以是字符串、数字或对象形式的选项, 使用时必须使用统一的类型
   */
  options: ISegmentedOption<T>[]
  /**
   * 视觉样式变体
   * 可选值为 'plain'、'slider' 或 'underlined'
   */
  variant?: 'plain' | 'slider' | 'underlined'
  /**
   * 组件尺寸
   * 可选值为 'small'、'medium' 或 'large'
   * 默认值为 'medium'
   */
  size?: ISize
  /**
   * 是否全宽
   * 如果为 true，则组件占满父容器的宽度
   */
  fullWidth?: boolean
  /**
   * 是否均匀分布选项
   * * stretch: 元素等宽(flex: 1)
   * * auto: 自适应内容宽度(space-between)
   */
  justified?: 'stretch' | 'auto'
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


export function Segmented<T extends TValue>({
  options,
  variant = 'plain',
  size = 'medium',
  fullWidth = false,
  justified,
  className,
  ...rest
}: ISegmentedProps<T>) {

  const id = useId()

  const { value, onChange, disabled } = useFormInput(rest)

  const parsedOptions: ISegmentedOptionObject<T>[] = useMemo(() => options.map(item =>
    app.is(item ,'object')
      ? item
      : { label: String(item), value: item }  
  ), [options])

  function handleClick(next: T, optionDisabled?: boolean) {
    if (disabled || optionDisabled || next === value) return
    onChange(next)
  }

  return (
    <div
      className={clsx('kux-segmented', className,
        justified && `is-justified-${justified}`,
        `is-${variant}`, `is-${size}`, {
        'is-disabled': disabled,
        'is-full-width': fullWidth,
      })}
    >
      {parsedOptions.map((opt, index) => {
        const active = value === opt.value
        return (
          <button
            key={`${id}-${index}`}
            className={clsx('kux-segmented-item', {
              'is-active': active,
            })}
            data-value={opt.value}
            onClick={() => handleClick(opt.value, opt.disabled)}
            disabled={disabled || opt.disabled}
          >
            <span className="kux-segmented-label">{opt.label}</span>
            {active && variant !== 'underlined' && (
              <motion.div
                layoutId={id}
                initial={false}
                className={clsx(
                  'kux-segmented-indicator',
                  `is-${variant}`
                )}
                transition={defaultTransition}
              />
            )}
            {active && variant === 'underlined' && (
              <motion.div
                layoutId={id}
                className="kux-segmented-indicator is-underlined"
                initial={false}
                transition={defaultTransition}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
