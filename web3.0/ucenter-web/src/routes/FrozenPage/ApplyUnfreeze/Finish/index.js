/**
 * Owner: lori@kupotech.com
 */
import { useTheme } from '@kux/mui';
import React from 'react';
import processingImgDark from 'static/account/processing-new-dark.svg';
import processingImg from 'static/account/processing-new.svg';
import { _t } from 'tools/i18n';
import { FinishWrapper, StatusTitle, Warning } from './styled';

const Finish = React.memo(() => {
  // 等待人工审核
  const theme = useTheme();
  return (
    <FinishWrapper data-inspector="applyUnfreeze_wait">
      <img src={theme.currentTheme === 'light' ? processingImg : processingImgDark} alt="tipImg" />
      <StatusTitle>{_t('selfService2.result.wait')}</StatusTitle>
      <Warning>
        1.{_t('application.submited.desc')}
        <br />
        2.{_t('security.24h.limit')}
      </Warning>
    </FinishWrapper>
  );
});

export default Finish;
