import { Steps, styled } from '@kux/mui';

export const ExSteps = styled(Steps)`
  width: 100%;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    width: auto;
  }
  .KuxStep-stepContent {
    flex: 1;
    margin-bottom: 24px;
    margin-left: 8px;
  }
  .KuxStep-icon {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }
  .KuxStep-waitStep .KuxStep-icon {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background-color: ${({ theme }) => theme.colors.text30};
    border-color: ${({ theme }) => theme.colors.text30};
  }
  .KuxStep-processStep .KuxStep-icon,
  .KuxStep-finishStep .KuxStep-icon {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background-color: ${({ theme }) => theme.colors.text};
  }
  .KuxStep-step {
    overflow: initial;
    &:last-child .KuxStep-stepContent {
      margin-bottom: 12px;
    }
  }
  .KuxStep-tail {
    left: 10px;
  }
  .KuxStep-tail:after {
    width: 0;
    background: none;
    border-right: 1px dashed ${({ theme }) => theme.colors.text30};
  }
`;
export const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 12px;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
`;
