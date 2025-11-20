/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Dialog } from '@kufox/mui';
import clxs from 'classnames';
import { _t } from 'tools/i18n';
import { useTheme } from '@kufox/mui';
import SecuritySetting from '../SecuritySetting';
import style from './style.less';

const SecurityDialog = (props) => {
  const theme = useTheme();
  const { currentTheme } = theme;
  const { open, onCancel, needEmail, needTwiceProtect, title } = props;
  const darkTheme = currentTheme === 'dark';
  return (
    <Dialog
      className={clxs(style.securityDialog, { [style.securityDialogInDark]: darkTheme })}
      title={
        <div className={clxs(style.title, { [style.titleInDark]: darkTheme })}>
          {_t('modal.title.notice')}
        </div>
      }
      open={open}
      showCloseX
      cancelText=""
      footer={null}
      onCancel={onCancel}
    >
      <SecuritySetting needEmail={needEmail} needTwiceProtect={needTwiceProtect} tip={title} />
    </Dialog>
  );
};

export default SecurityDialog;
