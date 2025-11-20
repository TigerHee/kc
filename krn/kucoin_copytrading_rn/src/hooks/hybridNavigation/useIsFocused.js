import React, {useEffect, useState} from 'react';

import {useNavigation} from './useNavigation';

export default function useIsFocused() {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(navigation.isFocused);
  const valueToReturn = navigation?.isFocused?.();

  if (isFocused !== valueToReturn) {
    // If the value has changed since the last render, we need to update it.
    // This could happen if we missed an update from the event listeners during re-render.
    // React will process this update immediately, so the old subscription value won't be committed.
    // It is still nice to avoid returning a mismatched value though, so let's override the return value.
    // This is the same logic as in https://github.com/facebook/react/tree/master/packages/use-subscription
    setIsFocused(valueToReturn);
  }

  useEffect(() => {
    if (!navigation?.addListener) {
      return;
    }
    const unsubscribeFocus = navigation.addListener('focus', () =>
      setIsFocused(true),
    );

    const unsubscribeBlur = navigation.addListener('blur', () =>
      setIsFocused(false),
    );

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  React.useDebugValue(valueToReturn);

  return valueToReturn;
}
