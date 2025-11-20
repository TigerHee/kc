/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useTheme } from '@kux/mui';
import warnSrc from 'static/account/kyc/warn.svg';
import warnDarkSrc from 'static/account/kyc/warn_dark.svg';
import { _t } from 'tools/i18n';
import { DialogDesc, DialogIcon, DialogTitle, ExDialog } from './styled';

const RestartDialog = ({ open, onConfirm, onCancel }) => {
  const theme = useTheme();

  return (
    <ExDialog
      open={open}
      header={null}
      okText={_t('e45d18983acd4000a57a')}
      okButtonProps={{ size: 'large' }}
      onOk={onConfirm}
      cancelButtonProps={{ size: 'large' }}
      onCancel={onCancel}
    >
      <DialogIcon src={theme.currentTheme === 'dark' ? warnDarkSrc : warnSrc} />
      <DialogTitle>{_t('73a28b19e4fb4000a8c8')}</DialogTitle>
      <DialogDesc>{_t('ab59e618b3704000a309')}</DialogDesc>
    </ExDialog>
  );
};

export default RestartDialog;
