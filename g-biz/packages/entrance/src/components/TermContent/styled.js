import { styled, Steps, Spin, Empty } from '@kux/mui';

export const AgreementContainer = styled.div`
  width: 100%;
`;

export const AgreementStep = styled(Steps)`
  .KuxStep-step {
    display: flex;
    margin-bottom: 8px;
    &:not(:first-of-type) {
      margin-left: 6px;
    }
    .KuxStep-container {
      align-items: center;
      .KuxStep-icon {
        width: 20px;
        height: 20px;
      }
      .KuxStep-stepContent {
        margin-left: 0px;
      }
      .KuxStep-arrowRight {
        margin-left: 6px;
      }
    }
  }
  .KuxStep-step.KuxStep-ActiveStep {
    .KuxStep-container {
      .KuxStep-stepContent {
        margin-left: 4px;
      }
    }
  }
`;

export const AgreementEmpty = styled(Empty)`
  margin: initial;
  .KuxEmpty-description {
    display: none;
  }
`;

export const AgreementCheckBoxWrap = styled('div')`
  display: flex;
  margin: 12px 0 24px;
  .KuxCheckbox-wrapper {
    & > span {
      margin-left: 8px;
      line-height: 1.4;
    }
    .KuxCheckbox-checkbox {
      top: 0;
      margin-left: 0;
      line-height: 1;
    }
  }
`;

export const AgreementContent = styled('div')`
  width: 100%;
  height: 220px;
  @media (min-width: 1536) {
    height: 40vh;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 40vh;
  }

  overflow-y: scroll;
  padding: 16px 0 12px;
  * {
    font-size: 14px;
    color: ${(props) => props.theme.colors.text60};
  }

  strong {
    font-weight: 300;
  }
`;

export const AgreementContentFail = styled('div')`
  width: 100%;
  height: 220px;
  @media (min-width: 1536) {
    height: 40vh;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 40vh;
  }
  display: flex;
  flex-flow: nowrap column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const SpinLoading = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: ${({ isRTL }) => `translate3d(${isRTL ? '' : '-'}50%, -50%, 0)`};
`;

export const AgreementLabel = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-weight: 400;
`;

export const AgreementBtn = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  justify-content: center;
`;
