/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { Button, Form, Input, Spin, styled } from '@kux/mui';
import VoiceCode from 'components/VoiceCode';
import { cryptoPwd } from 'helper';
import { Component } from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const FormItemWrapper = styled.div`
  margin-top: 8px;
`;

const SecurityConfirm = styled.div`
  margin-top: 15px;
`;

const SendButton = styled(Button)`
  font-size: 16px;
  color: ${(props) => (props.disabled ? props.theme.colors.text60 : props.theme.colors.primary)};
`;

const { FormItem, withForm } = Form;

@connect(({ user, loading }) => {
  return {
    phone: user.user.phone,
    countryCode: user.user.countryCode,
    loading: loading.effects['security_new/sec_verify'],
    sendLoading: loading.effects['security_new/sec_get_code'],
    voiceSendLoading: loading.effects['account_security/sendVerifyCode'],
  };
})
@withForm()
@injectLocale
class SMSForm extends Component {
  state = {
    countdownTime: null,
    isCountdown: false,
    timer: null,
    disable: false,
    retryAfterSeconds: 0,
  };

  // 发送验证码
  sendCode = async () => {
    this.setState({
      disable: true,
    });
    trackClick(['Sendcode', '1']);
    const { bizType, dispatch } = this.props;
    const { success, data } = await dispatch({
      type: 'security_new/sec_get_code',
      payload: { bizType, channel: 'my_sms' },
    });
    if (success && data) {
      this.setState(
        {
          isCountdown: true,
          countdownTime: data.retryAfterSeconds,
        },
        () => {
          this.startCountdown();
        },
      );
    } else {
      this.setState({
        disable: false,
      });
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
        this.setState({ isCountdown: false, countdownTime: null, disable: false });
        clearInterval(this.state.timer);
      }
    }, 1000);
    this.setState({
      timer,
    });
  };

  // 提交
  handleSubmit = () => {
    const { form, onOk, bizType } = this.props;
    trackClick(['Confirm', '1']);
    form.validateFields().then((values) => {
      const { withdraw_password } = values;
      onOk({
        bizType,
        validations: { ...values, withdraw_password: cryptoPwd(withdraw_password) },
        validationType: 'my_sms',
      });
    });
  };

  // 语音验证倒计时结束
  onEnd = () => {
    const { disable } = this.state;
    this.setState({
      disable: !disable,
      retryAfterSeconds: 0,
    });
  };

  // 发送语音验证码
  getVoiceCode = async () => {
    const { dispatch } = this.props;
    const { success, data } = await dispatch({
      type: 'account_security/sendVerifyCode',
      payload: {
        params: {
          sendChannel: 'MY_VOICE',
          bizType: 'UPDATE_API',
        },
      },
    });
    if (success) {
      this.setState({
        disable: true,
        retryAfterSeconds: (data || {}).retryAfterSeconds,
      });
    }
  };

  // 6位数字校验
  numberValidator = (rule, value, callback) => {
    if (!value || !value.match(/^\d{6}$/)) {
      callback(new Error(_t('trade.code.required')));
    }
    callback();
  };

  // 优化语音验证码弹窗两个滚动条问题
  componentDidMount() {
    document.body.className = 'no_padding_body';
  }

  // 清除定时器和副作用
  componentWillUnmount() {
    clearInterval(this.state.timer);
    document.body.className = '';
  }

  render() {
    const { form, className, phone, countryCode, loading, voiceSendLoading, okText, sendLoading } =
      this.props;
    const { isCountdown, countdownTime, disable, retryAfterSeconds } = this.state;

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
                allowClear={true}
                inputProps={{ maxLength: 6 }}
                onFocus={() => trackClick(['tradecode', '1'])}
              />
            </FormItem>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem
              label={_t('vc.sms')}
              name="my_sms"
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
                onFocus={() => trackClick(['Emailcode', '1'])}
                suffix={
                  sendLoading ? (
                    <Spin type="normal" spinning size="xsmall" />
                  ) : (
                    <SendButton
                      variant="text"
                      ml={12}
                      onClick={this.sendCode}
                      disabled={isCountdown || disable}
                    >
                      {isCountdown ? `${countdownTime}s` : _t('send')}
                    </SendButton>
                  )
                }
              />
            </FormItem>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem>
              <SecurityConfirm>
                <Button fullWidth size="large" onClick={this.handleSubmit} loading={loading}>
                  {okText}
                </Button>
                <VoiceCode
                  color="rgba(1,8,30,0.60)"
                  phone={phone}
                  countryCode={countryCode || ''}
                  loading={voiceSendLoading}
                  disable={disable || voiceSendLoading}
                  countTime={retryAfterSeconds}
                  onTimeOver={this.onEnd}
                  onSend={this.getVoiceCode}
                />
              </SecurityConfirm>
            </FormItem>
          </FormItemWrapper>
        </Form>
      </div>
    );
  }
}

export default SMSForm;
