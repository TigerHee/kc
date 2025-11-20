/**
 * Owner: vijay.zhou@kupotech.com
 */

import { Button, styled } from '@kux/mui';
import { fade } from '@kux/mui/utils/colorManipulator';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { searchToJson, showDateTimeByZone } from 'helper';
import { useDispatch, useSelector } from 'react-redux';
import kyc_clearance from 'static/account/kyc/kyc3/kyc_clearance.png';
import kyc_reset from 'static/account/kyc/kyc3/kyc_reset.png';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const ClearanceWrapper = styled.div`
  border-radius: 20px;
  background-color: ${({ theme, isRest }) =>
    fade(isRest ? theme.colors.complementary : theme.colors.secondary, 0.04)};
  padding: 31px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 15px;
  }
`;

const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`;
const MainLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Icon = styled.img`
  width: 160px;
  height: 160px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 140px;
    height: 140px;
  }
`;
const MainRight = styled.div`
  padding: 6px 0;
`;
const ExBaseTitle = styled(BaseTitle)`
  margin-bottom: 8px;
`;
const ExBaseDescription = styled(BaseDescription)`
  margin-bottom: 24px;
  font-size: 14px;
  span {
    color: ${({ theme }) => theme.colors.text};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
    line-height: 150%;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider8};
  margin: 24px 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin: 16px 0;
  }
`;

const BottomWrapper = styled.div``;

const BottomDescription = styled(BaseDescription)`
  font-size: 14px;
  line-height: 150%;
  span {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
    cursor: pointer;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    text-align: left;
  }
`;

const ButtonBox = styled.div`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    gap: 32px;
    justify-content: center;
    button {
      padding: 0 34.5px;
    }
  }
`;

const { soure } = searchToJson();

const KycStatusClearance = ({ onClickVerify, sensorStatus }) => {
  const kycClearInfo = useSelector((s) => s.kyc?.kycClearInfo);
  const isReset = +kycClearInfo?.clearStatus === 2;
  const dispatch = useDispatch();

  const handleClickJoinUs = (e) => {
    if (e.target.tagName === 'SPAN' && kycClearInfo.joinUsUrl) {
      trackClick(['JoinGroup', '1'], { soure: soure || '', kyc_homepage_status: sensorStatus });
      window.open(kycClearInfo.joinUsUrl);
    }
  };

  const handleClickVerify = () => {
    trackClick(['GoVerify', '1'], { soure: soure || '', kyc_homepage_status: sensorStatus });
    onClickVerify && onClickVerify();
  };

  return (
    <ClearanceWrapper isRest={isReset}>
      <MainWrapper>
        <MainLeft>
          <Icon src={isReset ? kyc_reset : kyc_clearance} />
        </MainLeft>
        <MainRight>
          {kycClearInfo?.topMsg ? <ExBaseTitle>{kycClearInfo.topMsg}</ExBaseTitle> : null}
          {kycClearInfo?.msg ? (
            <ExBaseDescription>
              {kycClearInfo.msg.replace(
                /\{t}/g,
                kycClearInfo?.clearAt
                  ? showDateTimeByZone(kycClearInfo?.clearAt, 'YYYY/MM/DD HH:mm:ss', 0)
                  : '--',
              )}
            </ExBaseDescription>
          ) : null}
          <ButtonBox>
            <VerifyButton onClick={handleClickVerify}>{_t('3Dn54WPNF5VzE5PZNVQ42C')}</VerifyButton>
            <Button
              variant="text"
              size="large"
              style={{ marginLeft: 32 }}
              onClick={() => dispatch({ type: 'kyc/update', payload: { isRestartOpen: true } })}
            >
              {_t('a15c27c4b6224800a9ea')}
            </Button>
          </ButtonBox>
        </MainRight>
      </MainWrapper>
      {kycClearInfo?.joinUsMsg ? (
        <>
          <Divider />
          <BottomWrapper>
            <BottomDescription onClick={handleClickJoinUs}>
              {kycClearInfo.joinUsMsg}
            </BottomDescription>
          </BottomWrapper>
        </>
      ) : null}
    </ClearanceWrapper>
  );
};

export default KycStatusClearance;
