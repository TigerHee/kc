/**
 * Owner: harry.lai@kupotech.com
 */
import React, { memo } from 'react';
import Button from '@mui/Button';
import { useTheme } from '@emotion/react';
import SvgComponent from '@/components/SvgComponent';
import { _t } from 'src/utils/lang';
import { FinishStyledDialog, FinishDialogWrap, Tip } from './style';

const FinishDialog = (props) => {
  const { visible, onClose } = props;
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <FinishStyledDialog
      open={visible}
      showCloseX={false}
      header={null}
      maskClosable
      centeredFooterButton
      onCancel={onClose}
      footer={
        <Button onClick={onClose} fullWidth type="primary">
          {_t('confirmed')}
        </Button>
      }
    >
      <FinishDialogWrap>
        <SvgComponent
          width={148}
          height={148}
          keepOrigin
          color="none"
          type={isDark ? 'survey_finish_dark' : 'survey_finish'}
          fileName="survey"
        />
        <Tip>{_t('vbMtf33ctymeguVuqtD4FL')}</Tip>
      </FinishDialogWrap>
    </FinishStyledDialog>
  );
};

export default memo(FinishDialog);
