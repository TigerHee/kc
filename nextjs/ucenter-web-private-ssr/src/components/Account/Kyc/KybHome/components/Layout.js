/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { PADDING_LG, PADDING_XL, PADDING_XS } from '../../constants/paddingSize';

const Layout = styled.div`
  display: flex;
  gap: 48px;
  padding: 40px ${PADDING_XL}px;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    flex-direction: column;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    gap: 40px;
    padding: 24px ${PADDING_LG}px ${PADDING_LG}px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 24px;
    padding: ${PADDING_XS}px;
  }
`;
Layout.Left = styled.div`
  flex: 1 1 780px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow: hidden;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    flex: none;
  }
`;
Layout.Right = styled.div`
  flex: 1 1 404px;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    flex: none;
  }
`;

export default Layout;
