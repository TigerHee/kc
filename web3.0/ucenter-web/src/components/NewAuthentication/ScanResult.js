/**
 * Owner: lori@kupotech.com
 */
import { Button } from '@kux/mui';
import failImg from 'static/account/fail.svg';
import successImg from 'static/account/success.svg';
import { _t } from 'tools/i18n';
import { Des, StatusWrapper, Title } from './styled';

const ScanResult = ({ onSubmit, result, loading }) => {
  const isFail = Boolean(result.failReason);
  return (
    <StatusWrapper>
      <img src={isFail ? failImg : successImg} alt="result-icon" />
      <Title>
        {isFail ? _t('selfService2.faceVerify.fail') : _t('selfService2.faceVerify.success')}
      </Title>
      <Des>{result.failReason}</Des>
      <Button onClick={onSubmit} loading={loading}>
        {result.isRetry ? _t('retry') : _t('next')}
      </Button>
    </StatusWrapper>
  );
};

export default ScanResult;
