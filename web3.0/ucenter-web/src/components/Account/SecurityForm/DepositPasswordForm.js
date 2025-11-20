/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Alert, Button, Form, Input, styled, withResponsive } from '@kux/mui';
import { Link } from 'components/Router';
import { clickGaName, siteidGaName } from 'config/base';
import { tenantConfig } from 'config/tenant';
import _ from 'lodash';
import React from 'react';
import { _t, _tHTML } from 'tools/i18n';
import { passwords } from 'utils/easyPasswordLib';
import { gaClickNew } from 'utils/ga';
import { AlertContent, AlertWrapper, DepositTip, FormBody, FormWrapper } from './styled';

const { withForm, FormItem } = Form;

const StyledFormItem = styled.div`
  margin-bottom: 10px;
`;

const StyledCenterBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 24px;
`;

let pwdHave = false; // 是否输入了密码
let pwdRHave = false; // 是否再次输入了密码
const pwdGa = () => {
  if (!pwdHave) {
    pwdHave = true;
    gaClickNew(clickGaName, {
      siteid: siteidGaName,
      pageid: 'securitySecret',
      modid: 'passwordInsert',
      eleid: 1,
    });
  }
};
const pwdRGa = () => {
  if (!pwdRHave) {
    pwdRHave = true;
    gaClickNew(clickGaName, {
      siteid: siteidGaName,
      pageid: 'securitySecret',
      modid: 'passwordInsertOnce',
      eleid: 1,
    });
  }
};
const submitGa = () => {
  gaClickNew(clickGaName, {
    siteid: siteidGaName,
    pageid: 'securitySecret',
    modid: 'confirm',
    eleid: 1,
  });
};

const handleValuesChange = (values) => {
  if (values.password) {
    pwdGa();
  }
  if (values.passwordr) {
    pwdRGa();
  }
};

@withResponsive
@withForm({ name: 'SetForm', onValuesChange: handleValuesChange })
@injectLocale
class SetForm extends React.Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    pwdHave = false;
    pwdRHave = false;
  }

  handleSubmit = () => {
    const { onSubmit = () => {}, form } = this.props;
    form
      .validateFields()
      .then((values) => {
        onSubmit(null, values);
      })
      .catch((err) => {
        console.log('err:', err);
      });
    submitGa();
  };

  // 校验手机号输入组件的值
  validatePassword = (rule, value) => {
    const {
      form: { getFieldValue },
    } = this.props;
    return new Promise((resolve, reject) => {
      _.delay(() => {
        if (value && value !== getFieldValue('password')) {
          reject(new Error(_t('form.inconsistent')));
          return;
        }
        resolve();
      }, 300);
    });
  };

  pwdValidator = (rule, value) => {
    return new Promise((resolve, reject) => {
      _.delay(() => {
        if (value && !value.match(/^\d{6}$/)) {
          reject(new Error(_t('form.tradeCode.required')));
          return;
        }
        if (passwords.indexOf(value) > -1) {
          reject(new Error(_t('form.secLevel.error')));
          return;
        }
        resolve();
      }, 300);
    });
  };

  render() {
    const { loading, responsive } = this.props;
    const isH5 = !responsive.sm;
    const message = <span>{_tHTML('trade.code.warning')}</span>;
    return (
      <div>
        {/* <div className={style.formTitle}>{_t('trade.code.setting')}</div> */}
        <div style={{ marginBottom: isH5 ? 20 : 40 }}>
          <Alert type="warning" description={message} showIcon />
        </div>
        <FormBody>
          <StyledFormItem>
            <FormItem
              name="password"
              label={_t('trade.code')}
              rules={[
                { required: true, message: _t('form.required') },
                {
                  validator: this.pwdValidator,
                },
              ]}
            >
              <Input
                allowClear={true}
                id="password"
                size="xlarge"
                label={_t('trade.code.required')}
                type="password"
                inputProps={{ maxLength: 6 }}
              />
            </FormItem>
          </StyledFormItem>
          <StyledFormItem>
            <FormItem
              name="passwordr"
              label={_t('trade.code.confirm')}
              rules={[
                { required: true, message: _t('form.required') },
                {
                  validator: this.validatePassword,
                },
                {
                  validator: this.pwdValidator,
                },
              ]}
            >
              <Input
                id="passwordr"
                size="xlarge"
                allowClear={true}
                label={_t('trade.code.confirm')}
                type="password"
                inputProps={{ maxLength: 6 }}
              />
            </FormItem>
          </StyledFormItem>
          <Button
            loading={loading}
            size="large"
            style={{ width: '100%', marginTop: '16px' }}
            onClick={this.handleSubmit}
          >
            {_t('confirm')}
          </Button>
        </FormBody>
      </div>
    );
  }
}

@withForm({ name: 'UpdateForm', onValuesChange: handleValuesChange })
class UpdateForm extends React.Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    pwdHave = false;
    pwdRHave = false;
  }

  handleSubmit = () => {
    const { onSubmit = () => {}, isUpdate, form } = this.props;
    form
      .validateFields()
      .then((values) => {
        onSubmit(null, values, isUpdate);
      })
      .catch((err) => {
        console.log('err:', err);
      });
    submitGa();
  };

  // 校验手机号输入组件的值
  validatePassword = (rule, value) => {
    const {
      form: { getFieldValue },
    } = this.props;
    return new Promise((resolve, reject) => {
      _.delay(() => {
        if (value && value !== getFieldValue('password')) {
          reject(new Error(_t('form.inconsistent')));
          return;
        }
        resolve();
      }, 300);
    });
  };

  // 弱密码校验
  pwdValidator = (rule, value) => {
    return new Promise((resolve, reject) => {
      _.delay(() => {
        if (value && !value.match(/^\d{6}$/)) {
          reject(new Error(_t('form.tradeCode.required')));
          return;
        }
        if (passwords.indexOf(value) > -1) {
          reject(new Error(_t('form.secLevel.error')));
          return;
        }
        resolve();
      }, 300);
    });
  };

  // 原password 变动时检验rpassword
  // triggerValidate = () => {
  //   const { form } = this.props;
  //   const val = form.getFieldValue('passwordr');
  //   if (val || form.isFieldsTouched(['passwordr'])) {
  //     form.validateFields(['passwordr']);
  //   }
  //   return Promise.reject();
  // };

  newOldValidator = (rule, value) => {
    const {
      form: { getFieldValue },
    } = this.props;
    return new Promise((resolve, reject) => {
      _.delay(() => {
        if (value && value === getFieldValue('passwordo')) {
          reject(new Error(_t('same.new.psw.warning')));
        } else {
          resolve();
        }
      }, 300);
    });
  };

  render() {
    const { loading, isUpdate, isSub = false, onClickForget } = this.props;

    const message = (
      <span>
        {isUpdate ? (
          <AlertContent>
            <span>{tenantConfig.resetPwd.alertMsg(_t)}</span>
            <span>{_t('update.pwd.withdraw.tips2')}</span>
          </AlertContent>
        ) : (
          _tHTML('trade.code.warning')
        )}
      </span>
    );
    return (
      <FormWrapper>
        <AlertWrapper>
          <Alert type="warning" description={message} showIcon />
        </AlertWrapper>
        <FormBody>
          <StyledFormItem>
            <FormItem
              name="passwordo"
              label={_t('trade.code.old')}
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
              ]}
            >
              <Input allowClear={true} size="xlarge" label={_t('trade.code.old')} type="password" />
            </FormItem>
          </StyledFormItem>
          <StyledFormItem>
            <FormItem
              name="password"
              label={_t('trade.code.new')}
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
                {
                  validator: this.pwdValidator,
                },
                {
                  validator: this.newOldValidator,
                },
              ]}
            >
              <Input
                allowClear={true}
                size="xlarge"
                label={_t('trade.code.new')}
                type="password"
                inputProps={{ maxLength: 6 }}
              />
            </FormItem>
          </StyledFormItem>
          <StyledFormItem>
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
                  validator: this.pwdValidator,
                },
              ]}
            >
              <Input
                size="xlarge"
                allowClear={true}
                label={_t('trade.code.required')}
                type="password"
                inputProps={{ maxLength: 6 }}
              />
            </FormItem>
          </StyledFormItem>
          <Button
            loading={loading}
            style={{ width: '100%', marginTop: '16px' }}
            variant="contained"
            size="large"
            onClick={this.handleSubmit}
          >
            {_t('confirm')}
          </Button>
          <FormItem>
            <StyledCenterBox>
              {!isSub && (
                <Link to="/account/security/forgetWP" onClick={onClickForget}>
                  <DepositTip>{_t('7YJho9bhmBW6xyfTrTb64L')}</DepositTip>
                </Link>
              )}
            </StyledCenterBox>
          </FormItem>
        </FormBody>
      </FormWrapper>
    );
  }
}

const DepositPasswordForm = {
  SetForm,
  UpdateForm,
};

export default DepositPasswordForm;
