/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Button, styled, useTheme } from '@kux/mui';
import BaseAlert from 'components/Account/Kyc3/Home/KycStatusCard/components/Alert';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import KycIcon from 'components/Account/Kyc3/Home/KycStatusCard/components/KycIcon';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import KycWelfare from 'components/Account/Kyc3/Home/KycStatusCard/modules/KycWelfare';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { searchToJson } from 'helper';
import { useDispatch } from 'react-redux';
import kyc_unverified from 'static/account/kyc/kyc3/kyc_unverified.png';
import kyc_unverified_dark from 'static/account/kyc/kyc3/kyc_unverified_dark.svg';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const ExBaseCard = styled(BaseCard)``;

const ExBaseAlert = styled(BaseAlert)`
  margin-top: 32px;
  margin-bottom: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 16px;
  }
`;

const ButtonBox = styled.div`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    justify-content: center;
    button {
      padding: 0 34.5px;
    }
  }
`;

const { soure } = searchToJson();

const KycStatusSuspend = ({ onClickVerify, sensorStatus }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleClickVerify = () => {
    trackClick(['GoVerify', '1'], { soure: soure || '', kyc_homepage_status: sensorStatus });
    onClickVerify && onClickVerify();
  };

  return (
    <ExBaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('kyc_homepage_subtitle')}</BaseTitle>
          <BaseDescription>{_t('kyc_homepage_describe_unverified')}</BaseDescription>
          <KycWelfare />
          <ExBaseAlert type="warning">{_t('kyc_homepage_continue1')}</ExBaseAlert>
          <ButtonBox>
            <VerifyButton onClick={handleClickVerify}>{_t('prYLqSst5vbHXHnauLRNM1')}</VerifyButton>
            <Button
              data-inspector="account_kyc_restart_btn"
              variant="text"
              size="large"
              style={{ marginLeft: 32 }}
              onClick={() => dispatch({ type: 'kyc/update', payload: { isRestartOpen: true } })}
            >
              {_t('a15c27c4b6224800a9ea')}
            </Button>
          </ButtonBox>
        </>
      }
      rightSlot={
        <KycIcon src={theme.currentTheme === 'light' ? kyc_unverified : kyc_unverified_dark} />
      }
    />
  );
};

export default KycStatusSuspend;
