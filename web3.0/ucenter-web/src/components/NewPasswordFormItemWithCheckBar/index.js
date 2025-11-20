/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { ICHookOutlined } from '@kux/icons';
import { Form, Input, styled, withTheme } from '@kux/mui';
import React from 'react';
import { _t } from 'tools/i18n';
import { validatePwdRule } from 'utils/validate';
import { PasswordStrength } from './PasswordStrength';

const { FormItem } = Form;

const StyledFormItem = styled.div`
  .KuxForm-itemHelp {
    display: none;
  }
`;

const ErrorMsg = styled.div`
  margin-top: 4px;
  padding-left: 16px;
  font-size: 12px;
  color: #f66754;
  flex: 1;
  width: 100%;
`;

const PasswordCheckBar = styled.div`
  position: absolute;
  top: -15px;
  right: 0;
  width: 62px;
  height: 10px;

  .ant-pwd-strength {
    display: block;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ant-pwd-strength-item {
    float: left;
    width: 19px;
    height: 8px;
    margin-top: 1px;
    margin-right: 1px;
    line-height: 8px;
    list-style: none;
    background-color: #f3f3f3;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .ant-pwd-strength-item-1 {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  .ant-pwd-strength-item-2 {
    width: 20px;
  }

  .ant-pwd-strength-item-3 {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .ant-pwd-strength-low .ant-pwd-strength-item-1,
  .ant-pwd-strength-medium .ant-pwd-strength-item-1,
  .ant-pwd-strength-high .ant-pwd-strength-item-1 {
    background-color: #f04134;
  }

  .ant-pwd-strength-medium .ant-pwd-strength-item-2,
  .ant-pwd-strength-high .ant-pwd-strength-item-2 {
    background-color: #fac450;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#FAC450, endColorstr=#FAC450);
  }

  .ant-pwd-strength-high .ant-pwd-strength-item-3 {
    background-color: #87d068;
  }
`;

const TipsWrapper = styled.div`
  margin-top: 12px;
  margin-bottom: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
    padding-left: 4px;
  }
`;

const Tip = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  column-gap: 8px;
  & + & {
    margin-top: 4px;
  }
`;

const Dot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.cover12};
`;

const Text = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%;
`;

@injectLocale
@withTheme
export default class PasswordFormItemWithCheckBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasWhiteSpace: true,
      invalidLength: true,
      invalidFormat: true,
      passBarShow: false, // 是否显示密码强度提示条
      passStrength: 'L', // 密码强度
    };
  }

  checkPass(rule, value) {
    return new Promise((resolve, reject) => {
      const { check, strength, hasWhiteSpace, invalidLength } = validatePwdRule(value);
      this.setState({
        hasWhiteSpace,
        invalidLength,
        invalidFormat: !check,
        passBarShow: typeof strength !== 'undefined',
        passStrength: strength,
      });
      if (check) {
        resolve();
      } else {
        reject(new Error(_t('form.password.main.error')));
      }
    });
  }

  renderIcon(invalid) {
    const { theme } = this.props;
    return invalid ? <Dot /> : <ICHookOutlined color={theme.colors.primary} />;
  }

  render() {
    const {
      formKey,
      label,
      requireMessage,
      validators = [],
      form,
      showTips = true,
      iProps = {},
      showError = false,
      errorMsg,
      ...rest
    } = this.props;

    return (
      <StyledFormItem>
        <FormItem
          label={label}
          {...rest}
          name={formKey || 'password'}
          error={true}
          rules={[
            {
              required: true,
              message: requireMessage || _t('form.required'),
            },
            {
              validator: this.checkPass.bind(this),
            },
            ...validators,
          ]}
          validateTrigger="onChange"
        >
          <Input
            id={formKey || 'password'}
            size="xlarge"
            type="password"
            allowClear={true}
            {...iProps}
            error={false}
          />
        </FormItem>
        {/* 校验报错并且设置错误提示信息 */}
        {this.props?.isShowError && errorMsg && (
          <ErrorMsg data-inspector="password_error_msg">{errorMsg}</ErrorMsg>
        )}
        {!this.props?.isShowError && this.state.passBarShow ? (
          <PasswordStrength strengthLevel={this.state.passStrength} />
        ) : null}
        {showTips && (
          <TipsWrapper>
            <Tip>
              {this.renderIcon(this.state.invalidLength)}
              <Text>{_t('ee96fbf06c024000af2d', { min: 10, max: 32 })}</Text>
            </Tip>
            <Tip>
              {this.renderIcon(this.state.invalidFormat)}
              <Text>{_t('62de0d83c9094000ab3c')}</Text>
            </Tip>
            <Tip>
              {this.renderIcon(this.state.hasWhiteSpace)}
              <Text>{_t('688d135212f54000ad82')}</Text>
            </Tip>
          </TipsWrapper>
        )}
      </StyledFormItem>
    );
  }
}
