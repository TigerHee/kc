/**
 * Owner: jessie@kupotech.com
 */
import { styled, Table } from '@kux/mui';
import CoinTransfer from './CoinTransfer';

export const StyledNewCurrencyList = styled.section`
  padding-bottom: 40px;
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    .title {
      padding: 0 16px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      ${(props) => props.theme.fonts.size.x3l};
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-bottom: 80px;
    .container {
      padding: 0 24px;
      .title {
        margin-bottom: 24px;
        padding: 0;
        ${(props) => props.theme.fonts.size.x5l};
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-bottom: 120px;
    .container {
      width: 1200px;
      padding: 0;

      .title {
        margin-bottom: 24px;
        padding: 0;
        ${(props) => props.theme.fonts.size.x6l};
      }
    }
  }
`;

export const TableLayer = styled.div`
  margin-top: 28px;
  border-radius: 6px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
`;

export const MoreDivLayer = styled.div`
  width: 100%;
  padding-top: 24px;
  text-align: center;
  .more {
    display: inline-block;
    box-sizing: content-box;
    width: 18px;
    height: 18px;
    padding: 16px 24px;
    cursor: pointer;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .rotate {
    transform: rotate(180deg);
  }
`;
export const CurrencyLayer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  line-height: 1.5;
  padding: 4px 0;
  img {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    overflow: hidden;
    background: #e4e4e4;
    border-radius: 50%;
    ${(props) => props.theme.breakpoints.up('sm')} {
      width: 24px;
      height: 24px;
    }
    ${(props) => props.theme.breakpoints.up('lh')} {
      width: 28px;
      height: 28px;
    }
  }
`;
export const CurrencyInfoLayer = styled.div`
  margin-left: 12px;
  color: ${(props) => props.theme.colors.text40};
  font-weight: normal;
  font-size: 12px;
  line-height: 130%;
  .tag {
    margin-left: 4px;
    padding: 2px 4px;
    color: #fff;
    font-weight: 500;
    font-size: 10px;
    line-height: 1.2;
    word-break: keep-all;
    border-radius: 2px;
  }
  .redBack {
    color: ${(props) => props.theme.colors.secondary};
    background: ${(props) => props.theme.colors.secondary8};
  }

  .yellowBack {
    color: ${(props) => props.theme.colors.complementary};
    background: ${(props) => props.theme.colors.complementary8};
  }

  .greenBack {
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary8};
  }

  .red {
    color: #f65454;
  }

  .green {
    color: #01bc8d;
  }

  .font14 {
    font-size: 14px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: 6px;
  }
`;
export const CurrencyInfoNameLayer = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text};
  font-weight: normal;
  font-size: 16px;
  word-break: keep-all;
  font-weight: 500;
  line-height: 130%;
`;
export const HandleListLayer = styled.div`
  width: 100%;
  height: 100%;

  display: inline-block;
  span,
  a {
    padding: 8px 0;
    color: ${(props) => props.theme.colors.primary} !important;
    font-weight: 500;
    font-size: 14px;
    text-decoration: none;
  }

  a:active {
    text-decoration: none;
  }

  span {
    cursor: pointer;
  }
`;
export const TradeWrap = styled.div`
  display: inline-block;
`;
export const NumFormat = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text60};
  font-weight: 500;

  span {
    margin-left: 6px;
  }
  &.padding_span {
    padding-left: 14px;
    overflow: hidden;
  }
  &.float_right_css {
    float: right;
  }
  &.red {
    color: ${({ theme }) => theme.colors.secondary};
  }

  &.green {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
export const TableWrapper = styled(Table)`
  thead {
    height: 40px !important;
    tr {
      th {
        padding: 0 6px !important;
        color: ${(props) => props.theme.colors.text40} !important;
        font-size: 12px !important;
        vertical-align: middle;
        // background: ${(props) => props.theme.colors.cover2} !important;
        border-bottom: none !important;
        ${(props) => props.theme.breakpoints.up('sm')} {
          font-size: 14px !important;
        }

        &:first-of-type {
          border-radius: 12px 0 0 12px;
          &:before {
            display: none;
          }
        }

        &:last-of-type {
          border-radius: 0 12px 12px 0;
          &:after {
            display: none;
          }
        }
        ${(props) => props.theme.breakpoints.up('sm')} {
          &:nth-of-type(2) > div {
            > span.KuxBox-root {
              position: relative;
              top: 9px;
            }
          }
        }
      }

      ${(props) => props.theme.breakpoints.down('sm')} {
        th {
          padding: 4px 2px !important;
          &:first-of-type {
            padding-left: 16px !important;
            border-radius: 0;
          }
          &:last-of-type {
            padding-right: 16px !important;
            border-radius: 0;
          }
        }
      }
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      height: 44px !important;
    }
  }
  tbody {
    tr {
      height: 80px;
      td {
        padding: 0 6px !important;
        border-bottom: 1px solid ${(props) => props.theme.colors.divider4};
        &:first-of-type {
          border-radius: 12px 0 0 12px;
          &:before {
            display: none !important;
          }
        }

        &:last-of-type {
          border-radius: 0 12px 12px 0;
          &:after {
            display: none !important;
          }
        }
      }

      ${(props) => props.theme.breakpoints.down('sm')} {
        height: 64px !important;
        td {
          padding: 0 2px !important;
          &:first-of-type {
            padding-left: 16px !important;
            border-radius: 0;
          }

          &:last-of-type {
            padding-right: 16px !important;
            border-radius: 0;
          }
        }
      }
      ${(props) => props.theme.breakpoints.up('lg')} {
        height: 83px;
      }
    }
  }
`;
export const ColumnRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
`;
export const ChangeRateWrapper = styled.div`
  font-size: 13px;
`;
export const TimeLayer = styled.div`
  overflow: hidden;
  cursor: pointer;
  .all_change_list {
    display: flex;
    float: left;
    li {
      margin-right: 4px;
    }
    .all_change_active {
      color: #00c27c;
    }
  }
  .all_change_letter {
    float: left;
  }
`;
export const PriceTitle = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-end;
`;
export const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;
export const NormalPriceWrapper = styled(CoinTransfer)`
  font-weight: 500;
  font-size: 13px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 16px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    font-weight: 600;
  }

  line-height: 22px;
  display: inline-block;
  word-break: break-all;

  &.weight400 {
    font-weight: 400;
  }
`;
export const MoreText = styled.a`
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  font-weight: 500;
  .down_icon {
    display: inline-block;
    margin-top: 0px;
    margin-left: 8px;
    vertical-align: middle;
    svg {
      width: 16px;
      height: 16px;
      color: ${(props) => props.theme.colors.icon};
    }
  }
  &:hover {
    color: ${(props) => props.theme.colors.text60};
  }
`;
export const LabelWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const TimeWrapper = styled.span`
  display: block;
  ${(props) => props.theme.fonts.size.md};
  color: ${(props) => props.theme.colors.text40};
`;

export const LinkTitle = styled.a`
  color: inherit;
  &:hover {
    color: inherit;
  }
  padding-right: 6px;
`;
