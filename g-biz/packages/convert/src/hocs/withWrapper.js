/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { Snackbar, ThemeProvider, EmotionCacheProvider } from '@kux/mui';
import StoreProvider from '../components/common/StoreProvider';
import useIsRTL from '../hooks/common/useIsRTL';

const { SnackbarProvider } = Snackbar;

export default (Component) => ({ basicData, ...otherProps }) => {
  const isRTL = useIsRTL();

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={basicData?.theme || 'light'}>
        <SnackbarProvider>
          <StoreProvider store={basicData}>
            <Component {...otherProps} />
          </StoreProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
};
