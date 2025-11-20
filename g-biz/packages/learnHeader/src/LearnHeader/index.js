/**
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { ThemeProvider, Snackbar, Notification } from '@kux/mui';
import Header from './Header';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;
export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <Header {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
