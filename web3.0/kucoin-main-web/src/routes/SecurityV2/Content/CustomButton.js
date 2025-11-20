/**
 * Owner: brick.fan@kupotech.com
 */

import { Link } from 'components/Router';
import { styled } from '@kux/mui';

const Wrapper = styled(Link)`
  padding: 0 12px;
  height: 66px;
  font-size: 20px;
  font-weight: 400;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.cover2};
  border-radius: 12px;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: none;
  .a-text {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  &:hover {
    color: ${({ theme }) => (theme.currentTheme === 'light' ? '#FFF' : '#F3F3F3')};
    background-color: ${({ theme }) => (theme.currentTheme === 'light' ? '#1D1D1D' : '#01BC8D')};
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 100%;
    padding: 12px 16px;
    font-size: 14px;
    border-radius: 6px;
    &:hover {
      color: ${({ theme }) => theme.colors.text};
      background-color: ${({ theme }) => theme.colors.cover2};
    }
  }
`;

const CustomButton = ({ href, children }) => {
  return (
    <Wrapper href={href}>
      <span className="a-text">{children}</span>
    </Wrapper>
  );
};

export default CustomButton;
