/*
 * @owner: borden@kupotech.com
 */
import { useRef, useMemo, useEffect, useReducer, useContext } from 'react';
import { getSelectorContext } from './createSelectorProvider';

export default function useContextSelector(context, selector) {
  const accessorContext = getSelectorContext(context);
  const [accessor, listeners] = useContext(accessorContext);
  const [, forceUpdate] = useReducer((dummy) => dummy + 1, 0);

  const latestSelector = useRef(selector);
  const latestSelectedState = useRef();

  const currentValue = accessor();

  if (currentValue === undefined) {
    throw new Error('You must call useContextSelector inside a valid context.');
  }

  const selectedState = useMemo(() => selector(currentValue), [currentValue, selector]);

  useEffect(() => {
    latestSelector.current = selector;
    latestSelectedState.current = selectedState;
  }, [currentValue, selectedState, selector]);

  useEffect(() => {
    const listener = (newValue) => {
      const newSelectedState = latestSelector.current && latestSelector.current(newValue);

      if (newSelectedState !== latestSelectedState.current) {
        forceUpdate({});
      }
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, [listeners]);

  return selectedState;
}
