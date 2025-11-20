/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import classnames from 'classnames';
import { PADDING_LG, PADDING_XS } from 'src/components/Account/Kyc/constants/paddingSize';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  max-width: 1096px;
  margin: 0 auto 80px;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    margin: 0 auto 80px;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    max-width: 696px;
    margin: 0 auto 80px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 24px;
    margin: 0 auto 40px;
  }
`;
const Top = styled.div`
  padding: 0 ${PADDING_LG}px;
  &.topBorderBottom {
    border-bottom: 1px solid ${({ theme }) => theme.colors.cover8};
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 0 ${PADDING_LG}px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0 ${PADDING_XS}px;
  }
`;
const Bottom = styled.div`
  padding: 0 ${PADDING_LG}px;
  display: flex;
  gap: 64px;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    gap: 40px;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: 32px;
    padding: 0 ${PADDING_LG}px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 24px;
    padding: 0 ${PADDING_XS}px;
  }
`;
const BottomLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    flex: 3;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex: 1;
  }
`;
const BottomRight = styled.div`
  width: 404px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    flex: 2;
    width: auto;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex: 1;
  }
`;

const Layout = ({ top, bottomLeft, bottomRight, needTopBorder = false }) => {
  return (
    <Container>
      <Top
        className={classnames({
          topBorderBottom: needTopBorder,
        })}
      >
        {top}
      </Top>
      <Bottom>
        <BottomLeft className="BottomLeft">{bottomLeft}</BottomLeft>
        <BottomRight className="BottomRight">{bottomRight}</BottomRight>
      </Bottom>
    </Container>
  );
};

export default Layout;
