/**
 * Owner: sean.shi@kupotech.com
 */
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Form, Input, Box, Button } from '@kux/mui';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import { useMultiSiteConfig } from 'hooks';
import { Captcha } from 'packages/captcha';
import storage from 'tools/storage';
import { ACCOUNT_LOGIN_TAB_KEY, THIRD_PARTY_ACCOUNT_DIVERSION_STEP } from '../constants';
import { useLang } from '../../hookTool';
import { getTrackingSource, checkAccountType, getMobileCode, compose } from '../../common/tools';
import FusionInputFormItem from '../../components/FusionInputFormItem';
import { ErrorAlert } from '../../components/ErrorAlert';
import { useLoginStore } from '../model';
import styles from './index.module.scss';

const { useForm, FormItem } = Form;

interface ExistAccountLoginProps {
  onSuccess?: (data: any) => void;
  onForgetPwdClick?: () => void;
  trackingConfig?: Record<string, any>;
}

export const ExistAccountLogin: React.FC<ExistAccountLoginProps> = ({
  onSuccess,
  onForgetPwdClick,
  trackingConfig,
}) => {
  const { t } = useLang();
  const [form] = useForm();
  const [captchaOpen, setCaptchaOpen] = useState(false);

  // zustand 替换 redux
  const loginLoading = useLoginStore(state => state.loginLoading);
  const loginErrorTip = useLoginStore(state => state.loginErrorTip);
  const countryCodes = useLoginStore(state => state.countryCodes);
  const thirdPartyInfo = useLoginStore(state => state.thirdPartyInfo);
  const thirdPartyPlatform = useLoginStore(state => state.thirdPartyPlatform);
  const thirdPartyBindAccountInfo = useLoginStore(state => state.thirdPartyBindAccountInfo);
  const thirdPartyDiversionPrevStepList = useLoginStore(state => state.thirdPartyDiversionPrevStepList);
  const loginV2 = useLoginStore(state => state.loginV2);

  const { multiSiteConfig } = useMultiSiteConfig();
  const accountValue = Form.useWatch('account', form);
  const _pwd = Form.useWatch('password', form);
  const isBtnDisable = !accountValue || !_pwd;

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      // 是否从账户已绑定过来
      const isFromAccountHasBound = thirdPartyDiversionPrevStepList?.length
        ? thirdPartyDiversionPrevStepList[thirdPartyDiversionPrevStepList.length - 1] ===
          THIRD_PARTY_ACCOUNT_DIVERSION_STEP.ACCOUNT_HAS_BOUND
        : false;
      trackClick(
        isFromAccountHasBound
          ? ['loginExistingKCAccount', 'nextButton']
          : ['bindExistingKCAccountInputPassword', 'nextButton']
      );
      const accountType = checkAccountType(values?.account);
      const countryCode = getMobileCode(values?.countryCode);
      const source = getTrackingSource(trackingConfig);
      await loginV2?.({
        trackResultParams: { source },
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
        onSuccess: (data: any) => {
          kcsensorsManualTrack(
            {
              data: {
                accountType: thirdPartyPlatform,
                loginResult: 'success',
                loginType: 'kcAccount',
              },
            },
            'thirdAccountLogin'
          );
          onSuccess?.(data);
        },
        onOpenCaptcha: () => setCaptchaOpen(true),
      });
    } catch (error) {
      // 校验失败等
      // console.error('Error during login:', error);
    }
  };

  const onCaptchaSuccess = () => {
    kcsensorsManualTrack({ data: { accountType: thirdPartyPlatform, robotCheck: 'success' } }, 'thirdAccountLogin');
    setCaptchaOpen(false);
    handleLogin();
  };

  useEffect(() => {
    // 是否从新建账号过来
    const isFromCreateNewAccount = thirdPartyDiversionPrevStepList?.length
      ? thirdPartyDiversionPrevStepList[thirdPartyDiversionPrevStepList.length - 1] ===
        THIRD_PARTY_ACCOUNT_DIVERSION_STEP.CREATE_NEW_ACCOUNT
      : false;
    // 是否从绑定已有账号过来
    const isFromBindExistAccount = thirdPartyDiversionPrevStepList?.length
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
  }, []);

  return (
    <>
      <h2 className={clsx(styles.title)}>{t('9fabaa38d6f74800a6bb')}</h2>
      <p className={clsx(styles.desc)}>{t('002c612d14694000a859')}</p>
      <Form className={clsx(styles.extendForm)} form={form} onFinish={handleLogin}>
        <FusionInputFormItem
          key={thirdPartyInfo?.userInfo}
          form={form}
          countryCodes={countryCodes}
          // 如果有账号，则不允许修改账号，正常逻辑都是有账号的
          disabled={!!(thirdPartyBindAccountInfo?.phone || thirdPartyBindAccountInfo?.email)}
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
          label={t('login_password')}
          name="password"
          rules={[{ required: true, message: t('form_required') }]}
        >
          <Input
            size="xlarge"
            autoComplete="new-password"
            type="password"
            className={clsx(styles.mtSpace)}
            allowClear
            data-inspector="signin_password_input"
          />
        </FormItem>
        <ErrorAlert msg={loginErrorTip} />
        <div className={clsx(styles.forgetPWDBox)}>
          <Box
            display="inline-block"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            data-inspector="signin_forget_password"
            onClick={() => {
              storage.setItem('$entrance.f.mc', thirdPartyBindAccountInfo?.countryCode || '');
              storage.setItem(
                '$entrance.f.a',
                window?.btoa?.(thirdPartyBindAccountInfo?.phone || thirdPartyBindAccountInfo?.email || '') || ''
              );
              kcsensorsManualTrack({ spm: ['forgetPassword', '1'] }, 'page_click');
              onForgetPwdClick?.();
            }}
          >
            {t('forget_pwd')}
          </Box>
        </div>
        <Button
          className={clsx(styles.subButton)}
          fullWidth
          htmlType="submit"
          size="large"
          loading={loginLoading}
          data-inspector="signin_submit_button"
          disabled={loginLoading || isBtnDisable}
          onClick={handleLogin}
        >
          <span>{loginLoading ? t('login_ing') : t('login')}</span>
        </Button>
        <Captcha
          open={captchaOpen}
          onClose={() => setCaptchaOpen(false)}
          bizType="EMAIL_LOGIN"
          onValidateSuccess={onCaptchaSuccess}
          onValidateError={() => {
            kcsensorsManualTrack(
              { data: { accountType: thirdPartyPlatform, robotCheck: 'fail' } },
              'thirdAccountLogin'
            );
          }}
        />
      </Form>
    </>
  );
};

export default ExistAccountLogin;
