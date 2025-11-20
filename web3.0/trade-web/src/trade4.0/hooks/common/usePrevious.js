/**
 * Owner: Ray.Lee@kupotech.com
 */
import React from 'react';

function usePrevious(newValue) {
  const previousRef = React.useRef();

  React.useEffect(() => {
    previousRef.current = newValue;
  });

  return previousRef.current;
}

export default usePrevious;
