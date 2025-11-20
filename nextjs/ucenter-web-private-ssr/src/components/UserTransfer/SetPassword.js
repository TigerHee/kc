/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { Button, Form, Input } from '@kux/mui';
import TradePasswordNoticeModal from 'components/common/TradePasswordNoticeModal';
import React from 'react';
import { connect } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';
import { passwords } from 'utils/easyPasswordLib';
import { FormTitle, SetPasswordWrapper, TradePrassword, Warn } from './styled';

const { FormItem, withForm } = Form;

export const pwdValidator = (rule, value, callback) => {
  if (!value || !value.match(/^\d{6}$/)) {
    callback(new Error(_t('form.tradeCode.required')));
  }
  if (passwords.indexOf(value) > -1) {
    callback(new Error(_t('form.secLevel.error')));
  }
  callback();
};

@connect()
@withForm()
@injectLocale
export default class SetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: props.step || 0,
      modalVisible: true,
    };
  }

  static defaultProps = {
    title: _t('set.trade.code'),
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if ('step' in nextProps) {
      return {
        ...prevState,
        step: nextProps.step,
      };
    }
  }

  handleSubmit = () => {
    const { dispatch } = this.props;
    this.props.form.validateFields().then((values) => {
      const { password } = values;
      dispatch({
        type: 'utransfer/upgrade_password',
        payload: {
          withdrawPassword: password,
        },
      });
    });
  };

  // 校验手机号输入组件的值
  validatePassword = (rule, value, callback) => {
    const {
      form: { getFieldValue },
    } = this.props;
    if (value && value !== getFieldValue('password')) {
      callback(_t('form.inconsistent'));
    }
    callback();
  };

  render() {
    const { loading, title } = this.props;
    const { step, modalVisible } = this.state;
    return (
      <React.Fragment>
        <SetPasswordWrapper>
          <FormTitle>
            <h1>{title}</h1>
          </FormTitle>
          {step === 0 ? (
            <TradePrassword />
          ) : (
            <React.Fragment>
              <Warn>{_tHTML('trade.code.warning')}</Warn>
              <div>
                <FormItem
                  name="password"
                  label={_t('create.trade.code.placeholder')}
                  rules={[
                    {
                      required: true,
                      message: _t('form.required'),
                    },
                    {
                      validator: pwdValidator,
                    },
                  ]}
                >
                  <Input
                    data-testid="trade.code"
                    size="xlarge"
                    allowClear={true}
                    type="password"
                    inputProps={{ maxLength: 6 }}
                  />
                </FormItem>
                <FormItem
                  name="passwordr"
                  label={_t('trade.code.confirm')}
                  rules={[
                    {
                      required: true,
                      message: _t('form.required'),
                    },
                    {
                      validator: this.validatePassword,
                    },
                    {
                      validator: pwdValidator,
                    },
                  ]}
                >
                  <Input
                    data-testid="trade.code.confirm"
                    size="xlarge"
                    type="password"
                    allowClear={true}
                    inputProps={{ maxLength: 6 }}
                  />
                </FormItem>
                <Button
                  loading={loading}
                  fullWidth
                  type="primary"
                  size="large"
                  data-testid="submit"
                  onClick={this.handleSubmit}
                >
                  {_t('submit')}
                </Button>
              </div>
            </React.Fragment>
          )}
        </SetPasswordWrapper>
        {step === 1 && (
          <TradePasswordNoticeModal
            visible={modalVisible}
            onClose={() => {
              this.setState({ modalVisible: false });
            }}
          />
        )}
      </React.Fragment>
    );
  }
}
