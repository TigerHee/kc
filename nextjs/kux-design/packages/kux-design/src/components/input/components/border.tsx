/**
 * Owner: jacky.zhou@kupotech.com
 *
 * @description Input Border
 */

import { clsx } from '@/common';
import { IInputLabelProps } from '../type';

export const InputBorder = (props: IInputLabelProps) => {
  const isSearch = props.type === 'search';

  const fieldsetCls = clsx('kux-input-fieldset', {
    'kux-input-fieldset-search': isSearch,
  });

  const legendCls = clsx('kux-input-legend', {
    'kux-input-legend-float': props.float,
    'kux-input-legend-search': isSearch,
    'kux-input-legend-outline': props.position === 'outline',
  });

  return (
    <fieldset className={fieldsetCls}>
      <legend className={legendCls}>{props.children || 'label'}</legend>
    </fieldset>
  );
};
