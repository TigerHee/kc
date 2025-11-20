/**
 * 判断输入值是否为“空”，包括 null、undefined、空字符串，
 * 以及 input 展示 placeholder（即 value 为空字符串或 null/undefined）时返回 true。
 *
 * 对于原生 input，展示 placeholder 时 value 一定为 ''，此时返回 true。
 *
 * 对于 number 类型，0 不算空。
 */
export const isNullValue = (value: unknown) => {
  // null、undefined、空字符串
  if (value == null || value === '') return true;
  // 特殊处理：字符串全是空白也视为空
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
};

export function resolveOnChange<E extends HTMLInputElement | HTMLTextAreaElement>(
  target: E,
  e:
    | React.ChangeEvent<E>
    | React.MouseEvent<HTMLElement, MouseEvent>
    | React.CompositionEvent<HTMLElement>,
  onChange: undefined | ((event: React.ChangeEvent<E>) => void),
  targetValue?: string,
) {
  if (!onChange) return;

  let event = e;

  if (e.type === 'click') {
    const currentTarget = target.cloneNode(true) as E;
    event = Object.create(e, {
      target: { value: currentTarget },
      currentTarget: { value: currentTarget },
    });

    currentTarget.value = '';
    onChange(event as React.ChangeEvent<E>);
    return;
  }

  if (targetValue !== undefined) {
    const currentTarget = target.cloneNode(true) as E;
    event = Object.create(e, {
      target: { value: currentTarget },
      currentTarget: { value: currentTarget },
    });

    currentTarget.value = targetValue;
    onChange(event as React.ChangeEvent<E>);
    return;
  }
  onChange(event as React.ChangeEvent<E>);
}

export const isNum = (v: string | number) => {
  // 空值或undefined返回false
  if (v == null) return false;

  // 如果是数字类型直接检查
  if (typeof v === 'number') {
    return !isNaN(v) && isFinite(v);
  }

  // 字符串类型特殊处理，允许数字和小数点的组合
  if (typeof v === 'string') {
    // 允许空字符串
    if (v === '') return true;

    // 允许负号开头
    if (v.startsWith('-')) {
      v = v.substring(1);
    }

    // 检查是否为有效的数字格式（包括小数）
    const parts = v.split('.');
    // 最多只能有一个小数点
    if (parts.length > 2) return false;

    // 每部分都必须是数字或空字符串
    return parts.every((part) => part === '' || /^\d+$/.test(part));
  }

  return false;
};
