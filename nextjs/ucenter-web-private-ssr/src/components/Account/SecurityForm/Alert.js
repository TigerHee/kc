/**
 * Owner: willen@kupotech.com
 */
import { Alert, styled } from '@kux/mui';
import SvgIcon from 'components/common/KCSvgIcon';
import React from 'react';
import { injectLocale } from 'components/LoadLocale';
import { _t } from 'tools/i18n';

const AlertWrapper = styled.div`
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text60};

  .KuxAlert-description {
    margin-top: 0;
  }
  .KuxAlert-icon {
    padding-right: 8px;
    padding-left: unset;
  }
`;

const AlertInfoWrapper = styled(Alert)`
  font-size: 13px;
  background: ${(props) => props.theme.colors.complementary8};
  border: none;
  border-radius: 5px;
`;

const StyledPrompt = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  max-width: 100%;
  margin-bottom: 24px;
  padding: 8px 12px;
  font-size: 13px;
  text-align: center;
  border-radius: 5px;
  a {
    text-decoration: underline;
  }
`;

const PromptIcon = styled.div`
  width: 20px;
  height: 20px;
  color: #f5a623;
  margin-right: 8px;
`;

const PromptContent = styled.div`
  flex: 1;
  text-align: left /* rtl:right */;
  word-break: break-all;
  color: ${(props) => props.theme.colors.text60};

  & > div:not(:first-child) {
    margin-top: 0.5em;
  }
`;

@injectLocale
export default class AlertInfo extends React.Component {
  render() {
    const adMsg = _t('e5779574017e4000aab6');
    const { addMessage = false, message = '', replaceMessage = '', ...rest } = this.props;
    const display = replaceMessage || message + (addMessage ? ',' : '') + adMsg;
    return (
      <AlertWrapper>
        <AlertInfoWrapper type="warning" showIcon {...rest} description={display} />
      </AlertWrapper>
    );
  }
}

export const Prompt = ({ iconId = 'error2', icon = null, contentStyle = {}, content = null }) => (
  <StyledPrompt style={contentStyle}>
    {icon ? (
      <PromptIcon>{icon}</PromptIcon>
    ) : (
      <PromptIcon>
        <SvgIcon width="20px" height="20px" iconId={iconId} />
      </PromptIcon>
    )}
    <PromptContent>{content}</PromptContent>
  </StyledPrompt>
);
