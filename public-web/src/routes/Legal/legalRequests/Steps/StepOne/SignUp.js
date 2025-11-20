/**
 * Owner: odan.ou@kupotech.com
 */
import { Button, Form } from '@kux/mui';
import { useNewRef } from 'hooks';
import { useCallback, useMemo } from 'react';
import { EmailCodeVerify, FormList, PassWordRule } from '../../Components';
import { useLegalVerifyCode, useUpdataUser } from '../../useFetchConf';
import { _t } from '../../utils';

const { useForm } = Form;
// 注册
const SignUp = (props) => {
  const {
    onChange,
    btnName = _t('sign.up', '注册'),
    title = _t('9dkYgiC19iGnQUSfh6m6SD', '执法机构账户注册'),
    linkKey,
    type = 1,
  } = props;
  const [form] = useForm();
  const email = Form.useWatch('email', form);
  const password = Form.useWatch('password', form);
  const password2 = Form.useWatch('password2', form);
  const formConfRef = useNewRef({
    password,
    password2,
    form,
  });

  const ready = !!email;

  const goLogIn = useCallback(() => {
    onChange(linkKey);
  }, [onChange, linkKey]);

  const { runAsync: runVerify } = useLegalVerifyCode(
    {
      type,
      email,
    },
    {
      ready,
    },
  );
  const { run, loading } = useUpdataUser(type, goLogIn);
  const list = useMemo(() => {
    return [
      {
        label: _t('kmDER93yjWuus2FL5nvLdG', '邮箱地址'),
        name: 'email',
        max: 255,
      },
      {
        label: _t('7uKbT7F3nCQ6613s6btwKK', '密码'),
        name: 'password',
        max: 50,
        itemProps: {
          type: 'password',
        },
        formItemProps: { validateTrigger: ['onBlur', 'onSubmit'] },
        rules: [
          PassWordRule,
          {
            validator(rule, value) {
              if (
                value &&
                formConfRef.current.password2 &&
                value !== formConfRef.current.password2
              ) {
                return Promise.reject(_t('6ixgscKCUd4rGmTBXv1KDv', '两次密码不一致'));
              }
              return Promise.resolve();
            },
          },
        ],
      },
      {
        label: _t('3hzH5gnKNWf8Cut3ocLqBK', '确认密码'),
        name: 'password2',
        max: 50,
        itemProps: {
          type: 'password',
        },
        rules: [
          PassWordRule,
          {
            validator(rule, value) {
              if (value && formConfRef.current.password && value !== formConfRef.current.password) {
                return Promise.reject(_t('6ixgscKCUd4rGmTBXv1KDv', '两次密码不一致'));
              }
              return Promise.resolve();
            },
          },
        ],
        formItemProps: { validateTrigger: ['onBlur', 'onSubmit'] },
      },
      {
        label: _t('8bJrR2wNgAkvwgY9JHvmcZ', '验证码'),
        name: 'verifyCode',
        itemProps: {
          addonAfter: <EmailCodeVerify onClick={runVerify} ready={ready} />,
        },
        max: 50,
      },
    ];
  }, [runVerify, ready]);

  const handleSubmit = useCallback(
    (values) => {
      run(values);
    },
    [run],
  );

  return (
    <div>
      <FormList
        onFinish={handleSubmit}
        list={list}
        loading={loading}
        form={form}
        title={title}
        formSuffix={
          <div>
            <Button type="brandGreen" variant="text" onClick={goLogIn}>
              {_t('tiEdL59yYcDbeZhQWXKyJH', '使用已有账号登录')}
            </Button>
          </div>
        }
        btnName={btnName}
      />
    </div>
  );
};

export default SignUp;

/// 重置密码
export const ResetPassword = (props) => {
  const name = _t('7X2YFqo6icHtioW117Rora', '重置密码');
  return <SignUp {...props} btnName={name} title={name} type={3} />;
};
