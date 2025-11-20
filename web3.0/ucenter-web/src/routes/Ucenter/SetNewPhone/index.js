/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Alert, Box, Button, Form, Input, styled, withTheme } from '@kux/mui';
import CountrySelect from 'components/CountrySelector';
// import VoiceCode from 'components/VoiceCode';
import { NewVoiceCode } from '@kucoin-biz/entrance';
import TimerButton from 'components/Assets/Withdraw/TimerButton';
import React from 'react';
import { connect } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';
import { AlertPrompt, FormWrapper, sendBtn, Wrapper } from './styled';

const { withForm, FormItem } = Form;

const StyledFormItem = styled.div`
  margin-bottom: 32px;
  min-width: 520px;
  .KuxForm-itemHelp {
    display: ${({ hasHelp }) => (hasHelp ? 'block' : 'none')};
  }
  .KuxForm-itemError {
    .KuxForm-itemHelp {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-end;
      justify-content: flex-start;
      height: 100%;
      margin-top: 0px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    min-width: calc(100vw - 32px);
  }
`;

const FormItemTipWrapper = styled.div`
  display: inline-block;
  height: 16px;
  margin-top: 4px;
  line-height: 130%;
  width: 100%;
  /* padding-left: 16px; */
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: inline-block;
    width: 100%;
    height: auto;
  }
  .voiceCodeText {
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px !important;
  }
  .voiceCodeBox {
    display: inline;
  }
`;

const FormItemTipText = styled.span`
  display: inline;
  color: ${(props) => props.theme.colors.text60};
  font-size: 12px;
  width: auto;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  span {
    b {
      color: ${(props) => props.theme.colors.text};
    }
  }
`;

const resolveContryCode = (code) => {
  return (code.mobileCode || '').replace(/_.*$/g, '');
};

@withTheme
@connect((state) => {
  const { loadingSms } = state.rebind_phone;
  const loadingSubmit = state.loading.effects['rebind_phone/submitNewPhone'];
  return {
    loadingSms,
    loadingSubmit,
  };
})
@withForm()
@injectLocale
export default class SetNewPhone extends React.Component {
  state = {
    phone: '',
    countryCode: '',
    disable: false,
  };

  switchDisabled = () => {
    const { disable } = this.state;
    this.setState({
      disable: !disable,
    });
  };

  validateForVoice = () => {
    const { validateFields } = this.props.form;
    return new Promise((resolve, reject) => {
      validateFields(['phone', 'countryCode'])
        .then(({ phone, countryCode }) => {
          this.setState({
            phone,
            countryCode: resolveContryCode(countryCode),
          });
          resolve();
        })
        .catch((err) => {
          reject();
        });
    });
  };

  sendCode = () => {
    const { validateFields } = this.props.form;
    validateFields(['phone', 'countryCode']).then(({ phone, countryCode }) => {
      this.props.onCodeSend(`${resolveContryCode(countryCode)}-${phone}`, 'SMS');
    });
  };

  onSendVoice = () => {
    const { getFieldValue, validateFields } = this.props.form;
    const phone = getFieldValue('phone');
    const countryCode = resolveContryCode(getFieldValue('countryCode'));
    if (!countryCode || !phone) {
      validateFields(['phone', 'countryCode']);
    } else {
      return Promise.resolve(this.props.onCodeSend(`${countryCode}-${phone}`, 'VOICE')).then(() => {
        this.switchDisabled();
      });
    }
  };

  handleSubmit = () => {
    this.props.form
      .validateFields()
      .then((values) => {
        const { countryCode, ...others } = values;
        this.props.onSubmit({
          ...others,
          countryCode: resolveContryCode(countryCode),
        });
      })
      .catch((err) => {
        console.log('validate error:', err);
      });
  };

  // 输入框重新获得焦点，如果有错误提示，则需要去除错误，统一在提交时验证
  handleReFocus = (key) => {
    const { form } = this.props;
    if (form.getFieldError(key)?.length > 0) {
      const placeHolder = '******'; // 合法校验占位符
      const formValue = form.getFieldValue(key);
      form.setFieldsValue({ [key]: placeHolder });
      this.props.form.validateFields([key]); // 去除错误提示
      this.props.form.setFieldsValue({ [key]: formValue });
    }
  };

  validatePhoneNumber = (rule, value, callback) => {
    return new Promise((resolve, reject) => {
      if (value) {
        if (!value.match(/^\d{1,32}$/)) {
          reject(new Error(_t('kyc.mobile.required')));
        } else if (value.startsWith('0')) {
          reject(_t('33ec784d8aaa4000ad39'));
        } else {
          resolve();
        }
      } else {
        reject(new Error(_t('kyc.mobile.required')));
      }
    });
  };

  obfuscatePhoneNumber = (phoneNumber) => {
    const length = phoneNumber.length;
    const lastChar = length > 4 ? phoneNumber.slice(-4) : phoneNumber;
    const firstChars = '*'.repeat(2);

    return firstChars + lastChar;
  };

  render() {
    const { phone, disable } = this.state;
    const {
      form,
      theme,
      loadingSms,
      loadingSubmit,
      sendChannel = '',
      retryAfterSeconds = 0,
    } = this.props;
    const { getFieldValue } = form;

    const validator = (rule, value, callback) => {
      if (!value || value.length !== 6) {
        callback(new Error(_t('form.format.error')));
      } else {
        callback();
      }
    };

    const isVoiceSend = sendChannel && sendChannel === 'VOICE';

    return (
      <Wrapper>
        <FormWrapper form={form}>
          {/* <Title>{_t('phone.bind.new')}</Title> */}
          <Alert
            type="warning"
            showIcon={false}
            description={
              <AlertPrompt>
                <div>1.{_t('security.24h.limit')}</div>
                <div>2.{_t('phone.bind.new.tip')}</div>
              </AlertPrompt>
            }
          />
          <Box style={{ height: '24px' }} />
          <StyledFormItem>
            <FormItem
              name="countryCode"
              label={_t('country.code')}
              initialValue={IS_INSIDE_WEB ? '86_CN' : ''}
              required={false}
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
              ]}
            >
              <CountrySelect size="xlarge" />
            </FormItem>
          </StyledFormItem>
          <StyledFormItem>
            <FormItem
              name="phone"
              label={_t('phone.number')}
              required={false}
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
                {
                  validator: this.validatePhoneNumber,
                },
              ]}
            >
              <Input
                size="xlarge"
                autoComplete="off"
                defaultValue={undefined}
                allowClear={true}
                label={_t('phone.number')}
                onChange={(e) => this.setState({ phone: e?.target?.value ?? '' })}
              />
            </FormItem>
          </StyledFormItem>
          <StyledFormItem hasHelp={true}>
            <FormItem
              name="code"
              label={_t('vc.sms')}
              required={false}
              rules={[
                {
                  required: true,
                  message: _t('vc.sms.required'),
                },
                {
                  validator,
                },
              ]}
              validateTrigger={['onSubmit']}
              help={
                phone ? (
                  <FormItemTipWrapper>
                    <FormItemTipText>
                      {_tHTML('aGdsBqjypc8mNZG4jBLosx', {
                        phone: this.obfuscatePhoneNumber(phone) ?? '***',
                      })}
                      <span style={{ marginLeft: '6px' }} />
                      <NewVoiceCode
                        validateFunc={this.validateForVoice}
                        phone={phone || '***'}
                        countryCode={
                          getFieldValue('countryCode')
                            ? resolveContryCode(getFieldValue('countryCode'))
                            : ''
                        }
                        loading={loadingSms}
                        disable={disable}
                        countTime={isVoiceSend ? retryAfterSeconds : 0}
                        onTimeOver={isVoiceSend ? this.switchDisabled : undefined}
                        onSend={this.onSendVoice}
                        theme={theme.currentTheme}
                      />
                    </FormItemTipText>
                  </FormItemTipWrapper>
                ) : null
              }
            >
              <Input
                size="xlarge"
                allowClear={true}
                inputProps={{ maxLength: 6 }}
                onFocus={() => this.handleReFocus('code')}
                suffix={
                  <TimerButton
                    variant="text"
                    id="_REBIND_PHONE_"
                    onClick={this.sendCode}
                    className={sendBtn}
                    loading={loadingSms}
                    disabled={disable}
                    countTimeOver={!isVoiceSend ? this.switchDisabled : undefined}
                    countTimeBegin={!isVoiceSend ? this.switchDisabled : undefined}
                    retryAfterSeconds={retryAfterSeconds}
                  />
                }
              />
            </FormItem>
          </StyledFormItem>
          <Button
            size="large"
            fullWidth
            onClick={this.handleSubmit}
            loading={loadingSubmit}
            style={{ marginTop: 12 }}
          >
            {_t('active')}
          </Button>
        </FormWrapper>
      </Wrapper>
    );
  }
}
