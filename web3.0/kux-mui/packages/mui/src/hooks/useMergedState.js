/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

const useMergedState = (defaultStateValue, option = {}) => {
  const { defaultValue, value, onChange, postState } = option || {};
  const [innerValue, setInnerValue] = React.useState(() => {
    if (value !== undefined) {
      return value;
    }
    if (defaultValue !== undefined) {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
    return typeof defaultStateValue === 'function' ? defaultStateValue() : defaultStateValue;
  });

  let mergedValue = value !== undefined ? value : innerValue;
  if (postState) {
    mergedValue = postState(mergedValue);
  }

  // setState
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const triggerChange = React.useCallback(
    (newValue) => {
      setInnerValue(newValue);
      if (mergedValue !== newValue && onChangeRef.current) {
        onChangeRef.current(newValue, mergedValue);
      }
    },
    [mergedValue, onChangeRef],
  );

  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (value === undefined) {
      setInnerValue(value);
    }
  }, [value]);
  return [mergedValue, triggerChange];
};

export default useMergedState;
