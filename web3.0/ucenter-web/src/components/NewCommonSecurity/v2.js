/**
 * Owner: tiger@kupotech.com
 */
/**
 * 使用说明
 * 如果需要使用自动获取校验类型的，请直接使用 form.js
 * v2：针对是需要一种验证方式即可通过的场景
 */

import { injectLocale } from '@kucoin-base/i18n';
import { NewVoiceCode, SwitchMultiTypeModal } from '@kucoin-biz/entrance';
import { ICTransferOutlined } from '@kux/icons';
import { Button, Form, Input, styled, withResponsive, withTheme } from '@kux/mui';
import { cryptoPwd, evtEmitter } from 'helper';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import SpanForA from 'src/components/common/SpanForA';
import EmailIcon from 'static/account/security/email-verify.svg';
import G2faIcon from 'static/account/security/g2fa-verify.svg';
import SMSIcon from 'static/account/security/sms-verify.svg';
import { _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import storage from 'utils/storage';
import TimerButton from '../Assets/Withdraw/TimerButton';
import NoReceiveEmail from './NoReceiveEmail';
import { ms_switchBtn } from './styled';

const VerifyIconMap = {
  google_2fa: G2faIcon,
  my_email: EmailIcon,
  my_sms: SMSIcon,
};

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

const SwitchWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  column-gap: 4px;
  margin-bottom: 32px;
  cursor: pointer;
`;

const CodeTipMsgBox = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  column-gap: 4px;
  .voiceCodeText {
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px !important;
  }
  .voiceCodeBox {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0px !important;
    line-height: unset;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-flow: row wrap;
  }
`;

const CodeTipMsg = styled.span`
  font-size: 12px;
  font-weight: 400;
  display: inline-block;
  height: 24px;
  padding-top: -1px;
  line-height: 24px;
  margin-right: 4px;
  color: ${({ theme }) => theme.colors.text60};
  b {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 12px;
  }
`;

const VerifyItemWrapper = styled.div`
  width: 100%;
  padding: 14px 19px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 20px;
  border: 1px solid;
  border-radius: 12px;
  cursor: pointer;
  border-color: ${({ theme }) => theme.colors.cover8};
  & + & {
    margin-top: 24px;
  }
`;

const VerifyIcon = styled.div`
  display: flex;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cover4};
`;

const VerifyIconText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 20.8px */
`;

const evt = evtEmitter.getEvt();
const noop = () => {};
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

const { FormItem } = Form;

@connect((state) => {
  const { countryCode = '', phone = '', email } = state?.user?.user || {};
  const { retryAfterSeconds } = state?.security_new || {};
  const isLoading = state.loading.effects['security_new/sec_get_code'];
  const isVerifing = state.loading.effects['security_new/sec_verify'];
  return {
    countryCode,
    phone,
    retryAfterSeconds,
    isLoading,
    isVerifing,
    email,
  };
})
@withResponsive
@withTheme
@injectLocale
class SecForm extends React.Component {
  state = {
    smsDisable: false,
    isVoiceSend: false,
    abnormalModalKey: '',
  };
  switchSmsDisabled = () => {
    const { smsDisable } = this.state;
    this.setState({
      smsDisable: !smsDisable,
    });
  };

  // 校验文案
  typeTxt = {
    my_sms: () => _t('vc.sms'),
    my_email: () => _t('vc.email'),
    withdraw_password: () => _t('trade.code'),
    google_2fa: () => _t('g2fa.code'),
  };

  // 目前支持的validations, 需要发送验证码的
  channels = {
    my_sms: 'my_sms',
    my_email: 'my_email',
    // google_2fa_email: 'google_2fa_email',
    // password: 'withdraw_password',
  };

  modelName = 'security_new';

  constructor(props) {
    super(props);
    this.state = {
      type: 0,
      vals: {},
      filledItems: {},
      chooseModalOpen: false,
    };

    this.handleItemSms = this.handleItem.bind(this, 'my_sms');
    this.handleItemEmail = this.handleItem.bind(this, 'my_email');
    this.handleItemGoogle = this.handleItem.bind(this, 'google_2fa');
    this.handleItemPwd = this.handleItem.bind(this, 'withdraw_password');

    this.getEmailCode = this.getCode.bind(this, 'my_email', false);
    this.getSMSCode = this.getCode.bind(this, 'my_sms', false);
    this.getVoiceCode = this.getCode.bind(this, 'my_sms', true);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.genInstance = this.genInstance.bind(this);
  }

  // 校验实例
  securityHandle = null;

  idListener = null;

  verifyListener = null;

  componentDidMount() {
    const { bizType = '', allowTypes = [] } = this.props;
    this.genInstance();
    evt.on('__VOICE_SEND_SUCCESS__', this.switchSmsDisabled);
  }

  componentDidUpdate(preProps) {
    // updator控制是否从新生成实例，用于安全验证和业务共用提交按钮的情形
    if (preProps.updator !== this.props.updator) {
      this.genInstance();
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: `security_new/update`,
      payload: { retryAfterSeconds: 0 },
    });
    if (this.securityHandle) {
      const { id } = this.securityHandle;
      evt.off(id, this.idListener);
      evt.off(`${id}/verify`, this.verifyListener);
    }
    this.idListener = noop;
    this.verifyListener = noop;
    evt.off('__VOICE_SEND_SUCCESS__', this.switchSmsDisabled);
  }

  /**
   * 创建校验实例
   * @param bizType
   * @returns {Promise<void>}
   */
  genInstance = async () => {
    const { callback, onInit, handleKey, bizType = '', allowTypes = [] } = this.props;
    const channel = allowTypes[0];
    const self = this;
    this.securityHandle = await this.dispatchWrapper('gen_instance', {
      bizType,
      handleKey,
    });

    await onInit(this.securityHandle);

    const { id } = this.securityHandle;
    evt.on(
      id,
      (self.idListener = function idListener({ send, delay = 60 }) {
        // console.log('click', '----');
        evt.emit('__TIMER_BTN_COUNT_START__', {
          send,
          delay,
          id: `__SEND_VCODE__${self.state.vcodeType}`,
        });
      }),
    );
    evt.on(
      `${id}/verify`,
      (self.verifyListener = function verifyListener(result) {
        if (result && result.code === '200' && self.state.btnType) {
          storage.removeItem(
            `${`__SEND_VCODE__${self.state.btnType.toUpperCase()}_`}${bizType || 'DEFAULT'}`,
          );
        }
        callback(result, bizType);
      }),
    );
    this.setChannelType(channel);
  };

  /**
   * 更新channel,如果切换了检验方式，那么需要更新channel (针对需要发送验证码的检验)
   * @param codeType
   */
  setChannelType = (codeType) => {
    const nextChannel = this.channels[codeType];
    if (this.securityHandle?.opts?.channel !== nextChannel) {
      this.securityHandle.update({
        channel: nextChannel,
      });
    }
  };

  // 记录当前是否发送的语音
  recordVoice = (isVoice = false) => {
    this.securityHandle.update({
      isVoiceSend: isVoice,
    });
    this.setState({
      isVoiceSend: isVoice,
    });
  };

  dispatchWrapper = (type = '', payload = {}, other = {}, model) => {
    const _model = model || this.modelName;
    return this.props.dispatch({
      type: `${_model}/${type}`,
      payload,
      ...other,
    });
  };

  /**
   * 处理输入事件
   * @param name
   * @param e
   */
  handleItem = (name, e) => {
    const val = e.target ? e.target.value : e;

    if (val.length > 6) {
      return;
    }
    if (name === 'my_sms' || name === 'my_email') {
      this.setState({
        btnType: name === 'my_sms' ? 'SMS' : 'Email',
      });
    }
    this.setVal(val, name, val.length === 6);
    if (name === 'withdraw_password') {
      this.props.form.setFieldsValue({ withdraw_password: val });
    }
  };

  /**
   * 保存当前的值
   * @param val
   * @param name
   * @param isFullFilled 是否填充完6位数
   */
  setVal = (val, name, isFullFilled) => {
    const { vals, filledItems, type } = this.state;
    const { allowTypes, autoSubmit } = this.props;
    const validationLen = (allowTypes[type] || []).length;
    const self = this;
    filledItems[name] = !!isFullFilled;
    this.setState(
      {
        vals: {
          ...vals,
          [name]: val,
        },
        filledItems,
      },
      () => {
        if (!autoSubmit || validationLen > 1) {
          return;
        }
        if (isFullFilled) {
          const isAllFilled = _.filter(filledItems, (v) => v === true);
          if (isAllFilled && validationLen === isAllFilled.length) {
            self.handleSubmit({ preventDefault: () => {} });
          }
        }
      },
    );
  };

  /**
   * 切换检验类型
   */
  switchType = async (preVal) => {
    // 增加校验类型切换处理
    const { onSwitchType = noop, allowTypes } = this.props;
    const { type } = this.state;

    this.props.form.resetFields();

    let newType = preVal ? preVal : type === 0 ? 1 : 0;

    this.setState({
      type: newType,
      vals: {},
    });
    await onSwitchType(newType, this.securityHandle, allowTypes[newType]);

    trackClick(['switch_trade_verify', '1'], {
      type: String(allowTypes[newType]),
      source: String(allowTypes),
    });
  };

  handleSwitchType = () => {
    const { type, allowTypes } = this.props;
    const isShowModal = allowTypes?.length >= 3;
    if (isShowModal) {
      this.setState({
        chooseModalOpen: true,
      });
    } else if (allowTypes?.length === 2) {
      this.switchType();
    }
  };

  /**
   * 获取验证码
   * @param codeType  验证码类型
   */
  getCode = async (codeType, isVoiceSend = false) => {
    const { allowTypes, dispatch } = this.props;
    const map = {
      my_sms: 'SMS',
      my_email: 'EMAIL',
    };
    await this.setState({
      vcodeType: map[codeType],
    });
    this.setChannelType(codeType);
    if (isVoiceSend) {
      this.recordVoice(true);
    } else {
      this.recordVoice(false);
    }

    trackClick(['send_trade_verify', '1'], {
      type: codeType,
      source: String(allowTypes),
    });
    return this.securityHandle.getCode();
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

  handleSubmit = (e) => {
    const { form, allowTypes } = this.props;
    const self = this;
    const { id } = this.securityHandle;

    e.preventDefault();

    form.validateFields().then(async (values) => {
      const { withdraw_password } = values;
      if (withdraw_password) {
        values.withdraw_password = cryptoPwd(withdraw_password);
      }
      await self.securityHandle.update({
        sec_password: values.password,
        validations: values,
      });
      // 如果没有校验方法，那么直接校验通过
      if (allowTypes.length === 0) {
        evt.emit(`${id}/verify`, {});
        return;
      }
      self.securityHandle.verify();
    });
  };

  render() {
    const {
      isLoading,
      isVerifing,
      form,
      allowTypes,
      submitBtn,
      submitBtnTxt,
      bizType,
      modalLabelPre = '',
      customKeyValue = {},
      retryAfterSeconds,
      countryCode = '',
      phone = '',
      confirmLoading,
      email,
      theme,
      responsive,
    } = this.props;
    const { type, vals, vcodeType, smsDisable, isVoiceSend, abnormalModalKey } = this.state;

    const formType = allowTypes[type] || [];
    const formLabels = this.typeTxt;
    const isH5 = !responsive.sm;

    const nameParams = {
      google_2fa: _t('validation.g2fa'),
      my_email: _t('email.verify'),
      my_sms: _t('validation.sms'),
    };

    const abnormalAllowTypes = {
      my_sms: () => (
        <React.Fragment>
          <FormItemTipWrapper>
            <FormItemTipText>
              {_tHTML('aGdsBqjypc8mNZG4jBLosx', { phone })}
              <span style={{ marginLeft: '6px' }} />
              <NewVoiceCode
                phone={phone || '***'}
                countryCode={countryCode}
                loading={isLoading}
                onSend={this.getVoiceCode}
                disable={smsDisable || isLoading}
                theme={theme.currentTheme}
              />
            </FormItemTipText>
          </FormItemTipWrapper>
        </React.Fragment>
      ),
      my_email: () => (
        <React.Fragment>
          <FormItemTipWrapper>
            <FormItemTipText>
              {_tHTML('tung7oRbHSRMT3fw878BMA', { email })}
              <SpanForA
                style={{ fontWeight: 500, textDecoration: 'underline', marginLeft: '6px' }}
                onClick={() => this.setState({ abnormalModalKey: 'my_email' })}
              >
                {_t('oKr5b7eUVyBut4MhdVpUn3')}
              </SpanForA>
            </FormItemTipText>
          </FormItemTipWrapper>
          <NoReceiveEmail
            open={abnormalModalKey === 'my_email'}
            onOk={() => this.setState({ abnormalModalKey: '' })}
            onCancel={() => this.setState({ abnormalModalKey: '' })}
          />
        </React.Fragment>
      ),
    };

    // 短信、邮件验证码发送按钮
    const sendBtn = (_type) => {
      let _props = {};
      if (_type === 'SMS') {
        _props = {
          // 按钮状态从外部控制
          disabled: smsDisable,
          // 计时开始或结束需要重置按钮状态
          countTimeOver: this.switchSmsDisabled,
          countTimeBegin: this.switchSmsDisabled,
          // 只有发送语音验证码按钮不是通过 TimerButton 实现的
          // 所以不走 TimerButton 内部的事件触发
          // 需要外部传入 retryAfterSeconds 启动计时
          retryAfterSeconds: isVoiceSend ? retryAfterSeconds : undefined,
        };
      }
      return (
        <div key={_type}>
          <TimerButton
            id={`__SEND_VCODE__${_type.toUpperCase()}`}
            loading={isLoading && vcodeType === _type.toUpperCase()}
            onClick={this[`get${_type}Code`]}
            bizType={bizType}
            noStyle
            {..._props}
          />
        </div>
      );
    };

    const formItems = {
      withdraw_password: (
        <div>
          {/* <InputPwdBox
            value={vals.withdraw_password}
            type="password"
            onChange={this.handleItemPwd}
          /> */}
          <Input
            value={vals.withdraw_password}
            type="password"
            size="xlarge"
            allowClear={true}
            onChange={this.handleItemPwd}
            onFocus={() => this.handleReFocus('withdraw_password')}
            label={_t('kpFxektXRT3BgH7FjxZA9X')}
          />
        </div>
      ),
      my_sms: (
        <div>
          <Input
            inputProps={{ maxLength: 6 }}
            value={vals.my_sms}
            onChange={this.handleItemSms}
            addonAfter={null}
            allowClear={true}
            label={_t('vc.sms')}
            size="xlarge"
            onFocus={() => this.handleReFocus('my_sms')}
            suffix={sendBtn('SMS')}
          />
        </div>
      ),
      my_email: (
        <div>
          <Input
            inputProps={{ maxLength: 6 }}
            value={vals.my_email}
            allowClear={true}
            onChange={this.handleItemEmail}
            label={_t('vc.email')}
            onFocus={() => this.handleReFocus('my_email')}
            size="xlarge"
            suffix={sendBtn('Email')}
          />
          {/* <CodeTipMsgBox>
            <CodeTipMsg>{_tHTML('tung7oRbHSRMT3fw878BMA', { email })}</CodeTipMsg>
            <CodeTipBtn
              onClick={() => {
                this.setState({
                  isUnavailableModalOpen: true,
                });
              }}
            >
              {_t('pDKZrdqLi9N7nMngohkwE9')}
            </CodeTipBtn>
          </CodeTipMsgBox> */}
        </div>
      ),
      google_2fa: (
        <div>
          <Input
            inputProps={{ maxLength: 6 }}
            value={vals.google_2fa}
            onChange={this.handleItemGoogle}
            size="xlarge"
            allowClear={true}
            onFocus={() => this.handleReFocus('google_2fa')}
            label={_t('g2fa.code')}
          />
        </div>
      ),
    };

    // 校验器，校验输入的长度
    const validator = (rule, value, callback) => {
      if (!value || value.length !== 6) {
        callback(new Error(_t('form.format.error')));
      } else {
        callback();
      }
    };

    // 获取label
    const getLabel = (key) => {
      // 优先使用自定义key
      let label = customKeyValue[key] || '';
      if (!label) {
        const fromLabelValue = formLabels[key]();
        label = modalLabelPre + fromLabelValue;
      }
      return label;
    };

    // 生成表单
    const createForm = () => {
      return formType.map((key, idx) => {
        return (
          <StyledFormItem
            data-inspector="sec_form"
            key={key}
            hasHelp={key === 'my_email' || key === 'my_sms'}
          >
            <FormItem
              key={key}
              {...formItemLayout}
              label={getLabel(key)}
              name={key}
              initialValue={vals[key]}
              help={
                key === 'my_email'
                  ? abnormalAllowTypes.my_email()
                  : key === 'my_sms'
                  ? abnormalAllowTypes.my_sms()
                  : null
              }
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
              validateFirst={true}
            >
              {formItems[key]}
            </FormItem>
          </StyledFormItem>
        );
      });
    };

    // 提交按钮
    const genSubmit = () => {
      if (submitBtn === null || submitBtn !== undefined) {
        return submitBtn;
      }
      return (
        <Button
          data-inspector="sec_form_submit"
          style={{ width: '100%', marginTop: '8px' }}
          loading={confirmLoading || isVerifing}
          onClick={this.handleSubmit}
          size={isH5 ? 'basic' : 'large'}
        >
          {submitBtnTxt}
        </Button>
      );
    };

    // const genSwitchBtn = () => {
    //   if (allowTypes.length < 2) {
    //     return null;
    //   }

    //   return (
    //     <div>
    //       <SpanForA className={style.ms_switchBtn} onClick={() => this.switchType()}>
    //         {_t('aoEWVYzehyRjXGuYhAkSKN')}
    //       </SpanForA>
    //     </div>
    //   );
    // };

    const genSwitchBtn = () => {
      if (allowTypes.length < 2) {
        return null;
      }

      return (
        <SwitchWrapper onClick={() => this.handleSwitchType()}>
          <ICTransferOutlined size={16} color={theme.colors.primary} />
          <SpanForA
            style={{ color: theme.colors.primary, fontSize: '14px', fontWeight: 500 }}
            className={ms_switchBtn}
          >
            {_t('aoEWVYzehyRjXGuYhAkSKN')}
          </SpanForA>
        </SwitchWrapper>
      );
    };

    return (
      <React.Fragment>
        {/* {isShowTab && (
          <TabsContainer>
            <Tabs
              value={formType[0]}
              onChange={(e, val) => {
                const idx = allowTypes.findIndex((i) => i.includes(val));
                this.switchType(idx);
              }}
              size="medium"
            >
              {allowTypes?.slice(1)?.map((item) => {
                const value = item[0];
                return <Tab value={value} label={nameParams[value]} key={value} />;
              })}
            </Tabs>
          </TabsContainer>
        )} */}
        {createForm()}
        {genSwitchBtn()}
        {genSubmit()}
        {this.state.chooseModalOpen && (
          // <Dialog
          //   open={true}
          //   title={_t('selfService2.selectType.title')}
          //   showCloseX={true}
          //   footer={null}
          //   onCancel={() => this.setState({ chooseModalOpen: false })}
          //   style={{ maxWidth: '520px' }}
          // >
          //   {allowTypes?.map((item, index) => {
          //     if (index === type) return null;
          //     const value = item[0];
          //     return (
          //       <VerifyItemWrapper
          //         value={value}
          //         key={value}
          //         onClick={() => {
          //           const idx = allowTypes.findIndex((i) => i.includes(value));
          //           this.switchType(idx);
          //           this.setState({ chooseModalOpen: false });
          //         }}
          //       >
          //         <VerifyIcon>
          //           <img src={VerifyIconMap[value]} alt="verify-icon" />
          //         </VerifyIcon>
          //         <VerifyIconText>{nameParams[value]}</VerifyIconText>
          //       </VerifyItemWrapper>
          //     );
          //   })}
          //   <Box style={{ height: '48px' }} />
          // </Dialog>
          <SwitchMultiTypeModal
            currentType={type}
            open={this.state.chooseModalOpen}
            title={_t('selfService2.selectType.title')}
            validations={allowTypes}
            showCloseX={true}
            footer={null}
            onCancel={() => this.setState({ chooseModalOpen: false })}
            onOk={(nth) => {
              this.switchType(nth);
              this.setState({ chooseModalOpen: false });
            }}
            style={{ maxWidth: '520px' }}
          />
        )}
      </React.Fragment>
    );
  }
}

SecForm.defaultProps = {
  callback: noop,
  onInit: noop,
  submitBtnTxt: _t('submit'),
  autoSubmit: false,
};

const _allowTypes = ['my_sms', 'my_email', 'google_2fa', 'withdraw_password'];

function _allowTypeValidator(propValue, key, componentName, location, propFullName) {
  if (_allowTypes.indexOf(propValue[key]) === -1) {
    return new Error(
      `Invalid prop \`${propFullName}\` supplied to \`${componentName}\`. Validation failed.`,
    );
  }
}

SecForm.propTypes = {
  // 必须传入form引用
  form: PropTypes.object.isRequired,
  // 允许的组合类型
  allowTypes: PropTypes.arrayOf(PropTypes.arrayOf(_allowTypeValidator)).isRequired,
  // 外部植入的formItem 的 className
  formItemClas: PropTypes.string,
  // 当切换校验类型时外部的操作
  onSwitchType: PropTypes.func,
  // 自定义提交按钮，如果不需要默认的，或这需要独自处理提交，可以设置为null
  submitBtn: PropTypes.element,
  // 自定义提交按钮的文字
  submitBtnTxt: PropTypes.string,
  // 将要处理的校验业务类型
  bizType: PropTypes.string.isRequired,
  // 校验后的回调函数, 可接入校验后的业务
  callback: PropTypes.func.isRequired,
  // 校验实例初始化成功后
  onInit: PropTypes.func.isRequired,
  // 指定校验实例的key， 不传或为null,undefined 时随机生成一个
  handleKey: PropTypes.string,
  autoSubmit: PropTypes.bool.isRequired,
};

export default SecForm;
