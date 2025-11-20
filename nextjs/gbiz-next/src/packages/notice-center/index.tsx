import { ThemeProvider, Notification, Snackbar, CacheProvider } from '@kux/mui-next';
import Notice from './Notice';
import { NoticeCenterStoreProvider } from 'packages/notice-center/model';
import { NoticeNoticeStoreProvider } from 'packages/notice-center/models/notice';
import useLang from 'hooks/useLang';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

export default function NoticeCenter(props) {
  const { isRTL } = useLang();
  return (
    <NoticeCenterStoreProvider>
      <NoticeNoticeStoreProvider>
        <ThemeProvider theme={props.theme || 'light'}>
          <CacheProvider isRTL={isRTL}>
            <SnackbarProvider>
              <NotificationProvider>
                <Notice {...props} />
              </NotificationProvider>
            </SnackbarProvider>
          </CacheProvider>
        </ThemeProvider>
      </NoticeNoticeStoreProvider>
    </NoticeCenterStoreProvider>
  );
}
