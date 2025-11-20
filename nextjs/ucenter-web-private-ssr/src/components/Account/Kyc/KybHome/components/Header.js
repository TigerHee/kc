/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowLeft2Outlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

const Container = styled.div`
  /* border-bottom: 1px solid ${({ theme }) => theme.colors.cover8}; */
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
  margin-top: 26px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 16px;
  }
`;
const BackIcon = styled(ICArrowLeft2Outlined)`
  font-size: 16px;
`;
const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  margin-top: 28.5px;
  margin-bottom: 28.5px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 16px;
    margin-bottom: 16px;
    font-size: 20px;
  }
`;

const Header = ({ canBack = true, backText, onBack }) => {
  return (
    <Container>
      {canBack ? (
        <Back data-testid="back" onClick={onBack}>
          <BackIcon />
          {backText || _t('back')}
        </Back>
      ) : null}
      <Title>{_t('kyc.certification.mechanism')}</Title>
    </Container>
  );
};

export default Header;
