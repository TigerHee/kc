/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Spin, styled } from '@kux/mui';
import { PADDING_LG, PADDING_XL, PADDING_XS } from '../constants/paddingSize';

export const Container = styled.div`
  margin-bottom: 80px;
`;
export const Header = styled.div`
  padding: 28.5px ${PADDING_XL}px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 130%;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 28.5px ${PADDING_LG}px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 28.5px ${PADDING_XS}px;
    font-size: 20px;
  }
`;
export const Body = styled.div`
  padding: 48px ${PADDING_XL}px 0;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 48px ${PADDING_LG}px 0;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px ${PADDING_XS}px 0;
  }
`;
export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;
export const Layout = styled.div`
  display: flex;
  gap: ${PADDING_XL}px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: ${PADDING_LG}px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: ${PADDING_XS}px;
  }
`;
export const LayoutLeft = styled.div`
  display: flex;
  flex: 0 0 calc((100% - ${PADDING_XL}px) * 2 / 3);
  max-width: calc((100% - ${PADDING_XL}px) * 2 / 3);
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-basis: auto;
    max-width: none;
  }
`;
export const LayoutRight = styled.div`
  display: flex;
  flex: 0 0 calc((100% - ${PADDING_XL}px) / 3);
  max-width: calc((100% - ${PADDING_XL}px) / 3);
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-basis: auto;
    max-width: none;
  }
`;
export const ExSpin = styled(Spin)`
  width: 100%;
`;
export const MethodBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
