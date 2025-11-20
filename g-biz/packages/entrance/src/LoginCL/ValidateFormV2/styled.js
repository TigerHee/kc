import { Box, Checkbox, styled } from '@kux/mui';

const Back = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text60};
  cursor: pointer;
  span {
    margin-left: 7px;
  }
  svg {
    transform: rotate(180deg);
  }
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: ${(props) => (props.withDrawer ? '36px' : '40px')};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 0;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  word-break: break-word;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled(Box)`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin-bottom: 32px;
  }
`;

const WithdrawPolicyWrap = styled.div`
  margin-bottom: 8px;
  .KuxForm-itemHelp {
    display: none;
  }
`;

const ValidateCheckbox = styled(Checkbox)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    line-height: 100%;
  }
`;

const AgreeLabel = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-weight: 400;
  & a {
    color: ${(props) => props.theme.colors.text};
    cursor: pointer;
    text-decoration: underline;
  }
`;

const SafeWordBox = styled(Box)`
  .safeword {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    gap: 8px;
    background: ${({ theme }) => theme.colors.primary12};
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    color: ${({ theme }) => theme.colors.primary};
  }
  .safewordTips {
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    color: ${({ theme }) => theme.colors.text40};
    margin-top: 16px;
    margin-bottom: 0;
  }
`;

const RiskAlert = styled(Box)`
  margin-bottom: 24px;
`;

const FormFooterItem = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
  cursor: pointer;
  & + & {
    margin-top: 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    text-align: center;
  }
`;

export {
  Back,
  Title,
  Subtitle,
  WithdrawPolicyWrap,
  ValidateCheckbox,
  AgreeLabel,
  SafeWordBox,
  RiskAlert,
  FormFooterItem,
};
