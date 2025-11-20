/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { RadioTypeContext } from 'context/index';
import Radio from './Radio';

const RadioButton = React.forwardRef((props, ref) => {
  return (
    <RadioTypeContext.Provider value="button">
      <Radio {...props} type="radio" ref={ref} />
    </RadioTypeContext.Provider>
  );
});

RadioButton.displayName = 'RadioButton';

export default RadioButton;
