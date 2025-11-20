/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ThemeProvider, EmotionCacheProvider, Snackbar, Notification } from '@kux/mui';
import { Provider } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import useIsRTL from '../hooks/useIsRTL';
import getDva from './getDva';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

const withProvider = (Component, { theme = 'light' }) => (props) => {
  const isRTL = useIsRTL();
  const storeRef = useRef();
  const [hasStore, setHasStore] = useState(false);

  useEffect(() => {
    getDva().then(({ store }) => {
      storeRef.current = store;
      setHasStore(true);
    });
  }, []);

  if (!hasStore) {
    return null;
  }

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <NotificationProvider>
            <Provider store={storeRef.current}>
              <Component {...props} />
            </Provider>
          </NotificationProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
};

export default withProvider;
