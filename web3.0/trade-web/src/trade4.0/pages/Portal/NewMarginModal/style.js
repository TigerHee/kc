/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';
import Dialog from '@mui/Dialog';
import TooltipWrapper from '@/components/TooltipWrapper';
import LeverageSetting from '@/components/Margin/LeverageSetting';

export const StyledDialog = styled(Dialog)`
  .KuxModalHeader-root {
    ${(props) => props.theme.breakpoints.up('sm')} {
      padding: 0 32px;
    }
    height: 72px !important;
    .KuxModalHeader-close {
      top: 20px !important;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      height: 56px !important;
      .KuxModalHeader-close {
        top: 16px !important;
      }
    }
    .KuxModalHeader-title {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .KuxDialog-content {
    ${(props) =>
      (props.isScroll
        ? `
      padding: 0;
    `
        : `
      padding: 32px 32px 25px;
    `)}
  }
`;

export const StyledLeverageSetting = styled(LeverageSetting)`
  font-size: 14px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export const StyledTooltipWrapper = styled(TooltipWrapper)`
  font-size: 14px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
