/**
 * Owner: jacky.zhou@kupotech.com
 *
 * @description Input Prefix
 */

import { isNullValue } from '@/common/input';
import { IInputPrefixProps } from '../type';
import { clsx } from '@/common';
import { SearchIcon } from '@kux/iconpack';

export const InputPrefix = (props: IInputPrefixProps) => {
  const isSearch = props.type === 'search';
  const isNullChildren = isNullValue(props.children);

  if ((isNullChildren && !isSearch) || (isSearch && props.size === 'mini')) return null;

  const prefixCls = clsx('kux-input-prefix', {
    'kux-input-prefix-search': isSearch,
  });

  if (isSearch && isNullChildren) {
    return (
      <span className={prefixCls}>
        <SearchIcon size={20} />
      </span>
    );
  }

  return <span className={prefixCls}>{props.children}</span>;
};
