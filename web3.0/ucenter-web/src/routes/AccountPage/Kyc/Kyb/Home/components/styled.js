/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import {
  PADDING_LG,
  PADDING_XL,
  PADDING_XS,
} from 'src/components/Account/Kyc/constants/paddingSize';

export const Header = styled.div`
  padding: 28.5px ${PADDING_XL}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 28.5px ${PADDING_LG}px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 28.5px ${PADDING_XS}px;
  }
`;
export const Layout = styled.div`
  padding: 48px ${PADDING_XL}px 0;
  display: flex;
  gap: 64px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: 48px;
    padding: 48px ${PADDING_LG}px 0;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 28px;
    padding: 24px ${PADDING_XS}px 0;
  }
`;
export const LayoutLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  flex: 1 1 700px;
`;
export const LayoutRight = styled.div`
  flex: 1 1 404px;
`;
export const Warning = styled.div`
  color: ${({ theme }) => theme.colors.complementary};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  display: flex;
  gap: 6px;
  align-items: flex-start;
  margin-top: 24px;
`;
