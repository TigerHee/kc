/**
 * owner: larvide.peng@kupotech.com
 */
import { styled } from '@kux/mui';
import MuiDialog from 'routes/SlothubPage/components/mui/Dialog';

export const MuiDialogStyleWrapper = styled(MuiDialog)`
  overflow-y: hidden;
  .KuxModalHeader-root {
    height: auto;
    padding: 24px 32px;
    border: none;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 24px 16px 16px;
    }

    .KuxModalHeader-title {
      font-size: 24px;
      ${(props) => props.theme.breakpoints.down('sm')} {
        font-size: 20px;
      }
    }
  }
  .KuxModalHeader-close {
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: 10px;
    }
  }
`;
export const BannerWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 24px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  overflow: hidden;

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 14px 14px;
  }

  .convertBtn {
    display: -webkit-box;
    flex-shrink: 1;
    margin-left: 16px;
    text-overflow: ellipsis;
    word-wrap: keep-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 12px;
    }
  }
`;
export const NumberArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 4px;
  }
  .number {
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 24px;
    font-style: normal;
    line-height: 130%;
  }
`;
export const NumberDesc = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text40};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;
export const HistoryRecordWrapper = styled.div`
  margin-top: 12px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    .historyrecordtabs {
      position: relative;
      overflow: visible;
      &::before {
        position: absolute;
        bottom: 0;
        left: -16px;
        width: calc(100% + 32px);
        height: 1px;
        background: ${(props) => props.theme.colors.divider8};
        content: '';
      }
    }
  }

  .KuxTab-TabItem {
    font-weight: 400;
  }
`;
