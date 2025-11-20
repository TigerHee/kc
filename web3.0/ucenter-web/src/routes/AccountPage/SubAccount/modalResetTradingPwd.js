/**
 * Owner: willen@kupotech.com
 */
import { Alert, Dialog, Form, Input, styled } from '@kux/mui';
import { injectLocale } from 'components/LoadLocale';
import { _t } from 'tools/i18n';
import { passwords } from 'utils/easyPasswordLib';
import ModalBase from './modalBase';

const { FormItem, withForm } = Form;

const StyledFormItem = styled.div`
  margin-bottom: 8px;
`;

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

@withForm()
@injectLocale
class ModalResetTradingPwd extends ModalBase {
  requiredFields = ['password', 'rpassword'];

  passwordValidator = (rule, val, callback) => {
    const { form } = this.props;
    if (!val.match(/^\d{6}$/)) {
      callback(new Error(_t('form.tradeCode.required')));
    }
    if (passwords.indexOf(val) > -1) {
      callback(new Error(_t('form.secLevel.error')));
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
        title={_t('sub.reset.trading.password')}
        style={{ width: '100%', margin: 24 }}
        destroyOnClose
        showCloseX={true}
        onCancel={onCancel}
        onOk={this.handleOk}
        cancelText={_t('cancel')}
        okText={_t('save')}
        okButtonProps={{
          loading: rest.loading,
          disabled: isDisabled,
        }}
        {...rest}
      >
        <AlertCnt>
          <Alert showIcon={false} description={`${_t('subaccount.subaccount')}: ${subName}`} />
        </AlertCnt>
        <StyledFormItem>
          <FormItem
            required={false}
            label={_t('trade.code.new')}
            name="password"
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
              inputProps={{ maxLength: 6 }}
              allowClear={true}
              placeholder={_t('trade.code.new2')}
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
              inputProps={{ maxLength: 6 }}
              allowClear={true}
              placeholder={_t('confirm.password2')}
            />
          </FormItem>
        </StyledFormItem>
      </StyledModal>
    );
  }
}

export default ModalResetTradingPwd;
