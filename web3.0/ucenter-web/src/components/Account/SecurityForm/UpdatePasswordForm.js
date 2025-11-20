/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Alert, Box, Button, Form, Input, withResponsive } from '@kux/mui';
import PasswordFormItem from 'components/NewPasswordFormItemWithCheckBar';
import _ from 'lodash';
import React from 'react';
import { kcsensorsManualExpose } from 'src/utils/ga';
import { _t } from 'tools/i18n';
import { validatePwdRule } from 'utils/validate';
import { AlertContent, FormBody, FormWrapper, Tip } from './styled';

const { FormItem, withForm } = Form;

@withResponsive
@withForm()
@injectLocale
export default class UpdatePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 密码是否校验报错
      showError: false,
      // 新旧密码是否一致
      oldNewpasswordSame: false,
    };
  }

  handleSubmit = (e) => {
    const { onSubmit = () => {} } = this.props;
    this.props.form.validateFields().then((values) => {
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(values);
      }
    });
  };

  // 校验手机号输入组件的值
  validatePassword = (rule, value) => {
    const {
      form: { getFieldValue },
    } = this.props;
    return new Promise((resolve, reject) => {
      _.delay(() => {
        if (value && value === getFieldValue('newPassword')) {
          resolve();
        } else {
          reject(new Error(_t('form.inconsistent')));
        }
      }, 300);
    });
  };

  passwordRulesValidate = (rule, value) => {
    return new Promise((resolve, reject) => {
      const { check = true } = validatePwdRule(value) || {};
      this.setState({ showError: !check });
      if (!check) {
        reject(new Error(_t('form.password.main.error')));
      } else {
        resolve();
      }
    });
  };

  newOldValidate = (rule, value) => {
    const {
      form: { getFieldValue },
    } = this.props;

    return new Promise((resolve, reject) => {
      _.delay(() => {
        const { check = true } = validatePwdRule(value) || {};
        if (!check) {
          // 如果新密码不符合规则，直接报错
          this.setState({ showError: true, oldNewpasswordSame: false });
          reject(new Error(_t('form.password.main.error')));
        } else if (value && value === getFieldValue('oldPassword')) {
          // 如果新密码和旧密码一致，报错
          this.setState({ showError: true, oldNewpasswordSame: true });
          reject(new Error(_t('same.new.psw.warning')));
        } else {
          this.setState({ showError: false, oldNewpasswordSame: false });
          resolve();
        }
      }, 300);
    });
  };

  /**
   * 当界面切换语言后，FormItem的errorInfo不会同步更新，validateTrigger均不会触发
   * 需要手动进行刷新
   */
  validateFormWithUpdateLang = () => {
    const { form } = this.props;
    const { validateFields, getFieldsError } = form || {};
    const errorInfo = getFieldsError();
    const fields = _.keys(errorInfo).filter((key) => !!errorInfo[key]);
    validateFields(fields, { force: true });
  };

  componentDidMount() {
    const { existLoginPsd = true } = this.props;
    kcsensorsManualExpose(['setPasswordPage', existLoginPsd ? 'update' : 'set']);
  }

  componentDidUpdate(preProps) {
    const { currentLang: previousLang } = preProps || {};
    const { currentLang } = this.props;
    if (previousLang && currentLang && previousLang !== currentLang) {
      this.validateFormWithUpdateLang();
    }
  }

  render() {
    const { form, loading, responsive, existLoginPsd = true } = this.props;
    const isH5 = !responsive.sm;
    const { showError, oldNewpasswordSame } = this.state;
    const formItemLayout = {
      required: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    return (
      <Form form={form}>
        <FormWrapper>
          <Tip>
            <Alert
              type="warning"
              description={
                <AlertContent>
                  <span>{_t('update.pwd.login.tips1')}</span>
                  <span>{_t('update.pwd.login.tips2')}</span>
                </AlertContent>
              }
              showIcon
            />
          </Tip>
          <Box style={{ height: isH5 ? '20px' : '40px' }} />
          <FormBody>
            {
              // 只有存在密码，才展示让用户输入旧密码
              existLoginPsd && (
                <FormItem
                  {...formItemLayout}
                  label={_t('password.old')}
                  name="oldPassword"
                  rules={[
                    {
                      required: true,
                      message: _t('form.required'),
                    },
                  ]}
                >
                  <Input
                    id="oldPassword"
                    size="xlarge"
                    placeholder={_t('password.old')}
                    type="password"
                    allowClear={true}
                  />
                </FormItem>
              )
            }
            <Box style={{ height: '8px' }} />
            {existLoginPsd ? (
              // 有密码，属于修改密码
              <PasswordFormItem
                {...formItemLayout}
                label={_t('password.new')}
                form={this.props.form}
                showTips={true}
                formKey="newPassword"
                requireMessage={_t('form.required')}
                isShowError={showError}
                // 如果是修改密码，先提示是否符合密码规则，然后再提示新旧密码是否一致
                errorMsg={
                  oldNewpasswordSame ? _t('same.new.psw.warning') : _t('form.password.main.error')
                }
                iProps={{
                  placeholder: _t('password.new'),
                }}
                validators={[
                  {
                    validator: this.newOldValidate,
                  },
                ]}
              />
            ) : (
              // 没有密码，属于设置密码
              <PasswordFormItem
                {...formItemLayout}
                label={_t('2a1b1cd7aff24000a447')}
                form={this.props.form}
                showTips={true}
                formKey="newPassword"
                requireMessage={_t('form.required')}
                isShowError={showError}
                errorMsg={_t('form.password.main.error')}
                iProps={{
                  placeholder: _t('2a1b1cd7aff24000a447'),
                }}
                validators={[
                  {
                    validator: this.passwordRulesValidate,
                  },
                ]}
              />
            )}

            <Box style={{ height: '8px' }} />
            <FormItem
              {...formItemLayout}
              label={_t(existLoginPsd ? 'password.confirm' : '77c6ec72aff14000a14d')}
              name="newPassword2"
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
                {
                  validator: this.validatePassword,
                },
              ]}
            >
              <Input
                id="newPassword2"
                size="xlarge"
                placeholder={_t(existLoginPsd ? 'password.confirm' : '77c6ec72aff14000a14d')}
                type="password"
                allowClear={true}
              />
            </FormItem>
            <Button
              loading={loading}
              size="large"
              block
              type="primary"
              onClick={this.handleSubmit}
              style={{ marginTop: '16px' }}
              data-inspector="update_password_submit_btn"
              fullWidth
            >
              {_t('submit')}
            </Button>
          </FormBody>
        </FormWrapper>
      </Form>
    );
  }
}
