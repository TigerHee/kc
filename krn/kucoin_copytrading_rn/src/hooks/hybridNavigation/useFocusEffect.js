import React from 'react';

import {useNavigation} from './useNavigation';

export const useFocusEffect = effect => {
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!navigation || !navigation?.addListener) {
      return;
    }

    let isFocused = false;
    let cleanup;

    const callback = () => {
      const destroy = effect();

      if (destroy === undefined || typeof destroy === 'function') {
        return destroy;
      }
    };

    // We need to run the effect on intial render/dep changes if the screen is focused
    if (navigation.isFocused()) {
      cleanup = callback();
      isFocused = true;
    }

    const unsubscribeFocus = navigation.addListener('focus', () => {
      // If callback was already called for focus, avoid calling it again
      // The focus event may also fire on intial render, so we guard against runing the effect twice
      if (isFocused) {
        return;
      }

      if (cleanup !== undefined) {
        cleanup();
      }

      cleanup = callback();
      isFocused = true;
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (cleanup !== undefined) {
        cleanup();
      }

      cleanup = undefined;
      isFocused = false;
    });

    return () => {
      if (cleanup !== undefined) {
        cleanup();
      }

      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [effect, navigation]);
};
