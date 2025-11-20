/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import LinkFailed from 'static/account/linkfailed.svg';
import { _t } from 'tools/i18n';
import { ContainerWrapper, ContentWrapper, FailedIcon, FailedText } from '../styled';

const CodeError = () => {
  useLocale();
  return (
    <ContainerWrapper style={{ paddingTop: '80px' }}>
      <ContentWrapper style={{ alignItems: 'center' }}>
        <FailedIcon alt="failed-icon" src={LinkFailed} />
        <FailedText>{_t('link.failed')}</FailedText>
      </ContentWrapper>
    </ContainerWrapper>
  );
};

export default CodeError;
