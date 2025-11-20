/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Button, Form, Input, styled, withTheme } from '@kux/mui';
import CountDownBtn from 'components/common/CountDownBtn';
import CountrySelect from 'components/CountrySelector';
import { message } from 'components/Toast';
// import VoiceCode from 'components/VoiceCode';
import { NewVoiceCode } from '@kucoin-biz/entrance';
import { tenantConfig } from 'config/tenant';
import React from 'react';
import { getUserArea } from 'services/homepage';
import { _t, _tHTML } from 'tools/i18n';
import AlertInfo from './Alert';

const { FormItem, withForm } = Form;

const StyledFormItem = styled.div`
  margin-bottom: 32px;
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

const SendBtn = styled.div`
  display: inline-block;
  padding: 0;
`;

const FormTitle = styled.div`
  margin: 20px auto 24px auto;
  font-weight: 500;
`;

const resolveContryCode = (code) => {
  if (code instanceof Object) {
    return code?.mobileCode?.replace(/_.*$/g, '');
  }
  return (code || '').replace(/_.*$/g, '');
};

export const BIZ_TYPES = {
  BIND_PHONE: 'BIND_PHONE',
  UPDATE_PHONE: 'UPDATE_PHONE',
  UPDATE_PHONE_V2: 'RV_UPDATE_PHONE',
};

@withTheme
@withForm()
@injectLocale
export default class BindPhoneForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGetingCode: false,
      retryAfterSeconds: 0,
      phone: '',
      countryCode: '',
      disable: false,
      sendChannel: 'SMS',
      loading: false,
      countryCodeInitialValue: tenantConfig.resetPhone.countryCodeInitialValue,
      isCountryCodeInit: tenantConfig.resetPhone.isCountryCodeInit,
    };
    this.getVcode = this.getVcode.bind(this);
  }

  componentDidMount() {
    const { countryList, dispatch } = this.props;
    if (countryList && !countryList.length) {
      dispatch({
        type: 'homepage/getCountryCodes',
      });
    }
  }

  componentDidUpdate() {
    const { countryList } = this.props;
    const { isCountryCodeInit } = this.state;
    if (
      !isCountryCodeInit &&
      countryList &&
      countryList?.length &&
      tenantConfig.resetPhone.queryUserAreaForUpdateCountryCode
    ) {
      getUserArea()
        .then((res) => {
          if (res?.success && res?.data) {
            const data = res?.data || {};
            const countryItem = countryList.find((i) => i.code === data?.countryCode);
            if (countryItem && !countryItem.dismiss && data.mobileCode) {
              this.setState({
                countryCodeInitialValue: {
                  mobileCode: data.mobileCode,
                  title: data.countryCode,
                  value: data.countryCode,
                },
                isCountryCodeInit: true,
              });
            }
          }
        })
        .finally(() => {
          this.setState({
            isCountryCodeInit: true,
          });
        });
    }
  }

  validateForVoice = () => {
    const { validateFields } = this.props.form;
    return new Promise((resolve, reject) => {
      validateFields(['phone', 'countryCode'], (err, { phone, countryCode }) => {
        if (!err) {
          this.setState({
            phone,
            countryCode: resolveContryCode(countryCode),
          });
          resolve();
        } else {
          reject();
        }
      });
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, bizType, onSuccess, onError, form, headers } = this.props;
    const { sendChannel } = this.state || {};

    form
      .validateFields()
      .then((values) => {
        const { countryCode, ...others } = values;

        let effect = '';
        switch (bizType) {
          case BIZ_TYPES.UPDATE_PHONE:
            effect = 'account_security/updatePhone';
            break;
          case BIZ_TYPES.UPDATE_PHONE_V2:
            effect = 'account_security/updatePhoneV2';
            break;
          default:
            effect = 'account_security/bindPhone';
        }
        this.setState({ loading: true });
        dispatch({
          type: effect,
          payload: {
            params: {
              ...others,
              countryCode: resolveContryCode(countryCode),
              sendChannel,
              headers,
            },
          },
        })
          .then((...rest) => {
            dispatch({ type: 'user/pullUser' });
            if (onSuccess) onSuccess(...rest);
          })
          .catch((e) => {
            if (onError) onError(e);
          })
          .finally(() => {
            this.setState({ loading: false });
          });
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // 校验手机号输入组件的值
  validatePhoneNumber = (rule, value, callback) => {
    if (value) {
      if (!value.match(/^\d{1,32}$/)) {
        callback(_t('kyc.mobile.required'));
      } else if (value.startsWith('0')) {
        callback(_t('33ec784d8aaa4000ad39'));
      } else {
        callback();
      }
    } else {
      callback(_t('kyc.mobile.required'));
    }
  };

  getVcode = (sendChannel = 'SMS') => {
    const { dispatch, bizType, form } = this.props;
    const { getFieldValue } = form;
    if (this.state.retryAfterSeconds > 0) {
      return false;
    }
    const phone = getFieldValue('phone');
    const countryCode = resolveContryCode(getFieldValue('countryCode'));
    let ifErr = false;
    form
      .validateFields(['phone', 'countryCode'])
      .then(() => {
        this.setState({ isGetingCode: true, retryAfterSeconds: 0 });
        const type =
          bizType === BIZ_TYPES.UPDATE_PHONE_V2
            ? 'account_security/sendPhoneCode'
            : 'account_security/sendBindCode';
        const payload =
          bizType === BIZ_TYPES.UPDATE_PHONE_V2
            ? { bizType, address: `${countryCode}-${phone}`, isVoice: sendChannel === 'VOICE' }
            : { type: 'phone', params: { bizType, phone, countryCode, sendChannel } };
        dispatch({ type, payload })
          .then(({ retryAfterSeconds }) => {
            message.success(_t('operation.succeed'));
            this.setState({ retryAfterSeconds, disable: true, sendChannel });
          })
          .finally(() => {
            this.setState({ isGetingCode: false });
          });
      })
      .catch((err) => {
        console.log('err', err);
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

  getVoiceCode = () => {
    this.getVcode('VOICE');
  };

  obfuscatePhoneNumber = (phoneNumber) => {
    const length = phoneNumber.length;
    const lastChar = length > 4 ? phoneNumber.slice(-4) : phoneNumber;
    const firstChars = '*'.repeat(2);

    return firstChars + lastChar;
  };

  onEnd = () => {
    this.setState({ retryAfterSeconds: 0, disable: false });
  };

  render() {
    const { isUpdate, showTitle = true, showAlert = true, form, theme } = this.props;
    const {
      isGetingCode,
      retryAfterSeconds,
      phone,
      disable,
      loading,
      sendChannel = 'SMS',
      countryCodeInitialValue,
      isCountryCodeInit,
    } = this.state;

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
    const sendCodeBtn = (
      <SendBtn>
        <CountDownBtn
          init={retryAfterSeconds}
          loading={isGetingCode}
          onClick={this.getVcode}
          onEnd={this.onEnd}
          disabled={disable}
        />
      </SendBtn>
    );

    const validator = (rule, value, callback) => {
      if (!value || value.length !== 6) {
        callback(new Error(_t('form.format.error')));
      } else {
        callback();
      }
    };

    return (
      <Form form={form} onSubmit={this.handleSubmit} data-testid="form">
        {!!showTitle && <FormTitle>{isUpdate ? _t('phone.bind.new') : _t('phone.bind')}</FormTitle>}
        {!!showAlert && <AlertInfo />}
        <div>
          {isCountryCodeInit && (
            <StyledFormItem>
              <FormItem
                label={_t('country.code')}
                name="countryCode"
                initialValue={countryCodeInitialValue}
                rules={[
                  {
                    required: true,
                    message: _t('form.required'),
                  },
                ]}
                {...formItemLayout}
              >
                <CountrySelect
                  size="xlarge"
                  disabled={tenantConfig.resetPhone.disabledCountrySelect}
                  showCountryName={true}
                  defaultValue={countryCodeInitialValue?.value}
                  forbiddenCountry
                  hideIco
                />
              </FormItem>
            </StyledFormItem>
          )}
          <StyledFormItem>
            <FormItem
              label={_t('phone.number')}
              name="phone"
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
                {
                  validator: this.validatePhoneNumber,
                },
              ]}
              validateTrigger={'onBlur'}
              validateFirst={true}
            >
              <Input
                id="phone"
                allowClear={true}
                onChange={(e) => this.setState({ phone: e?.target?.value ?? '' })}
                autoComplete="off"
                size="xlarge"
                onFocus={() => this.handleReFocus('phone')}
                defaultValue={undefined}
              />
            </FormItem>
          </StyledFormItem>
          <StyledFormItem hasHelp={true}>
            <FormItem
              label={_t('vc.sms')}
              name="code"
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
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
                        phone={this.obfuscatePhoneNumber(phone) || '***'}
                        validateFunc={this.validateForVoice}
                        countryCode={
                          form.getFieldValue('countryCode')
                            ? resolveContryCode(form.getFieldValue('countryCode'))
                            : ''
                        }
                        countTime={sendChannel && sendChannel === 'VOICE' ? retryAfterSeconds : 0}
                        loading={isGetingCode}
                        onSend={this.getVoiceCode}
                        disable={disable}
                        onTimeOver={this.switchDisabled}
                        theme={theme.currentTheme}
                      />
                    </FormItemTipText>
                  </FormItemTipWrapper>
                ) : null
              }
            >
              <Input
                id="code"
                allowClear={true}
                suffix={sendCodeBtn}
                addonAfter={null}
                size="xlarge"
                onFocus={() => this.handleReFocus('code')}
                countDown={retryAfterSeconds}
              />
            </FormItem>
          </StyledFormItem>
          <Button
            data-inspector="bind_phone_form_confirm"
            block
            type="primary"
            size="large"
            onClick={this.handleSubmit}
            loading={loading}
            fullWidth
          >
            {isUpdate ? _t('submit') : _t('active')}
          </Button>
        </div>
      </Form>
    );
  }
}
