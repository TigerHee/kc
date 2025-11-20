/**
 * Owner: willen@kupotech.com
 */
import { Form, styled, Input, Button, Checkbox, useTheme } from '@kux/mui';
import { Trans } from '@tools/i18n';
import { getTermId, getTermUrl } from '@tools/term';

const { FormItem } = Form;

export const RegPageWrapper = styled.div`
  width: 1280px;
  margin: 0 auto;
  padding: 56px 0 78px;
  display: flex;
  justify-content: ${({ needCenter }) => (needCenter ? 'center' : 'space-between')};
  box-sizing: content-box;
  align-items: flex-start;
  @media screen and (max-width: 1680px) {
    width: 1240px;
  }
  ${({ theme }) => theme.breakpoints.down('xl')} {
    width: 1180px;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: ${({ needCenter }) => (needCenter ? '100%' : '1120px')};
    padding: ${({ needCenter }) => (needCenter ? '56px auto 78px auto' : '56px 40px 78px')};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: unset;
    padding: unset;
  }
  .highlight {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const RegPageLeftWrapper = styled.div`
  width: 540px;
  flex-shrink: 0;
`;

export const RegPageRightWrapper = styled.div`
  flex-shrink: 0;
  width: 600px;
  box-shadow: 0 10px 60px 0 rgba(22, 53, 43, 0.08);
  padding: 40px 40px 48px;
  border-radius: 24px;
  .voiceCodeText {
    color: ${({ theme }) => theme.colors.text};
  }

  > .KuxBox-root {
    width: unset;
    max-width: unset;
  }
  @media screen and (max-width: 1680px) {
    width: 560px;
  }
  ${({ theme }) => theme.breakpoints.down('xl')} {
    width: 520px;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: 480px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 32px 16px 40px;
    box-shadow: unset;
  }
  // WEB 黑暗模式卡片需要背景色
  ${({ theme }) => theme.breakpoints.up('sm')} {
    background: ${({ theme }) => (theme.currentTheme === 'dark' ? 'rgba(34, 34, 35, 1)' : 'unset')};
  }
`;

export const AgreementTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Kufox Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%; /* 31.2px */
  margin-bottom: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;

export const Title = styled.h2`
  font-weight: 700;
  font-size: 40px;
  line-height: 130%;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 600;
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

export const AccountInput = styled(Input)`
  .KuxInput-prefix {
    display: ${({ showPrefix }) => (showPrefix ? 'inline-flex' : 'none')};
  }
`;

export const FormItemBox = styled.div`
  position: relative;
  z-index: 1;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 8px;
  }
`;

export const SetAccountTitle = styled(Title)`
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 32px;
  }
`;

export const SetAccountDesc = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text40};
  margin-top: -24px;
  margin-bottom: 40px;
`;

export const ExtendForm = styled(Form)`
  .mtSpace {
    margin-top: 8px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: 0;
    }
  }
`;

// 签署协议 UI
export const AgreeLabel = styled.span`
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  & a {
    cursor: pointer;
    color: ${(props) => props.theme.colors.text};
    text-decoration: underline;
  }
`;

export const AgreeFormWrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 28px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
  }
`;

export const AgreeFormItem = styled.div`
  display: flex;

  & + & {
    margin-top: 12px;
  }

  .KuxForm-itemHelp {
    display: none;
  }
  .KuxForm-itemError {
    .KuxForm-itemHelp {
      display: block;
    }
  }
`;

export const AlreadyHasCount = styled.div`
  margin-top: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
`;

export const VerifyAccountWrap = styled.div`
  width: 100%;
  & input {
    width: auto;
    flex: 1;
  }
`;

export const Tips = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 37px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

export const VoiceCodeWrapper = styled.div`
  margin-top: 40px;
`;

export const BindEmailButton = styled(Button)`
  margin-top: 16px;
`;

// 协议 UI
export const AgreeItem = ({
  name,
  onClick,
  i18nKey,
  initialValue,
  termCode,
  // 翻译 values 和 components
  // 如果有传入 transValues、transComponents，则不会使用传入的 termCode
  transValues,
  transComponents,
  multiSiteConfig,
  rules,
}) => {
  const theme = useTheme();
  return (
    <AgreeFormItem>
      <FormItem
        name={name}
        label={null}
        initialValue={initialValue}
        valuePropName="checked"
        rules={rules}
      >
        <Checkbox
          checkOptions={{
            type: 2,
            checkedType: theme?.currentTheme === 'dark' ? 2 : 1,
          }}
        >
          <AgreeLabel theme={theme} onClick={(e) => e.stopPropagation()}>
            <Trans
              i18nKey={i18nKey}
              ns="entrance"
              values={
                transValues || {
                  url: getTermUrl(getTermId(termCode, multiSiteConfig?.termConfig)),
                }
              }
              components={
                transComponents || {
                  a: (
                    // eslint-disable-next-line jsx-a11y/control-has-associated-label
                    <a
                      href={getTermUrl(getTermId(termCode, multiSiteConfig?.termConfig))}
                      target="_blank"
                      rel="noopener noreferrer"
                      // 只有放在这里才执行
                      onClick={onClick}
                    />
                  ),
                }
              }
            />
          </AgreeLabel>
        </Checkbox>
      </FormItem>
    </AgreeFormItem>
  );
};
