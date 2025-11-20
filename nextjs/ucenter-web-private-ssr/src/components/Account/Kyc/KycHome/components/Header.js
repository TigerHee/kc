/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowLeft2Outlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

const Container = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: column;
  margin-top: ${({ hasBack }) => (hasBack ? '26px' : '64px')};
  ${({ theme }) => theme.breakpoints.down('xl')} {
    margin-top: ${({ hasBack }) => (hasBack ? '26px' : '40px')};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 20px;
    margin-top: ${({ hasBack }) => (hasBack ? '12px' : '20px')};
  }
`;
const Back = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  display: flex;
  gap: 8px;
  width: fit-content;
  align-items: center;
  cursor: pointer;
`;
const BackIcon = styled(ICArrowLeft2Outlined)`
  font-size: 16px;
`;
const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  display: flex;
  gap: 12px;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const VerifyRegion = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  display: flex;
  gap: 12px;
  & :nth-child(odd) {
    color: ${({ theme }) => theme.colors.text40};
  }
  & :nth-child(even) {
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 500;
    img {
      width: 24px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
    line-height: 130%;
  }
`;

const Header = ({ regionIcon, regionName, canBack = true, backText, onBack }) => {
  return (
    <Container hasBack={canBack}>
      {canBack ? (
        <Back data-testid="back" onClick={onBack}>
          <BackIcon />
          {backText || _t('back')}
        </Back>
      ) : null}

      <Title>
        {_t('kyc.certification.personal')}
        <VerifyRegion>
          <div>{_t('0418ee48e1824800ade2')}</div>
          <div>
            {regionIcon ? <img src={regionIcon} alt="icon" /> : null}
            {regionName}
          </div>
        </VerifyRegion>
      </Title>
    </Container>
  );
};

export default Header;
