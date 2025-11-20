/**
 * Owner: odan.ou@kupotech.com
 */

import { cloneElement, forwardRef } from 'react';

const FormItemWrap = forwardRef((props, ref) => {
  const { prefixLabel, children, ...otherProps } = props;
  return (
    <div>
      {prefixLabel}
      {cloneElement(children, { ...otherProps, ref })}
    </div>
  );
});

export default FormItemWrap;
