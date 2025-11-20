/**
 * Owner: harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import Spin from '@mui/Spin';
import Dialog from '@mui/Dialog';
import { TwapRunStatusHeader } from './components/TwapRunStatusHeader';

export const DialogWrapper = styled(Dialog)`
  .KuxMDialog-content {
    height: 100%;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 0;
    }
  }
`;
export const NumFormat = styled.span`
  width: 100%;
  .coinName {
    display: inline-block;
    margin-left: 4px;
  }
`;

export const SpinWrapper = styled(Spin)`
  height: 100%;
  .KuxSpin-container {
    display: flex;
    flex-flow: column;
    height: 100%;
  }
`;

export const DetailContent = styled.div`
  padding: 0 32px;
  flex: 1;
  overflow-y: auto;
`;

export const DetailBaseInfoContent = styled.div`
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .label {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
    }

    .value {
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
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
      position: sticky;
      top: 0;
      display: flex;
      align-items: center;
      width: calc(100% + 64px);
      height: 40px;
      margin-left: -32px;
      padding: 0 32px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      background: ${(props) => props.theme.colors.cover4};

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
      display: flex;
      align-items: center;
      padding: 8px 0;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
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
  display: flex;
`;

export const DetailCardListContent = styled.div`
  padding: 16px 12px;
  border-bottom: 1px solid;
  border-bottom-color: ${(props) => props.theme.colors.divider4};

  .row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 6px;

    .label {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
    }

    .value {
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
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
      max-width: 50%;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      overflow-wrap: break-word;
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

export const H5TwapRunStatusHeader = styled(TwapRunStatusHeader)`
  padding: 0 0 24px;
`;
