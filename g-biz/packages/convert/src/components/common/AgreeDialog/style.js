/**
 * Owner: Ray.Lee@kupotech.com
 */
import { styled, Spin } from '@kux/mui';

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none; /* 针对Firefox浏览器 */
  ::-webkit-scrollbar {
    display: none; /* 针对Webkit浏览器，如Chrome和Safari */
  }
`;

export const List = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  counter-reset: index;
`;

export const Footer = styled.div`
  padding: 5px 0 20px;
  border-top: 0.5px solid ${(props) => props.theme.colors.divider8};
`;

export const Describe = styled.div`
  font-size: 14px;
  line-height: 130%;
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.text60};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-weight: 500;
  }
`;

export const StyledLoading = styled(Spin)`
  margin: 200px auto;
`;

export const AnswerItemWrapper = styled.div`
  width: 100%;
  :not(:first-of-type) {
    padding-top: 32px;
  }
  :last-of-type {
    padding-bottom: 32px;
  }
`;

export const AnswerTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  ::before {
    content: counter(index) '. ';
    counter-increment: index;
  }
`;

export const ConfirmContent = styled.div`
  padding: 32px 0;
  text-align: center;
  margin: 0 auto;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    max-width: 352px;
  }
`;
export const Congratulations = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.text};
`;
export const CongratulationsDesc = styled.div`
  font-size: 16px;
  line-height: 150%;
  margin: 8px 0 24px;
  color: ${({ theme }) => theme.colors.text60};
`;
