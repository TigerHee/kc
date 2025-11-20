/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { Button } from '@kux/mui';
import { AU_KYC1_BENEFITS } from 'src/constants/kyc/benefits';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { addLangToPath, _t } from 'src/tools/i18n';
import addressSrc from 'static/account/kyc/au/address.svg';
import faceSrc from 'static/account/kyc/au/face.svg';
import photoSrc from 'static/account/kyc/au/photo.svg';
import WaitIcon from 'static/account/kyc/kyb/wait_icon.svg';
import InfoList from '../../components/InfoList';
import Unlock from '../../components/Unlock';
import { ButtonWrapper, InfoIcon, WarningAlert } from './styled';
import { VerifyButton } from './VerifyButton';

export default function BasicCertCard({
  status,
  showRestart = true,
  onVerify,
  onRestart,
  className,
}) {
  return (
    <Unlock className={className} locking={status} list={AU_KYC1_BENEFITS}>
      {status === KYC_STATUS_ENUM.VERIFYING ? (
        <WarningAlert>
          <img width={22} src={WaitIcon} alt="icon" />
          <span>{_t('2000532fd9fa4000a6dc')}</span>
        </WarningAlert>
      ) : status !== KYC_STATUS_ENUM.VERIFIED ? (
        <InfoList
          list={[
            { title: _t('42114805755e4000a9a7'), icon: <InfoIcon src={photoSrc} /> },
            { title: _t('f431ca73db934800a7bd'), icon: <InfoIcon src={faceSrc} /> },
            {
              title: _t('c0486ebebc854000ade8'),
              icon: <InfoIcon src={addressSrc} />,
            },
          ]}
        />
      ) : null}
      {[KYC_STATUS_ENUM.UNVERIFIED, KYC_STATUS_ENUM.SUSPEND, KYC_STATUS_ENUM.REJECTED].includes(
        status,
      ) ? (
        <ButtonWrapper>
          <VerifyButton status={status} onClick={onVerify} />
          {showRestart ? (
            <Button variant="text" onClick={onRestart}>
              {_t('a15c27c4b6224800a9ea')}
            </Button>
          ) : null}
        </ButtonWrapper>
      ) : null}
      {status === KYC_STATUS_ENUM.VERIFIED ? (
        <ButtonWrapper>
          <Button
            variant="outlined"
            onClick={() =>
              (window.location.href = addLangToPath(`/assets/coin/${window._BASE_CURRENCY_}`))
            }
          >
            <span>{_t('5eb06d178a384800a162')}</span>
            <ICArrowRight2Outlined size={16} />
          </Button>
        </ButtonWrapper>
      ) : null}
    </Unlock>
  );
}
