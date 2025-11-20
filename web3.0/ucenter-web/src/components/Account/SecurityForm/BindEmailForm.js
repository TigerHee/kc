/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Button, Form, Input, styled } from '@kux/mui';
import CountDownBtn from 'components/common/CountDownBtn';
import { message } from 'components/Toast';
import React from 'react';
import { connect } from 'react-redux';
import SpanForA from 'src/components/common/SpanForA';
import NoReceiveEmail from 'src/components/NewCommonSecurity/NoReceiveEmail';
import { _t, _tHTML } from 'tools/i18n';

const { FormItem, withForm } = Form;

const StyledFormItem = styled.div`
  margin-bottom: 32px;
  .KuxForm-itemHelp {
    display: ${({ hasHelp }) => (hasHelp ? 'flex' : 'none')};
  }

  .KuxForm-itemError {
    .KuxForm-itemHelp {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-end;
      justify-content: flex-start;
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

const AbnormalBox = styled.div`
  & > div > span {
    padding: 0;
    font-weight: 500;
    font-size: 12px;
    line-height: unset;
  }
`;

@connect((state) => {
  const { email = '' } = state.user.user || {};
  return {
    email,
  };
})
@withForm()
@injectLocale
export default class BindEmailForm extends React.Component {
  state = {
    isGetingCode: false,
    retryAfterSeconds: 0,
    open: false,
    loading: false,
    inputEmail: '',
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, bizType, onSuccess, form, onError } = this.props;

    form
      .validateFields()
      .then((values) => {
        let effect = 'account_security/bindEmail';
        if (bizType === 'UPDATE_EMAIL') {
          effect = 'account_security/updateEmail';
        }
        this.setState({ loading: true });
        dispatch({
          type: effect,
          payload: {
            params: { ...values },
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

  getVcode = () => {
    const { dispatch, bizType, form } = this.props;
    if (this.state.retryAfterSeconds > 0) {
      return false;
    }
    const email = form.getFieldValue('email');
    form
      .validateFields(['email'])
      .then(() => {
        this.setState({ isGetingCode: true, retryAfterSeconds: 0 });
        dispatch({
          type: 'account_security/sendBindCode',
          payload: {
            type: 'email',
            params: {
              email,
              bizType,
            },
          },
        })
          .then(({ retryAfterSeconds }) => {
            this.setState({ retryAfterSeconds }, () => {
              setTimeout(() => {
                this.setState({ retryAfterSeconds: 0 });
              }, retryAfterSeconds * 1000);
            });
            message.success(_t('operation.succeed'));
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

  obfuscateEmail(email) {
    // 正则表达式匹配email地址，并捕获用户名和域名
    const emailPattern = /^([^@]+)@([^@]+\.[^@]+)$/;
    const match = email.match(emailPattern);

    if (match) {
      const username = match[1];
      const domain = match[2];

      // 将用户名和域名替换为所需格式
      const obfuscatedUsername = username.slice(0, 2) + '***';
      const obfuscatedDomain =
        domain.split('.')[0].replace(/.*/, '***') + '.' + domain.split('.').slice(1).join('.');

      return `${obfuscatedUsername}@${obfuscatedDomain}`;
    } else {
      return email;
    }
  }

  render() {
    const { form, isUpdate, email, showTitle = true, showAlert = true } = this.props;
    const { isGetingCode, retryAfterSeconds, open, loading, inputEmail } = this.state;
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

    const validator = (rule, value, callback) => {
      if (!value || value.length !== 6) {
        callback(new Error(_t('form.format.error')));
      } else {
        callback();
      }
    };

    const sendCodeBtn = (
      <SendBtn>
        <CountDownBtn init={retryAfterSeconds} loading={isGetingCode} onClick={this.getVcode} />
      </SendBtn>
    );
    return (
      <Form form={form} onSubmit={this.handleSubmit} data-testid="form">
        {!!showTitle && <FormTitle>{_t('email.bind.title')}</FormTitle>}
        <StyledFormItem>
          <FormItem
            {...formItemLayout}
            label={_t('email')}
            name="email"
            validateTrigger="onBlur"
            rules={[
              {
                type: 'email',
                message: _t('form.format.error'),
              },
              {
                required: true,
                message: _t('form.required'),
              },
            ]}
          >
            <Input
              inputProps={{ maxLength: 52 }}
              id="email"
              size="xlarge"
              allowClear={true}
              onChange={(e) => this.setState({ inputEmail: e?.target?.value ?? '' })}
            />
          </FormItem>
        </StyledFormItem>
        <StyledFormItem hasHelp={true}>
          <FormItem
            name="code"
            label={_t('vc.email')}
            validateTrigger={['onSubmit']}
            rules={[
              {
                required: true,
                message: _t('form.required'),
              },
              {
                validator,
              },
            ]}
            help={
              <>
                <FormItemTipWrapper>
                  <FormItemTipText>
                    {_tHTML('tung7oRbHSRMT3fw878BMA', { email: this.obfuscateEmail(inputEmail) })}
                    <SpanForA
                      style={{ textDecoration: 'underline', fontWeight: 500, marginLeft: '6px' }}
                      onClick={() => this.setState({ open: true })}
                    >
                      {_t('oKr5b7eUVyBut4MhdVpUn3')}
                    </SpanForA>
                  </FormItemTipText>
                </FormItemTipWrapper>
                <NoReceiveEmail
                  open={open}
                  inputEmail={this.obfuscateEmail(inputEmail)}
                  onCancel={() => this.setState({ open: false })}
                  onOk={() => this.setState({ open: false })}
                />
              </>
            }
          >
            <Input
              allowClear={true}
              id="code"
              size="xlarge"
              inputProps={{ maxLength: 6 }}
              suffix={sendCodeBtn}
              addonAfter={null}
              onFocus={() => this.handleReFocus('code')}
              label={_t('placeholder.vc')}
            />
          </FormItem>
        </StyledFormItem>
        <Button
          block
          type="primary"
          fullWidth
          size="large"
          loading={loading}
          onClick={this.handleSubmit}
        >
          {isUpdate ? _t('submit') : _t('active')}
        </Button>
      </Form>
    );
  }
}
