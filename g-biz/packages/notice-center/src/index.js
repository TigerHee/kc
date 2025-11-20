import { ThemeProvider, EmotionCacheProvider, Notification, Snackbar } from '@kux/mui';
import { isRTLLanguage } from '@utils';
import Notice from './Notice';
import useLang from './hookTool/useLang';

export default function NoticeCenter(props) {
  const { i18n } = useLang();
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <Snackbar.SnackbarProvider>
        <Notification.NotificationProvider>
          <EmotionCacheProvider isRTL={isRTLLanguage(i18n.language)}>
            <Notice {...props} />
          </EmotionCacheProvider>
        </Notification.NotificationProvider>
      </Snackbar.SnackbarProvider>
    </ThemeProvider>
  );
}
