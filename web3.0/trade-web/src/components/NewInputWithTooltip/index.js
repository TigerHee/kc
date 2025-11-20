/**
 * Owner: borden@kupotech.com
 */

import React, { useState, useCallback } from 'react';
import _ from 'lodash';
import Tooltip from 'components/PureTooltip';

const InputWithToolTip = (props) => {
  const {
    overlayStyle = {},
    overlayClassName, placement = 'topRight',
    value, onChange, children, form, formItemName,
  } = props;
  const genContent = useCallback(() => {
    const errors = form.getFieldError(formItemName);

    if (!errors || (errors && !errors.length)) {
      return null;
    }
    if (!errors[0]) {
      return null;
    }
    return (
      <div>
        {errors[0]}
      </div>
    );
  }, [form, formItemName]);

  const content = genContent();
  const formProp = {};
  // 作为FormItem的子组建，将value和onChange事件传递给子组建
  if (value || onChange) {
    formProp.value = children?.props?.value || value;
    formProp.onChange = children?.props?.onChange || onChange;
  }

  return (
    <Tooltip
      title={content}
      placement={placement}
      visible={!!content}
      overlayStyle={overlayStyle}
      isErrors
      overlayClassName={overlayClassName}
    >
      {React.cloneElement(children, { ...formProp })}
    </Tooltip>
  );
};

export default InputWithToolTip;
