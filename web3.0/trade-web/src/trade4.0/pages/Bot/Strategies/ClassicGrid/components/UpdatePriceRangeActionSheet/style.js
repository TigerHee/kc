/**
 * Owner: mike@kupotech.com
 */
import AccountBalance from 'Bot/components/Common/Investment/AccountBalance';
import styled from '@emotion/styled';
import GridNumFormItem from 'ClassicGrid/Create/GridNumFormItem';

export const MAccountBalance = styled(AccountBalance)`
  margin-top: 8px;
  margin-bottom: 8px;
  .balance-name,
  .balance-value {
    font-size: 14px;
  }
  .balance-value {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const MGridNumFormItem = styled(GridNumFormItem)`
  .grid-profit {
    font-size: 14px;
    span {
      &:last-of-type {
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }
`;
