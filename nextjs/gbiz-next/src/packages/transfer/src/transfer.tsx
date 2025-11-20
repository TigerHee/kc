/**
 * Owner: solar@kupotech.com
 */
import { ThemeProvider, Snackbar, Notification, EmotionCacheProvider } from '@kux/mui';
import { useEffect } from 'react';
import { useTranslation } from 'tools/i18n';
import useLang from 'hooks/useLang'
import { useTransferDispatch } from './utils/redux';
import FormContent from './containers/Form';
import Modal from './containers/Modal';
import FailReason from './containers/FailReasons';
import { PropsProvider, useProps } from './hooks/props';
import FormProvider from './containers/FormProvider';
import Provider from './components/Provider'

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

// FIXME
// window.getDvaApp().model(transferModel);

function Dialog() {
  const { visible, onClose } = useProps();
  
  const dispatchTransfer = useTransferDispatch();
  const { t: _t } = useTranslation('transfer');
  useEffect(() => {
    return () => {
      dispatchTransfer({
        type: 'reset',
      });
    };
  }, []);

  return (
    <FormProvider>
      <Modal visible={visible} onClose={onClose} title={_t('transfer')}>
        <FormContent />
      </Modal>
    </FormProvider>
  );
}

export default (_props) => {
  const {isRTL} = useLang();
  if (!_props.visible) return null
  
  return (
    <Provider>
      <EmotionCacheProvider isRTL={isRTL}>
        <ThemeProvider theme={_props.theme || 'light'}>
            <SnackbarProvider>
              <NotificationProvider>
                <PropsProvider value={_props}>
                  <Dialog />
                  <FailReason />
                </PropsProvider>
              </NotificationProvider>
            </SnackbarProvider>
        </ThemeProvider>
      </EmotionCacheProvider>
    </Provider>
  );
};
