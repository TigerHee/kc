import { styled, css } from '@kux/mui';

// 入金入口
export const StyledGoldEntry = styled.button`
  min-width: 84px;
  padding: 0 16px;
  height: 40px;
  display: flex;
  border-radius: 20px;
  border: none;
  background-color: ${(props) => props.theme.colors.primary8};
  color: ${(props) => props.theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 12px;
  align-items: center;
  font-family: inherit;
  ${(props) =>
    props.inTrade &&
    css`
      height: 32px;
    `}
  [dir='rtl'] & {
    margin-left: 12px;
    margin-right: 0;
  }
  svg {
    margin-right: 4px;
    [dir='rtl'] & {
      margin-left: 4px;
      margin-right: 0;
    }
  }
  span {
    max-width: 123px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  }
`;
