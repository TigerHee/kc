/**
 * Owner: tiger@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';
import * as config from './config';

// 弹窗内容高度
const dialogContentH = '590px';

const specialHeightConfig = {
  [config.sumsubPageCode]: 'calc(95vh - 90px)',
  [config.sumsubVideoPageCode]: 'calc(95vh - 90px)',
  [config.sumsubPoaPageCode]: 'calc(95vh - 90px)',
};

const getHeight = ({ pageCode }) => {
  if (pageCode) {
    return specialHeightConfig[pageCode] || dialogContentH;
  }
  return dialogContentH;
};

export const StyledDialog = styled(Dialog)`
  & .KuxDialog-body {
    margin: 8px;
    overflow: hidden;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      height: calc(-32px + 100vh);
      width: 100vw;
      max-width: 100vw;
      max-height: 100%;
      border-radius: 12px 12px 0px 0px;
      margin: 0 !important;
      margin-top: 32px !important;
    }
  }
  & .KuxModalHeader-root {
    height: 90px !important;
    .KuxModalHeader-close {
      top: 28px !important;
    }
    ${({ theme }) => theme.breakpoints.down('sm')} {
      min-height: 56px !important;
      height: fit-content !important;
      padding: 0 16px;
      .KuxModalHeader-close {
        top: 24px !important;
        right: 16px;
        width: 28px;
        height: 28px;
      }
      .KuxModalHeader-title {
        font-size: 18px;
        padding-top: 24px;
        padding-bottom: 12px;
        font-size: 18px;
        font-weight: 700;
        line-height: 140%;
      }
    }
  }
  & .KuxDialog-content {
    padding: 0;
    height: ${(props) => getHeight(props)};
    ${({ theme }) => theme.breakpoints.down('sm')} {
      flex: 1;
      height: auto;
    }
  }
  .titleWrapper {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const BackIcon = styled.img`
  width: 28px;
  height: 28px;
  display: none;
  cursor: pointer;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: inline-flex;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  height: ${(props) => getHeight(props)};
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: ${({ theme }) => theme.colors.layer};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 100%;
  }
  &.isSmStyle {
    height: 100vh;
    padding-top: 44px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

export const Main = styled.div`
  flex: 1;
  overflow-y: auto;
`;
