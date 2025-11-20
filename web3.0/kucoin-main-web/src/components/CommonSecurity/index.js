/**
 * Owner: willen@kupotech.com
 */
/**
 * 使用说明
 * 如果需要使用自动获取校验类型的，请直接使用 form.js
 */
import React from 'react';
import _ from 'lodash';
import { _t } from 'tools/i18n';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Form, Input } from '@kc/ui';
import { evtEmitter, cryptoPwd } from 'helper';
import InputPwdBox from '../Assets/Withdraw/InputPwdBox';
import TimerButton from '../Assets/Withdraw/TimerButton';
import storage from 'utils/storage';

import style from '../Assets/Withdraw/style.less';
import aStyle from './style.less';
import { Button } from '@kc/mui';
import VoiceCode from 'components/VoiceCode';
import { injectLocale } from '@kucoin-base/i18n';
import SpanForA from 'components/common/SpanForA';

const evt = evtEmitter.getEvt();
const InputSend = Input.Send;

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

// "switch.sms": "切换为短信验证",
// "switch.g2fa": "切换为谷歌验证",
// "swicth.g2fa.and.email": "切换为谷歌和邮件验证",

// 国际化keys对应
const keysIntelMap = {
  my_sms: 'switch.sms',
  google_2fa: 'switch.g2fa',
  my_email_google_2fa: 'swicth.g2fa.and.email',
};

/**
 * 由于国际化原因，需对组合进行转换
 * @param {*} keys
 */
const getKeyForIntel = (keys) => {
  const result = ['my_sms', 'my_email', 'google_2fa']
    .filter((k) => {
      return keys.indexOf(k) > -1;
    })
    .join('_');
  return keysIntelMap[result];
};

@connect((state) => {
  const { countryCode = '', phone = '' } = state.user.user || {};
  const { retryAfterSeconds } = state.security_new;
  const isLoading = state.loading.effects['security_new/sec_get_code'];
  const isVerifing = state.loading.effects['security_new/sec_verify'];
  return {
    countryCode,
    phone,
    retryAfterSeconds,
    isLoading,
    isVerifing,
  };
})
@injectLocale
class SecForm extends React.Component {
  state = {
    disable: false,
    isVoiceSend: false,
  };

  switchDisabled = () => {
    const { disable } = this.state;
    this.setState({
      disable: !disable,
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
      // type: 0,
      vals: {},
      filledItems: {},
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
    this.genInstance(bizType, allowTypes[0]);
  }

  componentWillUnmount() {
    if (this.securityHandle) {
      const { id } = this.securityHandle;
      evt.off(id, this.idListener);
      evt.off(`${id}/verify`, this.verifyListener);
    }
    this.idListener = noop;
    this.verifyListener = noop;
  }

  /**
   * 创建校验实例
   * @param bizType
   * @returns {Promise<void>}
   */
  genInstance = async (bizType, channel) => {
    const { callback, onInit, handleKey, form } = this.props;
    const self = this;
    this.securityHandle = await this.dispatchWrapper('gen_instance', {
      bizType,
      handleKey,
    });

    await onInit(this.securityHandle);

    const { id } = this.securityHandle;
    // console.log(hasListeners(evt, id));
    // console.log(hasListeners(evt, `${id}/verify`));
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
        } else {
          const data = result.data || [];
          const fields = {};
          data.map((f) => {
            fields[f.validationType] = {
              value: form.getFieldValue(f.validationType),
              errors: [
                {
                  field: f.validationType,
                  // message: f.checkResult,
                  message: <span>&nbsp;</span>,
                },
              ],
            };
            return '';
          });
          setTimeout(() => {
            form.setFields(fields);
          });
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
    if (this.securityHandle.opts.channel !== nextChannel) {
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
  switchType = async (val) => {
    // 增加校验类型切换处理
    const { onSwitchType = noop, allowTypes } = this.props;
    // const { vals } = this.state;
    this.props.form.resetFields();
    this.setState({
      type: val,
      vals: {
        // password: vals.password,
      },
    });
    await onSwitchType(val, this.securityHandle, allowTypes[val]);
  };

  /**
   * 获取验证码
   * @param codeType  验证码类型
   */
  getCode = async (codeType, isVoiceSend = false) => {
    // const { bizType } = this.props;
    // console.log(codeType);
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
      evt.on('__VOICE_SEND_SUCCESS__', () => {
        this.setState({
          disable: true,
        });
      });
    } else {
      this.recordVoice(false);
    }
    return this.securityHandle.getCode();
  };

  handleSubmit = (e) => {
    const { form, allowTypes } = this.props;
    const self = this;
    const { id } = this.securityHandle;

    e.preventDefault();

    form.validateFieldsAndScroll({ force: true }, async (err, values) => {
      if (!err) {
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
      } else {
        console.log(err);
      }
    });
  };

  render() {
    const {
      isLoading,
      isVerifing,
      form,
      allowTypes,
      formItemClas = '',
      submitBtn,
      submitBtnTxt,
      bizType,
      modalLabelPre = '',
      customKeyValue = {},
      retryAfterSeconds,
      countryCode = '',
      phone = '',
    } = this.props;
    const { type, vals, vcodeType, disable, isVoiceSend } = this.state;
    const formType = allowTypes[type] || [];
    const includeSms = formType.includes('my_sms');
    const formLabels = this.typeTxt;

    const { getFieldDecorator } = form;

    // 短信、邮件验证码发送按钮
    const sendBtn = (_type) => {
      let _props = {};
      let btnClass = '';
      if (_type === 'SMS') {
        _props = {
          disabled: disable,
          countTimeOver: this.switchDisabled,
          countTimeBegin: this.switchDisabled,
        };
        btnClass = style.sms_Btn;
      }
      return (
        <div key={_type}>
          <TimerButton
            id={`__SEND_VCODE__${_type.toUpperCase()}`}
            loading={isLoading && vcodeType === _type.toUpperCase()}
            onClick={this[`get${_type}Code`]}
            bizType={bizType}
            className={`${style.ms_sendBtn} ${btnClass}`}
            {..._props}
          />
        </div>
      );
    };

    const formItems = {
      withdraw_password: (
        <InputPwdBox
          // value={vals.withdraw_password}
          type="password"
          onChange={this.handleItemPwd}
        />
      ),
      my_sms: (
        <div>
          <InputSend
            maxLength={6}
            value={vals.my_sms}
            onChange={this.handleItemSms}
            // enterButton={sendBtn('SMS')}
            addonAfter={null}
            placeholder={_t('vc.sms')}
            addonBefore={sendBtn('SMS')}
          />
        </div>
      ),
      my_email: (
        <div>
          <InputSend
            maxLength={6}
            value={vals.my_email}
            onChange={this.handleItemEmail}
            addonAfter={null}
            // enterButton={sendBtn('Email')}
            placeholder={_t('vc.email')}
            addonBefore={sendBtn('Email')}
          />
        </div>
      ),
      google_2fa: (
        <div>
          <Input
            maxLength={6}
            value={vals.google_2fa}
            onChange={this.handleItemGoogle}
            placeholder={_t('g2fa.code')}
          />
        </div>
      ),
    };

    const _formItemClas = () => {
      return classnames({
        [style.ms_form_item]: true,
        [formItemClas]: !!formItemClas,
        [aStyle.form_item]: true,
        // [style.ms_form_item_last]: isLast,
      });
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
          <Form.Item
            className={_formItemClas(idx === formType.length - 1)}
            key={key}
            {...formItemLayout}
            label={getLabel(key)}
          >
            {getFieldDecorator(key, {
              initialValue: vals[key],
              validate: [
                {
                  trigger: ['onChange', 'onSubmit'],
                  rules: [
                    {
                      required: true,
                      message: _t('form.required'),
                    },
                  ],
                },
                {
                  trigger: ['onSubmit'],
                  rules: [
                    {
                      validator,
                    },
                  ],
                },
              ],
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(formItems[key])}
          </Form.Item>
        );
      });
    };

    // 提交按钮
    const genSubmit = () => {
      if (submitBtn === null || submitBtn !== undefined) {
        return submitBtn;
      }
      console.log('submitBtnTxt:', submitBtnTxt);
      return (
        <Button fullWidth block type="primary" loading={isVerifing} onClick={this.handleSubmit}>
          {submitBtnTxt}
        </Button>
      );
    };

    /**
     * 多个选择时切换，可以支持多种切换
     * @returns {*}
     */
    // const genSwitchBtn = () => {
    //   return (
    //     <Select
    //       value={type}
    //       onChange={this.switchType}
    //     >
    //       { allowTypes.map((ty, idx) => {
    //         return (<Select.Option
    //           value={allowTypes[(idx + 1) % allowTypes.length]}
    //           style={{ textTransform: 'uppercase' }}
    //         >{ty}</Select.Option>);
    //       })}
    //     </Select>);
    // };

    const genSwitchBtn = () => {
      if (allowTypes.length < 2) {
        return null;
      }
      const nextType = (type + 1) % allowTypes.length;
      // TODO 杨磊来翻译
      // const nextTypeStr = allowTypes[nextType].map(ty => this.switchTypeTxt[ty]()).join('+');
      // getKeyForIntel

      const nextTypeStr = getKeyForIntel(allowTypes[nextType]);

      return (
        <div>
          <SpanForA className={style.ms_switchBtn} onClick={() => this.switchType(nextType)}>
            {_t(nextTypeStr)}
          </SpanForA>
        </div>
      );
    };
    return (
      <React.Fragment>
        {createForm()}
        {genSwitchBtn()}
        {genSubmit()}
        <div style={{ display: includeSms ? 'flex' : 'none', justifyContent: 'flex-end' }}>
          <VoiceCode
            color="#24AE8F"
            phone={phone}
            countryCode={countryCode || ''}
            loading={isLoading}
            disable={disable || isLoading}
            countTime={isVoiceSend ? retryAfterSeconds : 0}
            onTimeOver={this.switchDisabled}
            onSend={this.getVoiceCode}
          />
        </div>
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
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
  }).isRequired,

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
