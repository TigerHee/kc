/**
 * Owner: solar.xia@kupotech.com
 */
import { Alert, css, Dialog, Row, styled } from '@kux/mui';
import {
  themeColorCover12,
  themeColorPrimary,
  themeColorSecondary,
  themeColorText60,
  themeFontLG,
} from 'src/utils/themeSelector';
export const StyledPasswordInput = styled.div`
  padding: 0 16px 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;
  }
  .password {
    margin-top: 24px;
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-top: 8px;
    }
  }
  .agreement-check {
    margin-top: 24px;
  }
`;
export const StyledTakeOrder = styled.div`
  /* min-width: 375px; */
  padding: 20px 16px 32px;
  height: 100%;
  position: relative;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;
  }
  header {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 8px 0 40px;
    /* ${(props) => props.theme.breakpoints.up('sm')} {
      padding: 8px 0;
    } */
    h2 {
      margin-right: 4px;
      margin-bottom: 0;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 40px;
      line-height: 110%;
    }
    small {
      ${(props) => props.theme.fonts.size.x2l}
      color: ${(props) => props.theme.colors.text30};
      margin-bottom: 4px;
    }
  }
  main {
  }
`;
export const StyledRow = styled(Row)`
  .taxLabel {
    display: flex;
    align-items: center;
    svg {
      width: 16px;
      height: 16px;
      margin-left: 2px;
      color: ${(props) => props.theme.colors.icon60};
    }
  }
  ${(props) => props.theme.fonts.size.lg}
  ${(props) =>
    props.mt &&
    css`
      padding-top: ${props.mt}px;
    `}
  ${(props) =>
    props.noMb &&
    css`
      .KuxCol-col {
        margin-bottom: 0 !important;
      }
    `}
  .KuxCol-col {
    margin-bottom: 8px;
    &:nth-of-type(2n + 1) {
      color: ${(props) => props.theme.colors.text40};
    }
    &:nth-of-type(2n) {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .amount {
        margin-right: 4px;
        color: ${(props) => props.theme.colors.text60};
        &.total {
          font-weight: 700;
          ${(props) => props.theme.fonts.size.x2l}
          color: ${(props) => props.theme.colors.text};
        }
      }
      .currency-type {
        color: ${(props) => props.theme.colors.text40};
      }
      img {
        margin-left: 4px;
        cursor: pointer;
      }
    }
  }
`;
export const StyledPostOrder = styled.div`
  padding: 20px 16px 32px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 8px 0;
  }

  .KuxInput-addonAfter {
    color: ${(props) => props.theme.colors.text60};
  }

  .side-select {
    display: flex;
    width: 100%;
    height: 36px;
    margin-bottom: 20px;
    border: 0.5px solid ${themeColorCover12};
    border-radius: 80px;
    .side-select-item {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 36px;
      color: ${themeColorText60};
      text-align: center;
      ${themeFontLG};
      &.active {
        color: #ffffff;
        border-radius: 80px;
        &.side-buy {
          background-color: ${themeColorPrimary};
        }
        &.side-sell {
          background-color: ${themeColorSecondary};
        }
      }
    }
  }
`;
export const StyledAlert = styled(Alert)``;

export const StyledAlertContainer = styled.div`
  padding-top: 20px;
  .KuxAlert-root {
    margin-bottom: 8px;
  }
`;

export const StyledSplitSwitch = styled.div`
  border-radius: 8px;
  padding: 16px;
  background: ${(props) => props.theme.colors.cover2};
  margin: 4px 0 16px;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;

      svg {
        width: 16px;
        height: 16px;
        margin-left: 4px;
        color: ${(props) => props.theme.colors.icon60};
        cursor: pointer;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 2px 0 20px;
  }
`;
export const StyledTooltipContent = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};

  ${(props) => props.theme.breakpoints.up('sm')} {
    color: ${(props) => props.theme.colors.textEmphasis};
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
  }
`;

export const StyledTooltipLabel = styled.span`
  cursor: help;
  // display: inline-flex;
  // align-items: center;
  line-height: 1;
`;

export const StyledTooltipFooter = styled.div`
  padding: 0 24px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const StyledMToolTip = styled(Dialog)`
  .KuxDialog-body {
    max-width: 100%;
    max-width: calc(100% - 32px);

    .KuxModalHeader-root {
      min-height: unset;
      padding: 24px 24px 16px;
      font-size: 20px;

      .KuxModalHeader-close {
        top: 24px;
        right: 24px;
        width: 28px;
        height: 28px;
      }
    }

    .KuxDialog-content {
      padding: ${({ title }) => (title ? '0 24px 32px' : '24px')};
    }
  }
`;
