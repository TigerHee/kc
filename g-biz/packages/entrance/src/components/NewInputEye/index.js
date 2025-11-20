/**
 * Owner: iron@kupotech.com
 */
import React, { forwardRef, useState } from 'react';
import { ClassNames, Input } from '@kux/mui';

function InputEye(props = {}, ref) {
  const { value, onFocus, onBlur, ...rest } = props;
  const [showNotice, setShowNotice] = useState(false);

  const handleFocus = (e) => {
    setShowNotice(true);
    typeof onFocus === 'function' && onFocus(e);
  };

  const handleBlur = (e) => {
    setShowNotice(false);
    typeof onBlur === 'function' && onBlur(e);
  };

  return (
    <ClassNames>
      {({ css }) => {
        const togglePwdClass = css`
          margin-left: 12px;
        `;
        const clearIconClass = css`
          visibility: ${showNotice ? 'visible' : 'hidden'};
        `;
        return (
          <div>
            <Input
              data-inspector="password_input_with_eye"
              classNames={{ togglePwdIcon: togglePwdClass, clearIcon: clearIconClass }}
              type="password"
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              allowClear
              {...rest}
              ref={ref}
            />
          </div>
        );
      }}
    </ClassNames>
  );
}

export default forwardRef(InputEye);
