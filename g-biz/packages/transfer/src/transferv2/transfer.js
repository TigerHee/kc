/**
 * Owner: solar@kupotech.com
 */
import { ThemeProvider, Snackbar, Notification, EmotionCacheProvider } from '@kux/mui';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel, isRTLLanguage } from '@utils';
import { useTransferDispatch } from './utils/redux';
import FormContent from './containers/Form';
import transferModel from './model';
import Modal from './containers/Modal';
import FailReason from './containers/FailReasons';
import { PropsProvider, useProps } from './hooks/props';
import { UnifiedProvider } from './hooks/unified';
import FormProvider from './containers/FormProvider';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, transferModel));
});

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
  const { i18n } = useTranslation();
  if (!_props.visible) return null;
  return (
    <ThemeProvider theme={_props.theme || 'light'}>
      <EmotionCacheProvider isRTL={isRTLLanguage(i18n.language)}>
        <SnackbarProvider>
          <NotificationProvider>
            <PropsProvider value={_props}>
              <UnifiedProvider>
                <Dialog />
                <FailReason />
              </UnifiedProvider>
            </PropsProvider>
          </NotificationProvider>
        </SnackbarProvider>
      </EmotionCacheProvider>
    </ThemeProvider>
  );
};
