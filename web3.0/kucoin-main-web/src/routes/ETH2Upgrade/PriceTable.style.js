/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';
import CoinTransfer from 'components/common/CoinTransfer';

export const Wrapper = styled.div``;

export const TableWrapper = styled.div`
  border-radius: 16px;
  background: #fff;
  padding: ${({ responsive }) => (responsive.lg ? '8px 16px' : '20px')};
  margin-top: ${({ responsive }) => (responsive.sm ? '32px' : '24px')};
  display: ${({ responsive }) => (responsive.lg ? 'block' : 'flex')};
  flex-direction: ${({ responsive }) => (responsive.sm && !responsive.lg ? 'row' : 'column')};
  .KuxTable-root {
    table {
      tbody {
        tr {
          td {
            padding: 20px 0px;
          }
        }
        tr:hover {
          background: transparent !important;
          td {
            background: transparent !important;
            &:before,
            &:after {
              background: transparent !important;
            }
          }
        }
      }
    }
  }
`;

export const SymbolCode = styled.span`
  color: #1d1d1d;
  font-size: ${({ responsive }) => (responsive.sm ? '16px' : '14px')};
  font-weight: ${({ responsive }) => (responsive.lg ? '700' : '600')};
  line-height: 130%;
`;

export const SymbolWrapper = styled.a`
  color: rgba(29, 29, 29, 0.4);
  font-size: 12px;
  font-weight: 700;
  line-height: 130%;
  &:hover {
    color: rgba(29, 29, 29, 0.4);
  }
`;

export const FutureSymbol = styled.a`
  color: #1d1d1d;
  font-size: 16px;
  line-height: 130%;
  &:hover {
    color: #1d1d1d;
  }
`;

export const ColumnRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #1d1d1d;
  font-size: ${({ responsive }) => (responsive.lg ? '14px' : '16px')};
  font-weight: ${({ responsive }) => (responsive.lg ? '400' : '500')};
  line-height: 130%;
`;

export const PriceRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    color: #01bc8d;
    font-weight: ${({ responsive }) => (responsive.lg ? '400' : '500')};
    font-size: ${({ responsive }) => (responsive.lg ? '14px' : '16px')};
    line-height: 130%;
    :last-child {
      color: ${({ responsive }) => (responsive.lg ? '#1D1D1D' : 'rgba(29, 29, 29, 0.40)')};
      font-weight: ${({ responsive }) => (responsive.sm ? '500' : '400')};
    }
  }
`;

export const CoinCurrencyWrapper = styled(CoinTransfer)`
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.colors.text40};
  margin-right: 0;
  font-weight: 400;
`;

export const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ColWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 16px;
`;

export const ColTitle = styled.div`
  color: rgba(29, 29, 29, 0.4);
  font-size: ${({ responsive }) => (responsive.sm ? '14px' : '12px')};
  font-weight: 400;
  line-height: 130%;
`;

export const ColContent = styled.div`
  margin-top: 8px;
`;

export const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ActionWrapper = styled.div`
  align-self: ${({ responsive }) => (responsive.sm && !responsive.lg ? 'flex-end' : 'flex-start')};
  height: ${({ responsive }) => (responsive.sm && !responsive.lg ? '63.2px' : 'auto')};
  padding-top: ${({ responsive }) => (responsive.sm && !responsive.lg ? '14px' : '0px')};
  a:hover {
    color: #ffffff;
  }
`;

export const Line = styled.div`
  color: rgba(29, 29, 29, 0.4);
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  padding: 0px 2px;
`;
