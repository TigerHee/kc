/**
 * Owner: odan.ou@kupotech.com
 */
import styled from '@emotion/styled';
import { Button, Form } from '@kux/mui';
import { useCallback, useMemo } from 'react';
import { EmailCodeVerify, FormList } from '../../Components';
import { useLegalVerifyCode } from '../../useFetchConf';
import { eScreenStyle, eTheme, eTrueStyle, _t } from '../../utils';

const ForgetPassword = styled.span`
  color: ${eTheme('text30')};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.5px;
  &:hover {
    color: ${eTheme('textPrimary')};
  }
  ${eTrueStyle('littleScreen')`
    color: ${eTheme('textPrimary')};
  `}
  ${eScreenStyle('Max768')`
    font-size: 14px;
    line-height: 1.7;
  `}
`;

const { useForm } = Form;
// 登录
const LogIn = (props) => {
  const { onChange, linkKey, resetKey, run, loading, littleScreen, screen } = props;
  const [form] = useForm();
  const email = Form.useWatch('email', form);
  const ready = !!email;
  const { runAsync: runVerify } = useLegalVerifyCode(
    {
      type: 2,
      email,
    },
    {
      ready,
    },
  );
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
        itemProps: {
          addonAfter: (
            <ForgetPassword
              className="pointer"
              onClick={() => onChange(resetKey)}
              littleScreen={littleScreen}
              screen={screen}
            >
              {_t('8tSUnCfzfUMpXp7wp3wx9E', '忘记密码')}
            </ForgetPassword>
          ),
          type: 'password',
        },
        max: 50,
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
  }, [onChange, resetKey, ready, runVerify, littleScreen]);

  const handleSubmit = useCallback(
    (values) => {
      run(values);
    },
    [run],
  );

  const goSignUp = useCallback(() => {
    onChange(linkKey);
  }, [onChange, linkKey]);

  return (
    <div>
      <FormList
        onFinish={handleSubmit}
        list={list}
        loading={loading}
        form={form}
        title={_t('dmJHa874KLFj38ss3nfJK2', '执法机构账户登录')}
        formSuffix={
          <div>
            <Button type="brandGreen" variant="text" onClick={goSignUp}>
              {_t('sAvEfb4GLVbKuoGQDwbRwr', '注册执法机构')}
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default LogIn;
