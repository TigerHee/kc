/**
 * Owner: willen@kupotech.com
 */
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, useResponsive } from '@kux/mui';
import { useMultiSiteConfig } from '@hooks/useMultiSiteConfig';
import { getTermId, getTermUrl } from '@tools/term';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import FusionInputFormItem from '../../components/FusionInputFormItem';
import NewInviteCode from '../../components/NewInviteCode';
import ErrorAlert from '../../components/ErrorAlert';
import { Back } from '../../components/Back';
import {
  removeSpaceSE,
  checkAccountType,
  kcsensorsClick,
  kcsensorsManualTrack,
} from '../../common/tools';
import {
  useToast,
  useLang,
  useRegisterPhoneBindEmailABtest,
  useTrackingConfigDataOfInviter,
} from '../../hookTool';
import { NAMESPACE } from '../constants';

import {
  ExtendForm,
  SetAccountTitle,
  SetAccountDesc,
  AlreadyHasCount,
  AgreeFormWrapper,
  AgreeItem,
} from './styled';

const { useForm, FormItem } = Form;

// 如果是测试环境，协议版本号和线上环境不一致
const isInnet =
  window.location.hostname.endsWith('kucoin.net') || window.location.hostname === 'localhost';

// 注册用到的所有协议
const getAllTermList = (_t) => [
  {
    // 使用条款协议
    name: 'agreementTerm',
    // 翻译 key
    i18nKey: 'aa9cabdf20b24000a75c',
    // 表单规则，不设置则不强制勾选协议
    rules: [
      {
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(_t('9a0edb109aff4000ac5d'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    // 隐私条款
    name: 'privacyUserTerm',
    i18nKey: '4a69c358d0194000a24d',
    rules: [
      {
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(_t('d1ce55c725904000ade3'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    // 营销消息发送授权
    name: 'marketingMsgAuthoriseTerm',
    i18nKey: 'c3faaaf878884000a2ee',
    // 协议版本，未配置则使用后端的版本
    // 测试环境使用测试环境的版本号
    version: isInnet ? '20250611175546' : '20250611153846',
  },
  {
    // 个人数据使用授权
    name: 'personalDataAuthoriseTerm',
    i18nKey: '085f95b84b4a4000a116',
    version: isInnet ? '20250611175659' : '20250611154312',
  },
  {
    // 生物数据使用授权协议
    name: 'biologocalDataAuthroiseTerm',
    i18nKey: '59a3d984df194800af33',
    version: isInnet ? '20250611175817' : '20250611154437',
    rules: [
      {
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(_t('a50ef2e5f5f74000a1a9'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    // cookie 规则
    name: 'cookieTerm',
    i18nKey: '3e716b8c0f664000ae83',
    rules: [
      {
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(_t('a50ef2e5f5f74000a1a9'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
];

const SetAccount = (props) => {
  const {
    visibleAgree = true,
    bonusImg,
    initPhoneCode,
    initPhone = '',
    initEmail = '',
    trackingConfig = {},
    onFinish,
    recallType = null,
    forgetLeft,
    // 是否展示 forgetLeft 布局，为了向前的兼容性，默认为 true
    isShowForgetLeft = true,
    fromDrawer,
    // 注册输入账号页面标题
    setAccountTitle = '',
    // 注册输入账号页面描述
    setAccountDesc = '',
    // 三方注册 输入完账号回调
    onThirdPartySetAccount,
    fromThirdPartySimpleSignup,
    fromBindThirdPartyAccount,
    singUpBtnText = null,
    onAccountInput,
    onBack,
  } = props;

  const responsive = useResponsive();
  const isH5 = !responsive.sm;

  const [form] = useForm();
  const { validateFields, setFields } = form;
  const { t } = useLang();
  const dispatch = useDispatch();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;
  const toast = useToast();
  const { data: inviterInfo } = useSelector((state) => state[NAMESPACE].inviter);
  const { prevStepList, countryCodes, registerTip, preRegisterData, userTermList } = useSelector(
    (state) => state[NAMESPACE],
  );
  const { multiSiteConfig } = useMultiSiteConfig();
  const isCaptchaOpen = useSelector((state) => state[NAMESPACE].isCaptchaOpen);
  const sendVerifyCodeLoading = useSelector(
    (s) => s.loading.effects[`${NAMESPACE}/sendVerifyCode`],
  );
  const accountValue = Form.useWatch('account', form);
  // 使用条款 必选协议
  const allValues = Form.useWatch([], form);

  const marketingFlag = tenantConfig.signup.registerFlag?.marketingFlag;

  // 只有站点支持隐藏协议， visibleAgree 才生效，如果站点不支持隐藏协议，存在的协议必须展示
  const showAgreement = tenantConfig.signup.supportHideAgreement ? visibleAgree : true;
  const allTermList = getAllTermList(t);
  // 注册协议是否同意
  const agreementChecked = useMemo(() => {
    if (!accountValue) {
      return false;
    }
    // 如果不需要展示协议, 直接返回 true
    if (!showAgreement) {
      return true;
    }
    // 不能直接使用数组，防止以后改动忘记数组会合并所有配置项，造成问题
    const termConfigList = tenantConfig.signup.termConfigList();
    return allTermList.every((item) => {
      // 当前不需要展示该协议
      if (!termConfigList.includes(item.name)) {
        return true;
      }
      // 不强制勾选
      if (!item.rules) {
        return true;
      }

      return allValues[item.name];
    });
  }, [accountValue, allTermList, allValues, showAgreement]);

  // 检测输入的是邮箱还是手机号码
  const accountType = useMemo(() => checkAccountType(accountValue), [accountValue]);
  const isNewApi = useRegisterPhoneBindEmailABtest();

  const extraTrackingConfigData = useTrackingConfigDataOfInviter();

  // 发送手机验证码
  const handleSendPhoneCode = (params, sendCodeSuccessCb) => {
    const { phone, countryCode } = params || {};
    // 发送成功
    kcsensorsManualTrack(
      { spm: ['phoneSendCode', '1'], data: extraTrackingConfigData },
      'page_click',
    );
    dispatch({
      type: `${NAMESPACE}/sendSMSVerifyCode`,
      payload: {
        fromAccount: true,
        toast,
        countryCode,
        phone: removeSpaceSE(phone),
        validationBiz: isNewApi && !fromBindThirdPartyAccount ? 'REGISTER_SMS' : 'REGISTER',
        sendChannel: 'SMS',
        sendCodeSuccessCb,
      },
    });
    // 注册召回接口调用
    if (recallType !== null) {
      dispatch({
        type: `${NAMESPACE}/postPhoneRecall`,
        payload: {
          countryCode,
          language: navigator.language,
          phone: removeSpaceSE(phone),
          type: recallType,
        },
      });
    }
  };

  // 发送邮箱验证码
  const handleSendEmailCode = (params, sendCodeSuccessCb) => {
    const { email } = params || {};
    kcsensorsManualTrack(
      { spm: ['emailSendCode', '1'], data: extraTrackingConfigData },
      'page_click',
    );
    dispatch({
      type: `${NAMESPACE}/sendEmailVerifyCode`,
      payload: {
        fromAccount: true,
        toast,
        email: removeSpaceSE(email),
        // 三方账号注册一定是发老业务验证码
        validationBiz: 'REGISTER',
        sendCodeSuccessCb,
      },
    });
    // 注册召回接口调用
    if (recallType !== null) {
      dispatch({
        type: `${NAMESPACE}/postEmailRecall`,
        payload: {
          language: navigator.language,
          type: recallType,
          email: removeSpaceSE(email),
        },
      });
    }
  };

  // 获取勾选的协议
  const getUserTermList = (formValues) => {
    const list = [
      // 前面步骤已经勾选的协议
      ...userTermList,
    ];
    allTermList.forEach((item) => {
      // 如果已勾选，则要统一存到 userTermList，提供给注册接口使用
      if (formValues[item.name]) {
        const currItem = {
          termId: getTermId(item.name, multiSiteConfig?.termConfig),
        };
        if (item.version) {
          currItem.version = item.version;
        }
        list.push(currItem);
      }
    });
    return list;
  };

  // 获取勾选的开关
  const getRegisterFlagList = (formValues) => {
    const list = [];
    if (marketingFlag && formValues[marketingFlag.name]) {
      list.push(marketingFlag.id);
    }
    return list;
  };

  // 营销开关多语言配置
  const getMarktingFlagI18nVariables = () => {
    if (!marketingFlag?.termInfo) {
      return {};
    }
    return marketingFlag?.termInfo()?.reduce(
      (variables, item, idx) => {
        // 翻译中的协议链接，可以配置协议 id, 也可以配置协议名称
        if (item.type === 'termId') {
          variables.transValues[`url${idx + 1}`] = getTermUrl(item.value);
        } else if (item.type === 'termCode') {
          variables.transValues[`url${idx + 1}`] = getTermUrl(
            getTermId(item.value, multiSiteConfig?.termConfig),
          );
        }
        variables.transComponents[`a${idx + 1}`] = (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <a
            href={variables.transValues?.[`url${idx + 1}`]}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              handleClickTerm(marketingFlag?.name);
            }}
          />
        );
        return variables;
      },
      { transValues: {}, transComponents: {} },
    );
  };

  // 掉交注册
  const handleSubmit = async () => {
    const createAccountConfirmTrackParam = {
      before_click_element_value: '',
      after_click_element_value: 'create Account and Clain Reward',
    };
    try {
      const { account, ...values } = await validateFields();
      // 添加上报埋点参数
      if (marketingFlag) {
        createAccountConfirmTrackParam.AdvertiseAgreed = !!values.marketingFlag;
      }
      if (!values.countryCode) {
        kcsensorsManualTrack(
          {
            spm: ['createAccount', 'confirm'],
            data: {
              ...createAccountConfirmTrackParam,
              clickStatus: 'noCountryCodeSelected',
            },
          },
          'page_click',
        );
      }

      // 不能直接使用数组，防止以后改动忘记数组会合并所有配置项，造成问题
      const termConfigList = tenantConfig.signup.termConfigList();

      // 土耳其站上报是否勾选前两项非必填协议埋点
      if (
        termConfigList.includes('marketingMsgAuthoriseTerm') ||
        termConfigList.includes('personalDataAuthoriseTerm')
      ) {
        kcsensorsClick(['EnterAccount_NextPage', '1'], {
          AdvertiseAgreed: values.marketingMsgAuthoriseTerm,
          DataStorageAgreed: values.personalDataAuthoriseTerm,
        });
      }
      const _preRegisterData = {
        ...preRegisterData,
        ...values,
        ...(accountType === 'email'
          ? { email: account }
          : accountType === 'phone'
          ? { phone: account }
          : {}),
      };
      dispatch({
        type: `${NAMESPACE}/update`,
        payload: {
          preRegisterData: _preRegisterData,
          registerType: accountType,
        },
      });
      if (fromDrawer) {
        kcsensorsManualTrack({ spm: ['sideRegister', 'signup'] }, 'page_click');
      } else {
        kcsensorsManualTrack({ spm: ['signup', '1'] }, 'page_click');
      }

      // 发送验证码成功后的回调
      const sendCodeSuccessCb = () => {
        dispatch({
          type: `${NAMESPACE}/update`,
          payload: {
            userTermList: getUserTermList(values),
            registerFlagList: getRegisterFlagList(values),
          },
        });
        // 执行完成的回调
        onFinish?.();
      };
      // 发送验证码
      const handleSendCode = () => {
        if (accountType === 'email') {
          kcsensorsManualTrack(
            { spm: ['newEmailConfirm', '1'], data: extraTrackingConfigData },
            'page_click',
          );
          handleSendEmailCode(_preRegisterData, sendCodeSuccessCb);
        } else if (accountType === 'phone') {
          kcsensorsManualTrack(
            { spm: ['newPhoneConfirm', '1'], data: extraTrackingConfigData },
            'page_click',
          );
          handleSendPhoneCode(_preRegisterData, sendCodeSuccessCb);
        }
      };

      kcsensorsManualTrack(
        {
          spm: ['createAccount', 'confirm'],
          data: {
            ...createAccountConfirmTrackParam,
            clickStatus: 'success',
          },
        },
        'page_click',
      );

      // 极简注册，直接注册成功
      if (fromThirdPartySimpleSignup) {
        // 不需要发送验证码，但是需要调用发送验证码成功的回调
        sendCodeSuccessCb();
        return;
      }

      // 如果三方注册 绑定账号时，输入完账号不要离开，根据不同情况可能会执行后续注册操作
      if (onThirdPartySetAccount) {
        onThirdPartySetAccount(
          accountType === 'email'
            ? { email: _preRegisterData.email }
            : { countryCode: _preRegisterData.countryCode, phone: _preRegisterData.phone },
          handleSendCode,
        );
      } else {
        handleSendCode();
      }
    } catch (e) {
      kcsensorsManualTrack({ spm: ['accountConfirmError', '1'] });
      kcsensorsManualTrack(
        {
          spm: ['createAccount', 'confirm'],
          data: {
            ...createAccountConfirmTrackParam,
            clickStatus: 'AccountFormatError',
          },
        },
        'page_click',
      );
      if (accountType === 'email') {
        kcsensorsManualTrack({ spm: ['emailConfirmError', '1'], data: extraTrackingConfigData });
      } else if (accountType === 'phone') {
        kcsensorsManualTrack({ spm: ['phoneConfirmError', '1'], data: extraTrackingConfigData });
      }
    }
  };

  // focus账号输入框
  const handleAccountFocus = () => {
    setFields([{ name: 'account', errors: [] }]);
    if (accountType === 'email') {
      kcsensorsManualTrack({ spm: ['newEmailInsert', '1'] }, 'page_click');
    } else if (accountType === 'phone') {
      kcsensorsManualTrack({ spm: ['newPhoneInsert', '1'] }, 'page_click');
    }
  };

  const handleAccountBlur = () => {
    if (accountType === 'email') {
      kcsensorsManualTrack(
        { spm: ['EmailInsert', '1'], data: extraTrackingConfigData },
        'page_click',
      );
    } else if (accountType === 'phone') {
      kcsensorsManualTrack(
        { spm: ['PhoneInsert', '1'], data: extraTrackingConfigData },
        'page_click',
      );
    }
  };

  const handleInviteCodeBlur = () => {
    kcsensorsManualTrack(
      { spm: ['referralCode', '1'], data: extraTrackingConfigData },
      'page_click',
    );
  };

  // 点击协议埋点
  const handleClickTerm = (policyKey) => () => {
    kcsensorsManualTrack({ spm: [policyKey, '1'], data: extraTrackingConfigData }, 'page_click');
    kcsensorsManualTrack(
      {
        spm: ['createAccount', policyKey === 'agreementTerm' ? 'termsofUse' : 'privacyPolicy'],
        data: {
          before_click_element_value: '',
          after_click_element_value:
            policyKey === 'agreementTerm' ? 'Terms of Use' : 'Privacy Policy',
        },
      },
      'page_click',
    );
  };

  // 获取国家区号列表
  useEffect(() => {
    if (!countryCodes?.length) {
      dispatchRef.current({ type: `${NAMESPACE}/getCountryCodes` });
    }
  }, [countryCodes?.length]);

  // 注册组件曝光事件
  useEffect(() => {
    // 新增埋点上报
    kcsensorsManualTrack({
      spm: ['EnterAccount', '1'],
      ...((trackingConfig && trackingConfig.data) || {}),
    });
    kcsensorsManualTrack({
      spm: ['signupAccountInput', '1'],
      ...((trackingConfig && trackingConfig.data) || {}),
    });
    kcsensorsManualTrack({
      spm: [accountType === 'phone' ? 'SMSSecurityVerify' : 'emailSecurityVerify', '1'],
      data: {
        is_login: false,
        pre_spm_id: 'kcWeb.B1register.createAccount.confirm',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* 有历史记录 或者 三方极简注册 或者 三方绑定 */}
      {(prevStepList.length || fromBindThirdPartyAccount || fromThirdPartySimpleSignup) && (
        <Back onBack={onBack} />
      )}
      {/* h5 如果有邀请者信息，则不展示默认标题 */}
      {isH5 && inviterInfo ? (
        // 如果设置了标题，则展示标题
        setAccountTitle ? (
          <SetAccountTitle fromDrawer={fromDrawer}>{setAccountTitle}</SetAccountTitle>
        ) : null
      ) : (
        // 其他情况，则都展示标题
        <SetAccountTitle fromDrawer={fromDrawer}>
          {setAccountTitle ||
            (inviterInfo ? t('2e2b938c53714000a8fd') : t('wUEBcjqHdgcAzj9HpTfQJh'))}
        </SetAccountTitle>
      )}
      {setAccountDesc ? (
        <SetAccountDesc fromDrawer={fromDrawer}>{setAccountDesc}</SetAccountDesc>
      ) : null}
      <ExtendForm size="large" form={form}>
        <FusionInputFormItem
          form={form}
          countryCodes={countryCodes}
          initValues={{
            // 回退到输入账号页面的时候，希望用户能看到输入的账号
            countryCode: preRegisterData.countryCode || initPhoneCode,
            account: preRegisterData.email || preRegisterData.phone || initEmail || initPhone,
          }}
          // 三方登录带入的新账号不允许修改
          disabled={
            (fromBindThirdPartyAccount || fromThirdPartySimpleSignup) && (initEmail || initPhone)
          }
          onInputFocus={handleAccountFocus}
          onAccountInput={onAccountInput}
          onInputBlur={handleAccountBlur}
          multiSiteConfig={multiSiteConfig}
          shouldBlurValidate={false}
        />
        {multiSiteConfig?.accountConfig?.supportRCode && (
          <FormItem label={t('referral.msg')} name="referralCode" initialValue="">
            <NewInviteCode
              className="mtSpace"
              defaultExpand={false}
              onBlur={handleInviteCodeBlur}
            />
          </FormItem>
        )}
        <ErrorAlert msg={registerTip} />
        {showAgreement ? (
          <AgreeFormWrapper data-inspector="signup-agree-wrapper">
            {allTermList.map((item) => {
              if (!tenantConfig.signup.termConfigList().includes(item.name)) {
                return null;
              }
              const { name, i18nKey, rules } = item;
              return (
                <AgreeItem
                  key={name}
                  name={name}
                  initialValue={tenantConfig.signup.termInitialChecked}
                  termCode={name}
                  i18nKey={i18nKey}
                  rules={rules}
                  multiSiteConfig={multiSiteConfig}
                  onClick={handleClickTerm(name)}
                />
              );
            })}
            {/* 注册营销消息发送授权, 后端不希望和协议有一致的流程，只是当作注册流程的一个控制开关 */}
            {marketingFlag && (
              <AgreeItem
                key={marketingFlag.name}
                name={marketingFlag.name}
                i18nKey={marketingFlag.i18nKey}
                {...getMarktingFlagI18nVariables()}
                // 修改为默认勾选
                initialValue={marketingFlag.termInitialChecked}
                termCode={marketingFlag.termCode}
                multiSiteConfig={multiSiteConfig}
                onClick={handleClickTerm(marketingFlag.name)}
              />
            )}
          </AgreeFormWrapper>
        ) : null}

        <Button
          fullWidth
          size="large"
          loading={!!sendVerifyCodeLoading || isCaptchaOpen}
          disabled={
            !!sendVerifyCodeLoading ||
            isCaptchaOpen ||
            // 如果没有同意协议，则按钮置灰
            !agreementChecked
          }
          onClick={handleSubmit}
          data-inspector="signup_confirm_btn"
        >
          <span>{singUpBtnText || t('8BokFUmPawn1eYyz9gja63')}</span>
          {bonusImg || null}
        </Button>
        {isShowForgetLeft && forgetLeft ? <AlreadyHasCount>{forgetLeft}</AlreadyHasCount> : null}
      </ExtendForm>
    </>
  );
};

export default SetAccount;
