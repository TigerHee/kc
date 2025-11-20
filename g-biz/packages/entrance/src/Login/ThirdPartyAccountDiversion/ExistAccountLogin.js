/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect, useState } from 'react';
import { Form, Input, Box, Button, styled } from '@kux/mui';
import { useSelector, useDispatch } from 'react-redux';
import { kcsensorsManualTrack } from '@utils/sensors';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import { Captcha } from '@packages/captcha';
import storage from '@utils/storage';
import { NAMESPACE, ACCOUNT_LOGIN_TAB_KEY, THIRD_PARTY_ACCOUNT_DIVERSION_STEP } from '../constants';
import { useLang } from '../../hookTool';
import {
  getTrackingSource,
  checkAccountType,
  getMobileCode,
  kcsensorsClick,
  compose,
} from '../../common/tools';
import FusionInputFormItem from '../../components/FusionInputFormItem';
import ErrorAlert from '../../components/ErrorAlert';

const { useForm, FormItem } = Form;

const Title = styled.h2`
  font-weight: 700;
  font-size: 40px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-bottom: 32px;
  }
`;

const Desc = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text40};
  margin-top: -24px;
  margin-bottom: 40px;
`;

const ExtendForm = styled(Form)`
  .subButton {
    margin-top: 40px;
  }
  .mtSpace {
    margin-top: 8px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: 0;
    }
  }
`;

const ForgetPWDBox = styled(Box)`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
  margin-top: 0;
`;

export const ExistAccountLogin = ({ onSuccess, onForgetPwdClick, trackingConfig }) => {
  const { t } = useLang();
  const dispatch = useDispatch();
  const [form] = useForm();
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const {
    loginLoading,
    loginErrorTip,
    countryCodes,
    thirdPartyInfo,
    thirdPartyPlatform,
    thirdPartyBindAccountInfo,
    thirdPartyDiversionPrevStepList,
  } = useSelector((s) => s[NAMESPACE]);
  const { multiSiteConfig } = useMultiSiteConfig();
  const accountValue = Form.useWatch('account', form);
  const _pwd = Form.useWatch('password', form);
  const isBtnDisable = !accountValue || !_pwd;
  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      // 是否从账户已绑定过来
      const isFromAccountHasBound = thirdPartyDiversionPrevStepList.length
        ? thirdPartyDiversionPrevStepList[thirdPartyDiversionPrevStepList.length - 1] ===
          THIRD_PARTY_ACCOUNT_DIVERSION_STEP.ACCOUNT_HAS_BOUND
        : false;
      kcsensorsClick(
        isFromAccountHasBound
          ? ['loginExistingKCAccount', 'nextButton']
          : ['bindExistingKCAccountInputPassword', 'nextButton'],
      );
      const accountType = checkAccountType(values?.account);
      const countryCode = getMobileCode(values?.countryCode);
      const source = getTrackingSource(trackingConfig);
      dispatch({
        type: `${NAMESPACE}/loginV2`,
        trackResultParams: {
          source,
        },
        isThirdPartyBindAccount: true,
        payload: {
          password: values.password,
          ...(accountType === 'phone'
            ? {
                loginType: ACCOUNT_LOGIN_TAB_KEY,
                account: `${countryCode}-${values.account}`,
                mobileCode: countryCode,
                phone: values.account,
              }
            : {
                loginType: ACCOUNT_LOGIN_TAB_KEY,
                account: values.account,
              }),
        },
        onSuccess: (data) => {
          kcsensorsManualTrack(
            {
              data: {
                accountType: thirdPartyPlatform,
                loginResult: 'success',
                loginType: 'kcAccount',
              },
            },
            'thirdAccountLogin',
          );
          onSuccess?.(data);
        },
        onOpenCaptcha: () => setCaptchaOpen(true),
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const onCaptchaSuccess = () => {
    kcsensorsManualTrack(
      { data: { accountType: thirdPartyPlatform, robotCheck: 'success' } },
      'thirdAccountLogin',
    );
    setCaptchaOpen(false);
    handleLogin();
  };

  useEffect(() => {
    // 是否从新建账号过来
    const isFromCreateNewAccount = thirdPartyDiversionPrevStepList.length
      ? thirdPartyDiversionPrevStepList[thirdPartyDiversionPrevStepList.length - 1] ===
        THIRD_PARTY_ACCOUNT_DIVERSION_STEP.CREATE_NEW_ACCOUNT
      : false;
    // 是否从绑定已有账号过来
    const isFromBindExistAccount = thirdPartyDiversionPrevStepList.length
      ? thirdPartyDiversionPrevStepList[thirdPartyDiversionPrevStepList.length - 1] ===
        THIRD_PARTY_ACCOUNT_DIVERSION_STEP.BIND_EXIST_ACCOUNT
      : false;
    // 创建新账号或者绑定已有账号时输入的是 kc 账号，则上报
    // 还有一种直接登陆/换绑也会经过这个逻辑
    if (isFromCreateNewAccount || isFromBindExistAccount) {
      kcsensorsManualTrack({
        spm: ['bindExistingKCAccountInputPassword', '1'],
        data: {
          pre_spm_id: isFromCreateNewAccount
            ? compose(['createNewKCAccount', 'createButton'])
            : compose(['bindExistingKCAccountInputAccount', 'nextButton']),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Title>{t('9fabaa38d6f74800a6bb')}</Title>
      <Desc>{t('002c612d14694000a859')}</Desc>
      <ExtendForm form={form} onFinish={handleLogin}>
        <FusionInputFormItem
          key={thirdPartyInfo?.userInfo}
          form={form}
          countryCodes={countryCodes}
          // 如果有账号，则不允许修改账号，正常逻辑都是有账号的
          disabled={thirdPartyBindAccountInfo?.phone || thirdPartyBindAccountInfo?.email}
          scene="login"
          initValues={{
            countryCode: thirdPartyBindAccountInfo?.countryCode || '',
            account: thirdPartyBindAccountInfo?.phone || thirdPartyBindAccountInfo?.email || '',
          }}
          onInputFocus={() => {
            kcsensorsManualTrack({ spm: ['accountInsert', '1'] }, 'page_click');
          }}
          multiSiteConfig={multiSiteConfig}
        />
        <FormItem
          requiredMark={false}
          label={t('login.password')}
          name="password"
          rules={[{ required: true, message: t('form.required') }]}
        >
          <Input
            size="xlarge"
            autoComplete="new-password"
            type="password"
            className="mtSpace"
            allowClear
            data-inspector="signin_password_input"
          />
        </FormItem>
        <ErrorAlert msg={loginErrorTip} />
        <ForgetPWDBox>
          <Box
            display="inline-block"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            data-inspector="signin_forget_password"
            onClick={() => {
              storage.setItem('$entrance.f.mc', thirdPartyBindAccountInfo?.countryCode || '');
              storage.setItem(
                '$entrance.f.a',
                window?.btoa?.(
                  thirdPartyBindAccountInfo?.phone || thirdPartyBindAccountInfo?.email || '',
                ) || '',
              );
              kcsensorsManualTrack({ spm: ['forgetPassword', '1'] }, 'page_click');
              onForgetPwdClick?.();
            }}
          >
            {t('forget.pwd')}
          </Box>
        </ForgetPWDBox>
        <Button
          className="subButton"
          fullWidth
          htmlType="submit"
          size="large"
          loading={loginLoading}
          data-inspector="signin_submit_button"
          disabled={loginLoading || isBtnDisable}
          onClick={handleLogin}
        >
          <span>{loginLoading ? t('login.ing') : t('login')}</span>
        </Button>
        <Captcha
          open={captchaOpen}
          onClose={() => setCaptchaOpen(false)}
          bizType="EMAIL_LOGIN"
          onValidateSuccess={onCaptchaSuccess}
          onValidateError={() => {
            kcsensorsManualTrack(
              { data: { accountType: thirdPartyPlatform, robotCheck: 'fail' } },
              'thirdAccountLogin',
            );
          }}
        />
      </ExtendForm>
    </>
  );
};
