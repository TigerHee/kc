/**
 * Owner: borden@kupotech.com
 */
import { styled, colors } from '@/style/emotion';

export const Text = styled.div`
  display: flex;
  color: ${(props) => props.theme.colors.text};
  background-color: transparent;
  padding: 0 2px 0 16px;
  cursor: pointer;
`;

export const Icon = styled.div`
  color: ${(props) => colors(props, 'text')};
  display: flex;
  align-items: center;
  cursor: pointer;
  & > svg {
    display: block;
    ${({ isActive }) => (isActive ? 'transform: rotate(180deg);' : '')}
    transition: transform 400ms;
  }
`;

export const List = styled.div`
  overflow: hidden;
  background: ${(props) => colors(props, 'layer')};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  & .dropdown-item {
    padding: 10px 16px;
    min-width: 80px;
    color: ${({ theme }) => {
      return theme.colors.text;
    }};
    cursor: pointer;
    &.disabled {
      color: ${({ theme }) => {
        return theme.colors.text30;
      }};
      cursor: default;
    }
    &:hover {
      background: ${(props) => colors(props, 'cover4')};
    }
  }
  & .disabled-dropdown-item {
    cursor: not-allowed;
    color: ${(props) => colors(props, 'text20')};
    &:hover {
      background: ${(props) => colors(props, 'layer')};
    }
  }
  & .active-dropdown-item {
    color: ${({ theme }) => {
      return theme.colors.primary;
    }};
  }
`;

export const Header = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  padding: 12px 16px 4px 16px;
  color: ${({ theme }) => {
    return theme.colors.text60;
  }};
`;

export const Footer = styled.div`
  padding: 0 16px 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: ${({ theme }) => {
    return theme.colors.text;
  }};
`;

export default { Text, Icon, List, Header, Footer };
