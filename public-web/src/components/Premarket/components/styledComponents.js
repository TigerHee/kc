/**
 * Owner: solar.xia@kupotech.com
 */
import { Dialog, Form, styled } from '@kux/mui';
export const StyledButtonContainer = styled.footer`
  height: 78px;
  .container {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 78px;
    padding: 8px 16px 30px;
    .button {
      flex: 1;
      &:first-of-type {
        margin-right: 10px;
      }
    }
  }
`;
export const StyledForm = styled(Form)`
  .KuxInput-root {
    fieldset {
      min-width: initial;
      margin: initial;
      padding: initial;
      /* border: initial; */
      margin-inline-start: 2px;
      margin-inline-end: 2px;
      padding-block-start: 0.35em;
      padding-inline-start: 0.75em;
      padding-inline-end: 0.75em;
      padding-block-end: 0.625em;
      legend {
        width: initial;
        padding: initial;
        padding-inline-start: 0px;
        padding-inline-end: 0px;
      }
    }

  }
`;
export const StyledModalMain = styled.div`
  height: calc(100% - 78px);
  overflow-y: auto;
  .KuxDivider-root {
    margin: 8px 0 16px;
  }
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
      padding: ${({ title }) => (title ? '0 24px 24px' : '24px')};
    }
  }
`;
