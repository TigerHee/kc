/**
 * Owner: jacky.zhou@kupotech.com
 *
 * @description Input Label
 */

import { clsx } from '@/common';
import { IInputLabelProps } from '../type';
import { isNullValue } from '@/common/input';

export const InputLabel = (props: IInputLabelProps) => {
  if (isNullValue(props.children) || props.type === 'search') return null;
  if (props.position === 'outline') return <LabelOutline {...props} />;
  return <LabelInline {...props} />;
};

/**
 * 输入框内嵌 label，聚焦时移动到左上角 border 中，并缩小
 * 以下几种情况默认在左上角
 * 1. 输入框有前缀
 * 2. value 不为空字符串
 * 3. placeholder 不为空
 */
const LabelInline = (props: IInputLabelProps) => {
  const cls = clsx(
    'kux-input-label',
    'kux-input-label-inline',
    {
      'kux-input-label-inline-small': props.size === 'small',
      'kux-input-label-inline-float': props.float,
    },
    props.className,
  );

  return (
    <label className={cls} htmlFor={props.htmlFor} style={props.style}>
      {props.children}
    </label>
  );
};

const LabelOutline = (props: IInputLabelProps) => {
  const cls = clsx('kux-input-label', 'kux-input-label-outline', props.className);
  return (
    <label className={cls} htmlFor={props.htmlFor} style={props.style}>
      {props.children}
    </label>
  );
};
