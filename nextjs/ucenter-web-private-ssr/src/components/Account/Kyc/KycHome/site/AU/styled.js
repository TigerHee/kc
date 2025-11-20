/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICCheckboxArrowOutlined, ICFailOutlined } from '@kux/icons';
import { Button as OriginButton, styled, Tag } from '@kux/mui';
import BaseTitle from 'src/components/Account/Kyc3/Home/KycStatusCard/components/Title';
import { PADDING_LG, PADDING_XL, PADDING_XS } from '../../../constants/paddingSize';

export const Container = styled.div`
  .topBox {
    align-items: center;
  }
`;
export const Header = styled.div`
  padding: 28.5px ${PADDING_XL}px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 28.5px ${PADDING_LG}px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: ${PADDING_XS}px;
  }
`;
export const VerifyRegion = styled.div`
  font-size: 16px;
  font-style: normal;
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
    img {
      width: 24px;
      height: 16px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
    line-height: 130%;
  }
`;
export const Layout = styled.div`
  display: flex;
  gap: 64px;
  padding: 40px ${PADDING_XL}px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: 32px;
    padding: 24px ${PADDING_LG}px 32px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 24px;
    padding: ${PADDING_XS}px;
  }
`;
export const LayoutLeft = styled.div`
  flex: 1 1 780px;
  .BaseCardBottomWrapper {
    margin-top: 24px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-top: 0;
    }
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex: none;
  }
`;
export const LayoutRight = styled.div`
  flex: 1 1 404px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex: none;
  }
`;
export const ExButton = styled(OriginButton)`
  padding: 0 24px;
  margin: 24px 0 0;
  display: flex;
  gap: 4px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin: 16px auto 0;
  }
`;
export const ExBaseTitle = styled(BaseTitle)`
  font-size: 20px;
  font-weight: 700;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 20px;
  }
`;
export const CheckReason = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
  text-decoration-line: underline;
  cursor: pointer;
`;
export const ExTag = styled(Tag)`
  font-size: 14px;
  line-height: 140%;
  padding: 2px 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 2px 4px;
    font-size: 12px;
  }
`;
export const WarningAlert = styled.div`
  display: flex;
  gap: 8px;
  color: ${({ theme }) => theme.colors.complementary};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  align-items: flex-start;
  span {
    padding: 1px 0;
  }
`;
export const InfoIcon = styled.img`
  width: 16px;
  transform: translateY(2px);
  ${({ theme }) => theme.breakpoints.down('sm')} {
    transform: translateY(1px);
  }
`;
export const SuccessIcon = styled(ICCheckboxArrowOutlined)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primary};
  transform: translateY(3px);
  ${({ theme }) => theme.breakpoints.down('sm')} {
    transform: translateY(1px);
  }
`;
export const ErrorIcon = styled(ICFailOutlined)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.secondary};
  transform: translateY(3px);
  ${({ theme }) => theme.breakpoints.down('sm')} {
    transform: translateY(1px);
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  gap: 32px;
  & > button:nth-child(odd) {
    display: flex;
    gap: 4px;
    padding: 0 32px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 12px;
  }
`;
