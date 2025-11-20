/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { Button, Form, Input, Spin, styled } from '@kux/mui';
import { cryptoPwd } from 'helper';
import { Component } from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const FormItemWrapper = styled.div`
  margin-top: 8px;
`;

const SendButton = styled(Button)`
  font-size: 16px;
  color: ${(props) => (props.disabled ? props.theme.colors.text60 : props.theme.colors.primary)};
`;

const SecurityConfirm = styled.div`
  margin-top: 16px;
`;

const { FormItem, withForm } = Form;
@connect(({ loading }) => ({
  loading: loading.effects['security_new/sec_verify'],
  sendLoading: loading.effects['security_new/sec_get_code'],
}))
@withForm()
@injectLocale
class GoogleForm extends Component {
  state = {
    countdownTime: null,
    isCountdown: false,
    timer: null,
  };

  handleSubmit = () => {
    const { form, onOk, bizType } = this.props;
    trackClick(['Confirm', '1']);
    form.validateFields().then((values) => {
      const { withdraw_password } = values;
      onOk({
        bizType,
        validations: { ...values, withdraw_password: cryptoPwd(withdraw_password) },
        validationType: 'my_email',
      });
    });
  };

  // 发送验证码
  sendCode = async () => {
    const { bizType, dispatch } = this.props;
    trackClick(['Sendcode', '1']);
    const { data } = await dispatch({
      type: 'security_new/sec_get_code',
      payload: { bizType, channel: 'my_email' },
    });
    if (data) {
      this.setState(
        {
          isCountdown: true,
          countdownTime: data.retryAfterSeconds,
        },
        () => {
          this.startCountdown();
        },
      );
    }
  };

  // 开启倒计时
  startCountdown = () => {
    const timer = setInterval(() => {
      const { countdownTime } = this.state;
      if (+countdownTime > 1) {
        this.setState({
          isCountdown: true,
          countdownTime: countdownTime - 1,
        });
      } else {
        this.setState({ isCountdown: false, countdownTime: null });
        clearInterval(this.state.timer);
      }
    }, 1000);
    this.setState({
      timer,
    });
  };

  // 6位数字校验
  numberValidator = (rule, value, callback) => {
    if (!value || !value.match(/^\d{6}$/)) {
      callback(_t('trade.code.required'));
    }
    callback();
  };

  // 清除定时器
  // eslint-disable-next-line
  componentWillMount() {
    clearInterval(this.state.timer);
  }

  render() {
    const { form, className, simple, loading, sendLoading, okText } = this.props;
    const { isCountdown, countdownTime } = this.state;
    const { handleSubmit } = this;

    return (
      <div className={className}>
        <Form form={form}>
          <FormItemWrapper>
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
                size="xlarge"
                type="password"
                inputProps={{ maxLength: 6 }}
                allowClear={true}
                onFocus={() => trackClick(['tradecode', '1'])}
              />
            </FormItem>
          </FormItemWrapper>

          {!simple ? (
            <FormItemWrapper>
              <FormItem
                label={_t('vc.email')}
                name="my_email"
                rules={[
                  { required: true, message: _t('form.required') },
                  { validator: this.numberValidator },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  size="xlarge"
                  type="text"
                  inputProps={{ maxLength: 6 }}
                  allowClear={true}
                  onFocus={() => trackClick(['Emailcode', '1'])}
                  suffix={
                    sendLoading ? (
                      <Spin type="normal" spinning size="xsmall" />
                    ) : (
                      <SendButton
                        variant="text"
                        ml={12}
                        onClick={this.sendCode}
                        disabled={isCountdown}
                      >
                        {isCountdown ? `${countdownTime}s` : _t('send')}
                      </SendButton>
                    )
                  }
                />
              </FormItem>
            </FormItemWrapper>
          ) : null}

          <FormItemWrapper>
            <FormItem
              label={_t('g2fa.code')}
              name="google_2fa"
              rules={[
                { required: true, message: _t('form.required') },
                { validator: this.numberValidator },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                size="xlarge"
                type="text"
                allowClear={true}
                inputProps={{ maxLength: 6 }}
                onFocus={() => trackClick(['2FA', '1'])}
              />
            </FormItem>
          </FormItemWrapper>
        </Form>
        <SecurityConfirm>
          <Button fullWidth size="large" onClick={handleSubmit} loading={loading}>
            {okText}
          </Button>
        </SecurityConfirm>
      </div>
    );
  }
}

export default GoogleForm;
