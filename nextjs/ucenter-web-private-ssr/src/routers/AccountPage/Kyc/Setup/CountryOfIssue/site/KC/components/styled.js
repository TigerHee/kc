import { ICQuestionOutlined } from '@kux/icons';
import { Steps, styled } from '@kux/mui';

export const Container = styled.main`
  margin: 0 auto 80px;
  width: fit-content;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    margin: 0;
    padding: 0 16px;
  }
`;
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 580px;
  max-width: 580px;
  margin: 26px 16px 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 32px;
    width: 100%;
    max-width: initial;
    margin: 16px 0 0;
  }
`;

export const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ToKYB = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
`;

export const Body = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 20px;
  }
`;
export const Header = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  margin-bottom: 0;
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const Region = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 12px;
  }
`;

export const FormLabel = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
  margin-bottom: 4px;
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const QuestionIcon = styled(ICQuestionOutlined)`
  color: ${({ theme }) => theme.colors.icon60};
  cursor: pointer;
`;

export const GapBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 12 }) => gap}px;
`;

export const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  > span > span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;

export const ExSteps = styled(Steps)`
  width: 580px;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    width: auto;
  }
  .KuxStep-stepContent {
    flex: 1;
    margin-bottom: 24px;
    margin-left: 8px;
  }
  .KuxStep-content {
    margin-top: 12px;
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
      margin-bottom: 0;
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

export const CertTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StateLabel = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  direction: ltr;
`;
export const StateLabelText = styled.span``;
export const Restricted = styled.p`
  color: ${(props) => props.theme.colors.text60};
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 4px;
  margin-left: 8px;
  padding: 2px 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;
