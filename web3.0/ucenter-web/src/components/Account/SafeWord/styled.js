import { InfoOutlined } from '@kux/icons';
import { Button, Dialog, Form, styled } from '@kux/mui';

export const BackWrap = styled.div`
  width: 100%;
`;

export const StyledTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  line-height: 130%;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: flex-start;
    margin-top: 8px;
    margin-bottom: 8px;
    font-size: 24px;
  }
`;

export const StyledMainIcon = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 84px;
  height: 84px;
  margin-top: 52px;
`;

export const StyledDesc = styled.div`
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang SC';
  color: ${(props) => props.theme.colors.text40};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-bottom: 20px;

  & > span > b {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 400;
    font-size: 14px;
    font-family: 'PingFang SC';
    font-style: normal;
    line-height: 150%;
    cursor: pointer;
    font-feature-settings: 'liga' off, 'clig' off;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 8px;
  }
`;
export const InfoIconWrap = styled.div`
  margin-top: 3px;
  margin-right: 8px;
`;
export const InfoIcon = styled(InfoOutlined)``;

export const StyledTips = styled('div')`
  display: flex;
  flex-flow: nowrap row;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.complementary8};
  color: ${(props) => props.theme.colors.text60};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Kufox Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-bottom: 40px;

  & > span > b {
    font-weight: 600;
    font-style: normal;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 32px;
  }
`;

export const ExtendForm = styled(Form)`
  .KuxForm-item {
    margin-bottom: 8px;

    .KuxInput-disabled {
      opacity: 1;
    }
  }
`;

export const StyledSafeWordForm = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  & > * {
    max-width: 580px;
    line-height: 22px;
  }

  .KuxAlert-description {
    margin-top: 0;
  }

  .KuxAlert-icon {
    padding-right: 8px;
    padding-left: unset;
  }
`;

export const StyledFormBody = styled.div`
  width: 100%;

  [dir='rtl'] & {
    .KuxForm-itemRowContainer .KuxCol-col {
      text-align: right /* rtl:ignore */;
    }
  }
  [dir='rtl'] & {
    .KuxInput-togglePwdIcon {
      transform: scaleX(-1);
    }
  }
`;

export const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  column-gap: 24px;
  margin-top: 8px;
`;

export const StyledButton = styled.div`
  width: 100%;
`;

export const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    height: 700px;
    max-height: 100vh;
    overflow: hidden;
  }
`;

export const SafeWordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  margin-bottom: 8px;
`;

export const SafeWordTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang SC';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 8px;
`;

export const SafeWordLogoWrap = styled.div`
  width: 100%;
  padding: 12px 16px 0 16px;
  border: 0.5px solid
    ${(props) =>
      props.theme.currentTheme === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(29, 29, 29, 1)'};
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const LogoImg = styled.img`
  width: 65px;
  height: 16px;
  transition: all 0.3s ease;
`;

export const SafeWordContent = styled.div`
  border: 0.5px solid transparent;
  border-top: none;
  background: ${(props) => props.theme.colors.layer};
  background-clip: padding-box;
  border-image: ${(props) =>
    props.theme.currentTheme === 'dark'
      ? `linear-gradient(to bottom, 
          rgba(255, 255, 255, 0.9) 0%,     
          rgba(255, 255, 255, 0.3) 50%,  
          rgba(255, 255, 255, 0) 90% 
          )`
      : `linear-gradient(to bottom, 
          rgba(29, 29, 29, 0.9) 0%, 
          rgba(29, 29, 29, 0.3) 50%, 
          rgba(29, 29, 29, 0) 90%
        )`};
  border-image-slice: 1;

  width: 100%;
  padding: 0 16px 12px 16px;
`;

export const CenterWrap = styled.div`
  width: 100%;
  height: ${(props) => (props.height ? props.height : 'auto')};
  display: flex;
  flex-flow: nowrap row;
  align-item: center;
  justify-content: center;
`;

export const MailTitle = styled.div`
  width: 86px;
  height: 18px;
  border-radius: 3px;
  margin-top: 12px;
  background-color: ${(props) => props.theme.colors.cover4};
`;

export const MailDesc = styled.div`
  width: ${(props) => props.width};
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 'auto')};
  height: 8px;
  border-radius: 3px;
  margin-top: 6px;
  background-color: ${(props) => props.theme.colors.cover4};
`;
export const CodeRectWrap = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 6px;
  height: 18px;
`;

export const CodeRect = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: 0.5px solid ${(props) => props.theme.colors.cover12};
`;

export const Line = styled.div`
  height: 0.5px;
  align-self: stretch;
  border-radius: 3px;
  background-color: ${(props) => props.theme.colors.cover8};
  margin-top: 12px;
`;

export const LoginSafeWord = styled.div`
  display: flex;
  padding: 3px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.primary4};
  color: ${(props) => props.theme.colors.cover};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Kufox Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 15.6px */
  margin-top: 12px;
`;

export const MailSafeWord = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Kufox Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 15.6px */
  display: flex;
  flex-flow: nowrap row;
  justify-content: center;
  align-items: center;

  & > span {
    padding: 1px 3px;
    border: 0.5px solid ${(props) => props.theme.colors.primary};
    border-radius: 2px;
  }
`;

export const SMSSafeWord = styled.div`
  color: ${(props) => props.theme.colors.cover};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Kufox Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 15.6px */
  display: flex;
  flex-flow: nowrap row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 12px;
`;

export const WithdrawalSafeWord = styled.div`
  color: ${(props) => props.theme.colors.cover};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Kufox Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 15.6px */
  display: flex;
  flex-flow: nowrap row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 8px;
`;

export const SMSContent = styled.div`
  margin-top: 12px;
  padding: 12.5px 12px 7.5px 12px;
  border: 0.5px solid ${(props) => props.theme.colors.cover12};
  border-radius: 6px;
`;

export const DialogFooter = styled.div`
  display: flex;
  flex-flow: nowrap row;
  justify-content: flex-end;
  padding: 12px 32px 32px;
`;

export const CancelButton = styled(Button)`
  padding: 7px 24px;
`;
