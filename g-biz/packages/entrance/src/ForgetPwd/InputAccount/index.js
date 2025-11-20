/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { Alert, styled, useResponsive, Form, Button } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import storage from '@utils/storage';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import { kcsensorsManualTrack } from '@utils/sensors';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import { NAMESPACE } from '../constants';
import { useLang, useToast } from '../../hookTool';
import FusionInputFormItem from '../../components/FusionInputFormItem';
import { checkAccountType } from '../../common/tools';

const { useForm, useWatch } = Form;

const Title = styled.h3`
  font-weight: 700;
  font-size: ${({ inDrawer }) => (inDrawer ? '36px' : '40px')};
  line-height: 130%;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-bottom: 24px;
  }
`;

const AlertWrapper = styled.div`
  margin-top: 40px;
  margin-bottom: 40px;
  .KuxAlert-title {
    color: ${({ theme }) => theme.colors.complementary};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-top: 24px;
    margin-bottom: 40px;
  }
  .KuxAlert-icon {
    margin-top: 0; // 需要 icon 和第一行文字上下局中对齐 H5,PC 都要
  }
`;

function InputAccount({ classes, inDrawer, onSuccess }) {
  const { t } = useLang();
  const rv = useResponsive();
  const toast = useToast();
  const [form] = useForm();
  const _account = useWatch('account', form);
  // 检测输入的是邮箱还是手机号码
  const accountType = useMemo(() => checkAccountType(_account), [_account]);
  const dispatch = useDispatch();

  const countryCodes = useSelector((state) => state[NAMESPACE]?.countryCodes);
  const checkRequireValidationsLoading = useSelector(
    (state) => state.loading.effects[`${NAMESPACE}/checkRequireValidations`],
  );

  const { multiSiteConfig } = useMultiSiteConfig();

  const handleAccountBlur = () => {
    if (accountType === 'email') {
      kcsensorsManualTrack({ spm: ['email', '1'] }, 'page_click');
    } else if (accountType === 'phone') {
      kcsensorsManualTrack({ spm: ['phone', '1'] }, 'page_click');
    }
  };

  const checkRequireValidations = () => {
    kcsensorsManualTrack({ spm: ['confirm', '1'] }, 'page_click');
    form.validateFields().then(({ account, countryCode }) => {
      const accountType = checkAccountType(account);
      const payload = {
        accountType,
        email: accountType === 'email' ? account : '',
        phone: accountType === 'phone' ? account : '',
        countryCode: accountType === 'phone' ? countryCode : '',
        toast,
        checkCaptcha: true,
      };
      if (payload) {
        dispatch({ type: `${NAMESPACE}/checkRequireValidations`, payload, onSuccess });
      }
    });
  };

  useEffect(() => {
    dispatch({ type: `${NAMESPACE}/getCountryCodes` });
  }, []);

  // 登陆组件曝光事件
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['forgetPwd', '1'],
    });
  }, []);

  return (
    <>
      <Title className={classes?.title} inDrawer={inDrawer}>
        {t('jDxAEXC2T4hpidJXV6Guyv')}
      </Title>
      <AlertWrapper>
        <Alert type="warning" showIcon title={tenantConfig.forgetPwd.alertText(t)} />
      </AlertWrapper>
      <Form form={form}>
        <FusionInputFormItem
          form={form}
          countryCodes={countryCodes}
          scene="forgetPwd"
          initValues={{
            countryCode: storage.getItem('$entrance.f.mc') || '',
            account: window?.atob?.(storage.getItem('$entrance.f.a') || '') || '',
          }}
          multiSiteConfig={multiSiteConfig}
          onInputBlur={handleAccountBlur}
        />
        <Button
          // H5 需要上间距为 40px，form 表单项目以及占用了 24+8=32px，所以这里需要补 8px
          mt={rv.sm ? 16 : 8}
          type="primary"
          fullWidth
          size="large"
          onClick={checkRequireValidations}
          loading={checkRequireValidationsLoading}
          disabled={!_account}
          data-inspector="forget_pwd_send_code"
        >
          {t('uSQQJwjV6G9DP8iz4QVdiG')}
        </Button>
      </Form>
    </>
  );
}

export default InputAccount;
