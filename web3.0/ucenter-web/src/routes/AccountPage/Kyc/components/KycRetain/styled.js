import { Checkbox, styled, TextArea } from '@kux/mui';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ noMg }) => (noMg ? '0 -32px' : '0')};
  .KuxForm-itemHelp {
    display: none;
  }
`;

export const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 150%; /* 21px */
  display: ${({ show = true }) => (show ? 'block' : 'none')};
`;

export const Group = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Item = styled(Checkbox)`
  display: flex;
  .KuxCheckbox-checkbox {
    padding-top: 2px;
  }
  & > span:nth-child(2) {
    flex: 1;
  }
`;

export const ItemLabel = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 400;
  line-height: 130%; /* 20.8px */
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ItemTextarea = styled(TextArea)`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
  .KuxTextArea-input {
    padding: 16px 0;
  }
`;

export const Footer = styled.div`
  padding: 20px 32px;
  margin: 0 -32px;
  display: flex;
  gap: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.cover8};
  justify-content: flex-end;
`;

export const RewardHeader = styled.div`
  padding: 12px 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;
export const RewardTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 700;
  line-height: 140%;
  > span {
    color: ${({ theme }) => theme.colors.text};
    & > span {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
export const RewardDesc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  text-align: center;
`;
export const RewardFooter = styled.div`
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
