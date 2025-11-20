/**
 * Owner: tiger@kupotech.com
 * account页面公用头部组件
 */
import { styled } from '@kux/mui';

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 64px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover8};
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 44px;
    padding: 0 16px;
  }
`;
const Title = styled.h1`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 130%;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;
const Content = styled.div``;

export default ({ title, children, ...otherProps }) => {
  return (
    <Wrapper {...otherProps}>
      <Title>{title}</Title>
      {children ? <Content>{children}</Content> : null}
    </Wrapper>
  );
};
