/**
 * Owner: borden@kupotech.com
 */
import { styled } from '@/style/emotion';
import dropStyle from '@/components/DropdownSelect/style';
import Spin from '@mui/Spin';
import Dialog from '@mui/Dialog';

export const SpinWrapper = styled(Spin)`
  height: 100%;
  .KuxSpin-container {
    height: 100%;
    display: flex;
    flex-flow: column;
  }
`;

export const DatetimeText = styled.span``;

export const SymbolNameText = styled.span`
  cursor: pointer;
  .arrow-right-icon {
    margin-left: 2px;
    :hover {
      color: ${(props) => props.theme.colors.primary};
    }
  }
  :hover {
    color: ${(props) => props.theme.colors.primary};
  }
  ${(props) => {
    if (props.screen === 'miniScreen') {
      return `
        color : ${props.theme.colors.primary};
        font-size: 12px;
        font-weight: 400;
      `;
    }
    return '';
  }}
`;

export const SideText = styled.span`
  color: ${({ side, theme }) => (side === 'SELL' ? theme.colors.secondary : theme.colors.primary)};
`;

export const MiniSymbolNameWrapper = styled.div`
  // margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .operator {
    white-space: nowrap;
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    margin-left: 8px;

    a {
      color: ${(props) => props.theme.colors.text};
    }
  }
  .left {
    display: flex;
    align-items: center;
  }

  .top {
    margin-right: 8px;
    color: ${(props) => props.theme.colors.text};
    .symbolName {
      font-weight: 400;
      font-size: 12px;
      line-height: 130%;
      color: ${(props) => props.theme.colors.text};
    }
  }

  .bottom {
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    .sideWrapper {
      margin-right: 8px;
    }
    .time {
      color: ${(props) => props.theme.colors.text40};
      display: inline-block;
    }

    svg {
      vertical-align: middle;
      color: ${(props) => props.theme.colors.icon60};
    }
  }

  &.miniScreen {
    // margin-bottom: 10px;
    .left {
      flex-direction: column;
      align-items: flex-start;
    }
    .top {
      margin-bottom: 2px;
    }
  }
`;

export const OrderListContent = styled.div`
  height: 100%;
`;

export const TypeText = styled.span`
  display: flex;
  align-items: center;

  .icon {
    cursor: pointer;
    margin-left: 4px;
    display: flex;
    align-items: center;
    svg {
      color: ${(props) => props.theme.colors.icon60};
    }
  }
`;

export const NumFormat = styled.span`
  width: 100%;
  .coinName {
    margin-left: 4px;
    display: inline-block;
  }
`;

export const TriggerPrice = styled.span`
  display: inline-block;
  // width: 100%;
  // overflow: hidden;
  // text-overflow: ellipsis;
  cursor: pointer;
  .activatePrice {
    color: ${(props) => props.theme.colors.primary};
  }
  .divider {
    margin: 0 4px;
    color: ${(props) => props.theme.colors.divider8};
  }
`;

const alignmentStyles = {
  left: 'margin-right: auto;',
  right: 'margin-left: auto;',
  center: 'margin-left: auto; margin-right: auto;',
};

export const MergeLabelText = styled.div`
  text-align: ${({ align }) => align};

  ${({ align = 'right' }) => alignmentStyles[align] || ''}
`;

export const MergeContent = styled.div`
  text-align: ${({ align }) => align};
`;

export const CancelOperatorTitle = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;

  svg {
    margin-left: 4px;
    color: ${(props) => props.theme.colors.icon};
    width: 12px;
    min-width: 12px;
  }
`;

export const CancelOperatorButton = styled.a`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.colors.text};
  border-radius: 24px;
  border: 1px solid transparent;

  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

export const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    align-items: center;
    height: 100%;
    padding: 0 2px 0 0;
    color: ${(props) => props.theme.colors.text40};
  `,
  Icon: styled(dropStyle.Icon)`
    svg {
      fill: ${(props) => props.theme.colors.icon60};
    }
  `,
};

// 外部tabs content 使用
export const OrderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const OrderHeadBarWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 24px;
  padding: 0 12px;
  margin-top: 4px;
  align-items: center;
  justify-content: space-between;
  .active {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const OrderMaskWraperWrapper = styled.div`
  overflow: auto;
  flex: 1;
  // & > div {
  //   height: unset;
  // }
`;

// ------------ detail modal ----------------
export const DialogWrapper = styled(Dialog)`
  .KuxMDialog-content {
    height: 100%;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 0;
    }
  }
`;

export const DetailContent = styled.div`
  padding: 0 32px;
  flex: 1;
  overflow-y: auto;
`;

export const DetailBaseInfoContent = styled.div`
  .row {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .label {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: ${(props) => props.theme.colors.text40};
    }

    .value {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: ${(props) => props.theme.colors.text};
    }
  }

  &.xs {
    padding: 16px 12px;
    .row {
      margin-bottom: 16px;
    }
  }
`;

export const DetailListContent = styled.div`
  .header {
    position: sticky;
    top: 0;
    background: ${(props) => props.theme.colors.layer};

    .content {
      display: flex;
      align-items: center;
      height: 40px;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: ${(props) => props.theme.colors.text40};
      background: ${(props) => props.theme.colors.cover4};
      position: sticky;
      top: 0;
      width: calc(100% + 64px);
      margin-left: -32px;
      padding: 0 32px;

      & > div.col {
        width: 27%;
        &:first-of-type {
          width: 19%;
        }

        &:last-of-type {
          text-align: right;
        }
      }
    }
  }

  .list {
    .row {
      padding: 8px 0;
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: ${(props) => props.theme.colors.text60};
      border-bottom: 1px solid;
      border-bottom-color: ${(props) => props.theme.colors.divider4};
      & > div.col {
        width: 27%;
        &:first-of-type {
          width: 19%;
        }

        &:last-of-type {
          text-align: right;
        }
      }
    }
  }
`;

export const EmptyWrapper = styled.div`
  height: 300px;
`;

export const DetailCardListContent = styled.div`
  padding: 16px 12px;
  border-bottom: 1px solid;
  border-bottom-color: ${(props) => props.theme.colors.divider4};

  .row {
    margin-bottom: 6px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .label {
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: ${(props) => props.theme.colors.text40};
    }

    .value {
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: ${(props) => props.theme.colors.text};
    }
  }
`;

export const TabsWrapper = styled.div`
  padding: 0 12px;
  border-bottom: 1px solid;
  border-bottom-color: ${(props) => props.theme.colors.divider4};
`;

export const ItemTitle = styled.div`
  padding: 16px 0 12px;
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  color: ${(props) => props.theme.colors.text};
`;

export const CoinCodeToNameWrapper = styled.span`
  &.unit {
    display: inline-block;
    color: ${(props) => props.theme.colors.text40};
  }
`;

export const ButtonWrapper = styled.div`
  padding: 20px 32px;
  text-align: right;
  border-top: 1px solid;
  border-top-color: ${(props) => props.theme.colors.divider4};
`;

export const PaginationWrapper = styled.div`
  padding: 24px 0;
  display: flex;
  justify-content: flex-end;
  ${(props) =>
    props.theme.currentTheme === 'dark' &&
    `
      .KuxPagination-item.KuxPagination-item-selected button {
    background: ${props.theme.colors.layer};
      }
     `}
`;

export const FeeDivider = styled.div`
  margin-bottom: 12px;
  height: 0px;
  border-top: 1px ${(props) => props.borderStyle || 'solid'}
    ${(props) => props.theme.colors.divider4};
`;

export const FeeContainer = styled.div`
  padding: 6px 0 0 0;
  &.xs {
    padding: 24px 12px;
  }
`;

export const FeeDetail = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  margin-bottom: 12px;

  & {
    .text {
      font-weight: 400;
      max-width: 50%;
      overflow-wrap: break-word;
      color: ${(props) => props.theme.colors.text60};
    }
    .red {
      color: ${(props) => props.theme.colors.secondary};
    }
    .green {
      color: ${(props) => props.theme.colors.primary};
    }
    .grey {
      color: ${(props) => props.theme.colors.text};
    }
    .unit {
      display: inline-block;
      padding-left: 4px;
    }
  }
`;

// ------------ cancel modal ----------------
export const CancelModalWrapper = styled.div`
  padding: 48px 0;
  text-align: center;
  img {
    width: 136px;
    height: 136px;
    margin-bottom: 16px;
  }

  .desc {
    font-weight: 700;
    font-size: 28px;
    line-height: 36px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 40px;
  }

  .buttonWrapper {
    display: flex;
    align-items: center;
    button {
      width: 50%;
      &:first-of-type {
        margin-right: 12px;
      }
    }
  }

  &.xs {
    padding: 48px 0;
    text-align: center;
    img {
      width: 136px;
      height: 136px;
      margin-bottom: 16px;
    }

    .desc {
      font-weight: 700;
      font-size: 20px;
      line-height: 26px;
      color: ${(props) => props.theme.colors.text};
      margin-bottom: 40px;
    }

    .buttonWrapper {
      display: flex;
      align-items: center;
      button {
        width: 50%;
        &:first-of-type {
          margin-right: 12px;
        }
      }
    }
  }
`;

export const DashedText = styled.span`
  border-bottom: 1px dashed ${(props) => props.theme.colors.text40};
  cursor: pointer;
`;

export const FeeContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end !important;
`;

export const DivideLine = styled.span`
  background: ${(props) => props.theme.colors.divider8};
  width: 1px;
  height: 12px;
  margin: ${({ marginHorizontal }) => (marginHorizontal ? `0 ${marginHorizontal}px` : `0 8px`)};
`;

export const TWAPOperatorWrap = styled.section`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
`;

export const TWAPConditionWrap = styled.section`
  display: flex;
  align-items: center;
  height: 100%;
  flex-wrap: wrap;
`;

export const NoWrapSpan = styled.span`
  text-wrap: nowrap;
`;

export const TWAPOperatorButton = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  font-family: Roboto;
  line-height: 130%; /* 15.6px */
  cursor: pointer;
`;
