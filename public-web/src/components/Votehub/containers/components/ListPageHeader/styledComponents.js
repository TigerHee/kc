/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledHeader = styled.h1`
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  margin: 0;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    transform: rotate(180deg);
    [dir='rtl'] & {
      transform: rotate(0deg);
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-top: 40px;
    font-size: 24px;
    svg {
      width: 28px;
      height: 28px;
      margin-right: 6px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-top: 40px;
    font-size: 36px;
    svg {
      margin-right: 12px;
    }
  }
`;
