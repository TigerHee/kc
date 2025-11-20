/**
 * Owner: solar@kupotech.com
 */
import { styled, Alert, Tag } from '@kux/mui';

export const StyledSeqDeduction = styled.div`
  margin-bottom: 24px;
`;

export const StyledAccount = styled.div`
  padding: 0 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 72px;
  .drag-icon {
    width: 20px;
    height: 20px;
    justify-self: flex-end;
  }
  svg {
    margin-right: 12px;
  }
  .account-wrapper {
    flex: 1;
    .account-name {
        ${(props) => props.theme.fonts.size.xl}
        color: ${(props) => props.theme.colors.text};
        font-weight: 500;
    }
    .account-info {
        display: flex;
        ${(props) => props.theme.fonts.size.lg}
        margin-top: 4px;
        .available {
          color: ${(props) => props.theme.colors.text40};
        }
        .deducted {
          color: ${(props) => props.theme.colors.primary};
          margin-left: 4px;
          .symbol {
            margin: 0 2px;
          }
        }
    }
  }
`;

export const ExpandTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.text40};
  align-items: center;
  margin-bottom: 8px;
  .expand-title {
    align-items: center;
    ${(props) => props.theme.fonts.size.xl}
    cursor: pointer;
    display: flex;
    gap: 4px;
    .icon {
    }
  }
  .tip {
    display: flex;
    align-items: center;
    ${(props) => props.theme.fonts.size.md}
    svg {
      margin-right: 4px;
    }
  }
`;

export const Accounts = styled.div`
  margin: 0 -12px;
`;

export const StyledAlert = styled(Alert)`
  margin-bottom: 24px;
  .KuxAlert-content {
    & > p {
      color: ${({ theme }) => theme.colors.text40};
      font-weight: 400;
    }
  }
`;

export const StyledAlertTag = styled(Tag)`
  background-color: #51fdbf;
  color: #1d1d1d;
  ${(props) => props.theme.fonts.size.sm}
  height: 17px;
`;
