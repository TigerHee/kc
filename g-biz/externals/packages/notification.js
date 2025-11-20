import { Notification, ThemeProvider, Snackbar } from '@kux/mui';

const NotificationProvider = ({ theme, children }) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <Snackbar.SnackbarProvider>
        <Notification.NotificationProvider>{children}</Notification.NotificationProvider>
      </Snackbar.SnackbarProvider>
    </ThemeProvider>
  );
};
export default NotificationProvider;
