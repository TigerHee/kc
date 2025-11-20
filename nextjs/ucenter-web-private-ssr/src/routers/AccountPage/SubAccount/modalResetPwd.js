/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/styled';
import { Alert, Dialog, Form, Input } from '@kux/mui';
import { injectLocale } from 'components/LoadLocale';
import React from 'react';
import { _t } from 'tools/i18n';
import { validatePwd } from 'utils/validate';
import ModalBase from './modalBase';

const StyledModal = styled(Dialog)`
  .KuxModalFooter-root {
    padding: 0 32px 32px 32px;
  }
  .KuxModalHeader-title {
    font-size: 24px !important;
  }
`;

const AlertCnt = styled.div`
  margin-bottom: 20px;
  .KuxAlert-description {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const { FormItem, withForm } = Form;

const StyledFormItem = styled.div`
  margin-bottom: 8px;
`;

@withForm()
@injectLocale
class ModalResetPwd extends ModalBase {
  requiredFields = ['password', 'rpassword'];

  passwordValidator = (rule, val, callback) => {
    const { form } = this.props;
    const { check = true } = validatePwd(val) || {};
    if (!check) {
      callback(_t('form.password.error'));
      return;
    }
    // 变动时检验rpassword
    const value = form.getFieldValue('rpassword');
    if (value !== val) {
      form.validateFields(['rpassword'], { force: true });
    }
    callback();
  };

  pwdAgain = (rule, val, callback) => {
    const { form } = this.props;
    if (val && val !== form.getFieldValue('password')) {
      callback(_t('form.inconsistent'));
      return;
    }
    callback();
  };

  render() {
    const { visible, form, curItem: { subName = '' } = {}, onCancel, ...rest } = this.props;
    const isDisabled = this.checkIfCanSubmit(this.requiredFields);
    return (
      <StyledModal
        size="medium"
        open={visible}
        title={_t('sub.reset.login.password')}
        onCancel={onCancel}
        onOk={this.handleOk}
        cancelText={_t('cancel')}
        okText={_t('save')}
        okButtonProps={{
          loading: rest.loading,
          disabled: isDisabled,
        }}
        style={{ margin: 24 }}
        {...rest}
      >
        <AlertCnt>
          <Alert showIcon={false} description={`${_t('subaccount.subaccount')}: ${subName}`} />
        </AlertCnt>
        <React.Fragment>
          <StyledFormItem>
            <FormItem
              label={_t('login.password')}
              name="password"
              required={false}
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
                {
                  validator: this.passwordValidator,
                },
              ]}
              validateFirst={true}
              validateTrigger={['onSubmit', 'onBlur']}
            >
              <Input
                size="xlarge"
                type="password"
                minLength={7}
                allowClear={true}
                inputProps={{ maxLength: 32 }}
                placeholder={_t('pwd.placeholder')}
                autoComplete="new-password"
              />
            </FormItem>
          </StyledFormItem>
          <StyledFormItem>
            <FormItem
              label={_t('confirm.password')}
              name="rpassword"
              required={false}
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
                {
                  validator: this.pwdAgain,
                },
              ]}
              validateTrigger={['onSubmit', 'onBlur']}
            >
              <Input
                size="xlarge"
                type="password"
                allowClear={true}
                inputProps={{ maxLength: 32 }}
                placeholder={_t('confirm.password2')}
                autoComplete="new-password"
              />
            </FormItem>
          </StyledFormItem>
        </React.Fragment>
      </StyledModal>
    );
  }
}

export default ModalResetPwd;
