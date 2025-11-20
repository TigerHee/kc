/**
 * Owner: mike@kupotech.com
 */
import dropStyle from '@/components/DropdownSelect/style';
import { styled } from '@/style/emotion';

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  padding: 0 12px;
  margin-top: 4px;
  .fund-tools-r {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .KuxCheckbox-wrapper {
    display: flex;
    align-items: center;
    width: fit-content;
    font-size: 0;
    & > span:last-of-type {
      margin-left: 3px;
      color: ${(props) => props.theme.colors.text40};
      font-size: 12px;
      line-height: 14px;
    }
    .KuxCheckbox-inner {
      width: 14px;
      height: 14px;
      border: 1px solid ${(props) => (props.active ? 'transparent' : props.theme.colors.text20)};
    }
  }
  .FUTURES_POSITION {
    margin-left: 10px;
    text-align: right;
  }
`;

export const DropdownExtend = {
  Icon: styled(dropStyle.Icon)`
    color: ${({ theme }) => {
      return theme.colors.icon;
    }};
  `,
  Text: styled(dropStyle.Text)`
    padding: 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${(props) => props.theme.colors.textPrimary};
  `,
  List: styled(dropStyle.List)`
    max-height: 300px;
    overflow-y: auto;
    font-size: 14px;
    & .dropdown-value {
      padding: 0 2px 0 0;
    }
    & .active-dropdown-item {
      color: ${({ theme }) => {
        return theme.colors.text;
      }};
    }
  `,
};
