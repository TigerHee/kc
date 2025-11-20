/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Alert, Button, styled } from '@kux/mui';
import { KYC_ROLE_ENUM, KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { _t } from 'src/tools/i18n';
import assetSrc from 'static/account/kyc/au/asset.svg';
import infoSrc from 'static/account/kyc/au/info.svg';
import WaitIcon from 'static/account/kyc/kyb/wait_icon.svg';
import InfoList from '../../components/InfoList';
import Unlock from '../../components/Unlock';
import AdvancedStatement from './AdvancedStatement';
import { ButtonWrapper, InfoIcon, WarningAlert } from './styled';
import { VerifyButton } from './VerifyButton';

const ExAlert = styled(Alert)`
  gap: 8px;
  .KuxAlert-icon {
    margin-top: 0px;
    padding-right: 0px;
  }
  .KuxAlert-title {
    color: ${({ theme }) => theme.colors.text60};
    line-height: 140%;
  }
`;

export default function WholesaleCertCard({ role, status, onVerify, disabled, isWholesale }) {
  const isCompleted = status === KYC_STATUS_ENUM.VERIFIED;

  return (
    <>
      <Unlock locking={!isCompleted} list={[_t('f4f83d0563bf4800a900')]}>
        {isWholesale ? (
          <>
            <ExAlert
              showIcon
              icon={<img src={infoSrc} alt="icon" />}
              type="success"
              title={_t('ee1f5760eb6f4000a94e')}
            />
            <ButtonWrapper>
              <Button onClick={onVerify}>{_t('df057dd540e14000a6b7')}</Button>
            </ButtonWrapper>
          </>
        ) : !disabled ? (
          <>
            {status === KYC_STATUS_ENUM.VERIFYING ? (
              <WarningAlert>
                <img width={22} src={WaitIcon} alt="icon" />
                <span>{_t('2000532fd9fa4000a6dc')}</span>
              </WarningAlert>
            ) : !isCompleted ? (
              <InfoList
                list={[
                  {
                    title: _t('0f6d977aab6f4000a9e8'),
                    icon: <InfoIcon src={assetSrc} />,
                  },
                ]}
              />
            ) : null}
            {[
              KYC_STATUS_ENUM.UNVERIFIED,
              KYC_STATUS_ENUM.SUSPEND,
              KYC_STATUS_ENUM.REJECTED,
            ].includes(status) ? (
              <ButtonWrapper>
                <VerifyButton status={status} onClick={onVerify} />
              </ButtonWrapper>
            ) : null}
          </>
        ) : null}
      </Unlock>
      {role === KYC_ROLE_ENUM.WHOLESALE && <AdvancedStatement />}
    </>
  );
}
