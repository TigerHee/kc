/**
 * Owner: june.lee@kupotech.com
 */
import React from 'react';
import { Button, useEventCallback, Dialog as Confirm, useTheme } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { ConfirmContent, Congratulations, CongratulationsDesc } from './style';
import successDark from '../../../../static/success-dark.svg';
import successLight from '../../../../static/success-light.svg';

const ResultDialog = ({ open, onCancel, title, description, extra, ...restProps }) => {
  const { currentTheme } = useTheme();
  const { t: _t } = useTranslation('convert');
  const handleCancel = useEventCallback((...rest) => {
    if (onCancel) onCancel(...rest);
  });

  return (
    <Confirm header={null} footer={null} open={open} {...restProps}>
      <ConfirmContent>
        {/* <Status name="success" /> */}
        <img
          width={148}
          height={148}
          alt="result"
          src={currentTheme === 'dark' ? successDark : successLight}
        />
        <Congratulations>{title || _t('e63817d0ab8c4000a3af')}!</Congratulations>
        <CongratulationsDesc>{description || _t('429897e12f9c4000a131')}</CongratulationsDesc>
        {extra}
        <Button fullWidth onClick={handleCancel}>
          {_t('i.know')}
        </Button>
      </ConfirmContent>
    </Confirm>
  );
};

export default ResultDialog;
