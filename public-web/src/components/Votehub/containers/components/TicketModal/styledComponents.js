/**
 * Owner: jessie@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';

export const DialogWrapper = styled(Dialog)`
  .KuxDialog-body {
    max-width: 320px;

    .KuxModalHeader-root {
      min-height: auto;
      padding: 32px 24px 12px;
    }

    .KuxDialog-content {
      padding: 0 24px;
    }

    .KuxModalFooter-root {
      padding: 28px 24px 32px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .KuxDialog-body {
      max-width: 400px;

      .KuxModalHeader-root {
        min-height: 90px;
        padding: 32px 32px 24px;
      }

      .KuxDialog-content {
        padding: 0 32px;
      }

      .KuxModalFooter-root {
        padding: 28px 32px 32px;
      }
    }
  }
`;

export const ContentWrapper = styled.div`
  padding: 0;

  .desc {
    margin-bottom: 20px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 150%;
  }

  .tip {
    padding: 4px 16px 0;
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 16px;
    letter-spacing: 0.4px;

    &.errorTip {
      color: ${(props) => props.theme.colors.secondary};
    }
  }

  .KuxInput-addonAfter {
    button {
      color: ${(props) => props.theme.colors.primary};
    }
  }

  .KuxInput-error {
    .KuxInput-addonAfter {
      button {
        color: ${(props) => props.theme.colors.secondary};
      }
    }
  }
`;
