/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useImperativeHandle } from 'react';
import SlidePage from './SlidePage';
import PickerCoin from './PickerCoin';

export default React.memo(({ controlRef, reducerName }) => {
  const [show, setShow] = useState(false);
  useImperativeHandle(
    controlRef,
    () => {
      return {
        show: () => setShow(true),
        close: () => setShow(false),
      };
    },
    [],
  );
  return (
    <SlidePage show={show}>
      <PickerCoin controlRef={controlRef} reducerName={reducerName} />
    </SlidePage>
  );
});
