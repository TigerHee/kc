/*
 * @owner: borden@kupotech.com
 */
import React, { memo } from 'react';
import InputWithTooltip from './index';

const withError = (Component) =>
  memo(({ form, fieldName, value, onChange, children, ...restProps }) => {
    const title = form.getFieldError(fieldName)?.[0];

    const formProp = {};
    // 作为FormItem的子组建，将value和onChange事件传递给子组建
    if (value || onChange) {
      formProp.value = children?.props?.value || value;
      formProp.onChange = children?.props?.onChange || onChange;
    }

    return (
      <Component title={title} {...restProps}>
        {React.cloneElement(children, { ...formProp })}
      </Component>
    );
  });

export default withError(InputWithTooltip);
