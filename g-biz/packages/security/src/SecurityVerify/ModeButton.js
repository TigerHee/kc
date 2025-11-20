/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Button } from '@kufox/mui';
import { VER_SMS, VER_EMAIL } from '../common/constants';
import { useLang } from '../hookTool';

export default ({ show, mode, onChange }) => {
  const { t } = useLang();

  if (show) {
    if (mode === VER_SMS) {
      return (
        <Button
          variant="text"
          onClick={() => {
            onChange(VER_EMAIL);
          }}
        >
          {t('switch_2fa')}
        </Button>
      );
    }
    if (mode === VER_EMAIL) {
      return (
        <Button
          variant="text"
          onClick={() => {
            onChange(VER_SMS);
          }}
        >
          {t('switch_sms')}
        </Button>
      );
    }
  }

  return null;
};
