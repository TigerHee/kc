/**
 * Owner: solar@kupotech.com
 */
import { styled, Select, Checkbox, Table, Spin, css } from '@kux/mui';

export const StyledOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .option-left {
    display: flex;
    gap: 8px;
    .coin-icon {
      width: 24px;
      height: 24px;
    }
    span {
      font-weight: 500;
      ${(props) => props.theme.fonts.size.xl}
      line-height: 150%;
    }
  }
  .total {
    font-weight: 400;
    ${(props) => props.theme.fonts.size.lg}
  }
`;

export const StyledSelect = styled(Select)`
  .KuxSelect-wrapper {
    > div {
      display: flex;
      align-items: center;
    }
  }
`;

export const StyledIsolatedCurrencies = styled.div``;

export const StyledBatchCurrencies = styled.div`
  .batch-container {
    max-height: 240px;
    overflow-y: scroll;
  }
  .tip {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    span {
      ${(props) => props.theme.fonts.size.xl}
      color: ${(props) => props.theme.colors.text};
    }
  }
`;

export const StyledBatchTable = styled(Table)`
  td {
    padding: 12px 0;
  }
  .KuxCheckbox-wrapper {
    .KuxCheckbox-checkbox {
      top: -0.25em;
    }
  }
  thead {
    tr {
      th {
        background: ${(props) => (props.theme.currentTheme === 'light' ? '#fff' : '#222223')};
      }
    }
  }
`;

export const StyledSingleIsolatedCurrencies = styled.div`
  display: flex;
  gap: 12px;
  .currency-item {
    cursor: pointer;
    display: flex;
    gap: 8px;
    flex: 1 1 0%;
    border: 1px solid ${(props) => props.theme.colors.cover12};
    border-radius: 8px;
    padding: 16px;
    &.actived {
      border: 1px solid ${(props) => props.theme.colors.primary};
    }
    .currency-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .content-wrapper {
      flex: 1 1 0%;
      .currency-item-name {
        ${(props) => props.theme.fonts.size.xl}
        color: ${(props) => props.theme.colors.text};
        font-weight: 700;
      }
      .currency-item-total {
        ${(props) => props.theme.fonts.size.lg}
        color: ${(props) => props.theme.colors.text40};
      }
    }
  }
`;

export const StyledCheckbox = styled(Checkbox)``;

export const StyledSpin = styled(Spin)`
  width: 100%;
  ${(props) =>
    props.theme.currentTheme === 'dark' &&
    css`
      .KuxSpin-container {
        &::after {
          background: transparent;
        }
      }
    `}
`;
