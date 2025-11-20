/**
 * Owner: mike@kupotech.com
 */
import { styled } from '@/style/emotion';
import Table from '@mui/Table';
import { ButtonWeight } from '@mui/Button';
import CoinIcon from '@/components/CoinIcon';
import CoinCurrencyRaw from '@/components/CoinCurrency';
import { ICMoreOutlined } from '@kux/icons';

export const HasSubLists = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    color: ${(props) => props.theme.colors.icon};
  }

  [dir='rtl'] & {
    svg {
      transform: rotate(180deg);
    }
  }
`;

export const Flex = styled.div`
  display: flex;
  width: 100%;
  ${({ column }) => {
    if (column) {
      return {
        flexDirection: column,
      };
    }
  }}
  ${({ vc }) => {
    if (vc) {
      return {
        alignItems: 'center',
      };
    }
  }}
  ${({ sb }) => {
    if (sb) {
      return {
        justifyContent: 'space-between',
      };
    }
  }}
  ${({ color, theme }) => {
    if (color) {
      return {
        color: theme.colors[color],
      };
    }
  }}
  ${({ fs }) => {
    if (fs) {
      return {
        fontSize: `${fs}px`,
      };
    }
  }}
`;
export const FundBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
export const TableBox = styled.div`
  padding: 0 12px;
  flex: 1;
  overflow-y: auto;
  td {
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    color: ${(props) => props.theme.colors.text60};
  }
`;

export const Text = styled.span`
  ${({ color, theme }) => {
    if (color) {
      return {
        color: theme.colors[color],
      };
    }
  }}
  ${({ fs }) => {
    if (fs) {
      return {
        fontSize: `${fs}px`,
      };
    }
  }}
  ${({ mb }) => {
    return {
      marginBottom: `${mb}px`,
    };
  }}
`;

export const SymbolIcon = styled(CoinIcon)`
  span {
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ fontSize = 12 }) => `${fontSize}px`};
    display: inline-block;
    line-height: 100%;
  }
  > img {
    margin-right: 8px;
  }
  ${({ mr }) => {
    return {
      marginRight: `${mr}px`,
    };
  }}
  ${({ mb }) => {
    return {
      marginBottom: `${mb}px`,
    };
  }}
`;

export const CustomTable = styled(Table)`
  thead th {
    height: 28px;
    font-size: 12px;
    padding: 2px 0;
    &:first-of-type {
      padding-left: 0 !important;
    }
    .KuxBox-root {
      span.KuxBox-root {
        margin-top: 2px;
      }
    }
  }
  tbody {
    td {
      padding: 4px 0;
    }
    tr td {
      &:last-of-type {
        padding-right: 0 !important;
        &:after {
          display: none;
        }
      }
      &:first-of-type {
        padding-left: 0 !important;
      }
    }
  }
`;

export const CoinCurrency = styled(CoinCurrencyRaw)`
  color: ${({ theme }) => theme.colors.text40};
`;

export const CICMoreOutlined = styled(ICMoreOutlined)`
  fill: ${({ theme }) => theme.colors.icon};
  cursor: pointer;
  &:hover {
    fill: ${({ theme }) => theme.colors.text};
  }
`;

export const MWrap = {
  box: styled.div`
    padding: 12px 0;
    border-bottom: 1px solid ${(props) => props.theme.colors.divider4};
    display: flex;
    flex-wrap: wrap;
    gap: ${({ screen }) => (screen === 'md' || screen === 'sm' ? '10px' : '12px')};
  `,
  item: styled.div`
    display: flex;
    &.oneCloumn {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .value {
        margin-top: 0;
      }
      .symbolsWrapper {
        width: auto;
        display: inline-flex;
        flex-direction: column;
      }
      .valueWrapper {
        div {
          text-align: right;
          justify-content: flex-end;
        }
      }
    }
    &.threeCloumn {
      .label {
        display: block;
        margin-bottom: 6px;
      }
      display: block;
      width: calc(33.3% - 8px);
      .kfe {
        justify-content: flex-start !important;
      }
      &:nth-of-type(3n + 1) {
        text-align: right;
        .kfe {
          justify-content: flex-start !important;
        }
      }
    }
    &.fourCloumn {
      .label {
        display: block;
        margin-bottom: 6px;
      }
      display: block;
      width: calc(25% - 9px);
      .kfe {
        justify-content: flex-start !important;
      }
      &:nth-of-type(4n + 1) {
        text-align: right;
        .kfe {
          justify-content: flex-start !important;
        }
      }
    }
  `,
  LG1Wrap: styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ screen }) => (screen === 'md' || screen === 'sm' ? '10px' : '12px')};
    width: 100%;
    .threeCloumn {
      .label {
        display: block;
        margin-bottom: 6px;
      }
      display: block;
      width: calc(33.3% - 8px);
      &:nth-of-type(3n) {
        text-align: right;
      }
    }
    .fourCloumn {
      .label {
        display: block;
        margin-bottom: 6px;
      }
      display: block;
      width: calc(25% - 9px);
      &:nth-of-type(4n) {
        text-align: right;
      }
    }
  `,
  LG1Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(4, auto);
    grid-template-rows: 2;
    grid-row-gap: 12px;
    grid-column-gap: 12px;
    line-height: 20px;
  `,
};

export const LoginWrapper = styled.div`
  height: 100%;
  flex: 1;
  padding: 0 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: ${(props) => (props.screen === 'md' || props.screen === 'lg' ? '14px' : '16px')};
  line-height: ${(props) => (props.screen === 'md' || props.screen === 'lg' ? '18px' : '21px')};
  color: ${(props) => props.theme.colors.text};
`;

export const StyledButtonWeight = styled(ButtonWeight)`
  height: unset;
`;

export const OperationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
