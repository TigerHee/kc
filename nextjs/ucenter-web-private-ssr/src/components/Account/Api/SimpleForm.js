/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { Button, Form, Input, styled } from '@kux/mui';
import { cryptoPwd } from 'helper';
import { Component } from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const SecurityConfirm = styled.div`
  margin-top: 15px;
`;

const { FormItem, withForm } = Form;

@connect(({ loading }) => ({
  loading: loading.effects['security_new/sec_verify'],
}))
@withForm()
@injectLocale
class SimpleForm extends Component {
  handleSubmit = () => {
    const { form, onOk, bizType } = this.props;
    trackClick(['Confirm', '1']);
    form.validateFields().then((values) => {
      const { withdraw_password } = values;
      onOk({
        bizType,
        validations: { withdraw_password: cryptoPwd(withdraw_password) },
      });
    });
  };

  // 6位数字校验
  numberValidator = (rule, value, callback) => {
    if (!value || !value.match(/^\d{6}$/)) {
      callback(new Error(_t('trade.code.required')));
    }
    callback();
  };

  // 阻止enter键提交
  stopEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  render() {
    const { className, form, loading, okText } = this.props;

    return (
      <div className={className}>
        <Form form={form}>
          <FormItem
            label={_t('trade.code')}
            name="withdraw_password"
            rules={[
              { required: true, message: _t('form.required') },
              { validator: this.numberValidator },
            ]}
            validateTrigger="onBlur"
          >
            <Input
              size="large"
              type="password"
              inputProps={{ maxLength: 6 }}
              allowClear={true}
              onFocus={() => trackClick(['tradecode', '1'])}
              onKeyDown={this.stopEnterSubmit}
            />
          </FormItem>
        </Form>
        <SecurityConfirm>
          <Button fullWidth size="large" loading={loading} onClick={this.handleSubmit}>
            {okText}
          </Button>
        </SecurityConfirm>
      </div>
    );
  }
}

export default SimpleForm;
