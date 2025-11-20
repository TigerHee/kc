/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect, useMemo, useState } from 'react';
import { Button, Form } from '@kux/mui';
import useIsMobile from '../../hooks/useIsMobile';
import clsx from 'clsx';
import { getHostname } from 'kc-next/boot';
import { useMultiSiteConfig } from 'hooks/useMultiSiteConfig';
import { getTermId, getTermUrl } from 'tools/term';
import { getTenantConfig } from '../../config/tenant';
import FusionInputFormItem from '../../components/FusionInputFormItem';
import NewInviteCode from '../../components/NewInviteCode';
import { AgreeItem } from '../../components/AgreeItem';
import { ErrorAlert } from '../../components/ErrorAlert';
import { Back } from '../../components/Back';
import { TermTipModal } from '../../components/TermTipModal';
import { removeSpaceSE, checkAccountType } from '../../common/tools';
import { kcsensorsManualTrack } from 'tools/sensors';
import { trackClick } from 'tools/sensors';
import { useToast, useLang, useRegisterPhoneBindEmailABtest, useTrackingConfigDataOfInviter } from '../../hookTool';
import { useSignupStore } from '../model';
import commonStyles from '../index.module.scss';
import styles from './index.module.scss';

const { useForm, FormItem } = Form;

const SetAccount = props => {
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

  const isH5 = useIsMobile();

  const [form] = useForm();
  const { validateFields, setFields, getFieldError, setFieldsValue, getFieldsValue } = form;
  const { t } = useLang();
  const toast = useToast();

  // 使用 Zustand store
  const inviterInfo = useSignupStore(state => state.inviter.data);
  const prevStepList = useSignupStore(state => state.prevStepList);
  const countryCodes = useSignupStore(state => state.countryCodes);
  const registerTip = useSignupStore(state => state.registerTip);
  const preRegisterData = useSignupStore(state => state.preRegisterData);
  const userTermList = useSignupStore(state => state.userTermList);
  const isCaptchaOpen = useSignupStore(state => state.isCaptchaOpen);
  const loading = useSignupStore(state => state.loading);

  // Store actions
  const sendSMSVerifyCode = useSignupStore(state => state.sendSMSVerifyCode);
  const sendEmailVerifyCode = useSignupStore(state => state.sendEmailVerifyCode);
  const postPhoneRecall = useSignupStore(state => state.postPhoneRecall);
  const postEmailRecall = useSignupStore(state => state.postEmailRecall);
  const updateStore = useSignupStore(state => state.update);
  const getCountryCodes = useSignupStore(state => state.getCountryCodes);

  const { multiSiteConfig } = useMultiSiteConfig();
  const accountValue = Form.useWatch('account', form);
  // 使用条款 必选协议
  const allValues = Form.useWatch([], form);
  const [termTipModal, setTermTipModal] = useState(false);

  const tenantConfig = getTenantConfig();
  const marketingFlag = getTenantConfig().signup.registerFlag?.marketingFlag;

  // 点击协议埋点
  const handleClickTerm = policyKey => () => {
    kcsensorsManualTrack({ spm: [policyKey, '1'], data: extraTrackingConfigData }, 'page_click');
    kcsensorsManualTrack(
      {
        spm: ['createAccount', policyKey === 'agreementTerm' ? 'termsofUse' : 'privacyPolicy'],
        data: {
          before_click_element_value: '',
          after_click_element_value: policyKey === 'agreementTerm' ? 'Terms of Use' : 'Privacy Policy',
        },
      },
      'page_click'
    );
  };

  // 只有站点支持隐藏协议， visibleAgree 才生效，如果站点不支持隐藏协议，存在的协议必须展示
  const showAgreement = tenantConfig.signup.supportHideAgreement ? visibleAgree : true;
  // 注册用到的所有协议
  const allTermList = useMemo(() => {
    {
      const hostname = getHostname();
      // 如果是测试环境，协议版本号和线上环境不一致
      const isInnet = hostname.endsWith('kucoin.net') || hostname === 'localhost';
      return [
        {
          // 用户协议和隐私条款合二为一
          name: 'agreementTermAndPrivacyNotice',
          innerName: ['agreementTerm', 'privacyUserTerm'],
          // 翻译 key
          i18nKey: '2810dd8a31414800ad3e',
          transValues: {
            url1: `${getTermUrl(getTermId('agreementTerm', multiSiteConfig?.termConfig))}`,
            url2: `${getTermUrl(getTermId('privacyUserTerm', multiSiteConfig?.termConfig))}`,
          },
          transComponents: {
            a1: (
              <a
                href={`${getTermUrl(getTermId('agreementTerm', multiSiteConfig?.termConfig))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleClickTerm('agreementTerm');
                }}
                aria-label={'Link agreementTerm'}
              />
            ),
            a2: (
              <a
                href={`${getTermUrl(getTermId('privacyUserTerm', multiSiteConfig?.termConfig))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleClickTerm('privacyUserTerm');
                }}
                aria-label={'Link privacyUserTerm'}
              />
            ),
          },
          // 表单规则，不设置则不强制勾选协议
          rules: [
            {
              validator: (rule, value) => {
                // 如果没有输入账号，则不高亮协议部分
                if (!accountValue || getFieldError('account')?.length > 0) {
                  return Promise.resolve();
                }
                if (!value) {
                  return Promise.reject(t('094cedac0d694000a2c4'));
                }
                return Promise.resolve();
              },
            },
          ],
        },
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
                  return Promise.reject(t('9a0edb109aff4000ac5d'));
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
                  return Promise.reject(t('d1ce55c725904000ade3'));
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
                  return Promise.reject(t('a50ef2e5f5f74000a1a9'));
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
                  return Promise.reject(t('a50ef2e5f5f74000a1a9'));
                }
                return Promise.resolve();
              },
            },
          ],
        },
      ];
    }
  }, [accountValue, multiSiteConfig]);

  const checkTerm = () => {
    // 不能直接使用数组，防止以后改动忘记数组会合并所有配置项，造成问题
    const termConfigList = tenantConfig.signup.termConfigList();
    return allTermList.every(item => {
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
  };

  // 注册协议是否同意
  const signupBtnNotDisabled = useMemo(() => {
    // 如果注册按钮默认不置灰
    if (!tenantConfig.signup.signupDefaultDisabled) {
      return true;
    }
    if (!accountValue) {
      return false;
    }
    // 如果不需要展示协议, 直接返回 true
    if (!showAgreement) {
      return true;
    }

    return checkTerm();
  }, [accountValue, allTermList, allValues, showAgreement]);

  // 检测输入的是邮箱还是手机号码
  const accountType = useMemo(() => checkAccountType(accountValue), [accountValue]);
  const isNewApi = useRegisterPhoneBindEmailABtest();

  const extraTrackingConfigData = useTrackingConfigDataOfInviter();

  // 发送手机验证码
  const handleSendPhoneCode = (params, sendCodeSuccessCb) => {
    const { phone, countryCode } = params || {};
    // 发送成功
    kcsensorsManualTrack({ spm: ['phoneSendCode', '1'], data: extraTrackingConfigData }, 'page_click');
    sendSMSVerifyCode?.({
      t,
      fromAccount: true,
      toast,
      countryCode,
      phone: removeSpaceSE(phone),
      validationBiz: isNewApi && !fromBindThirdPartyAccount ? 'REGISTER_SMS' : 'REGISTER',
      sendChannel: 'SMS',
      sendCodeSuccessCb,
    });
    // 注册召回接口调用
    if (recallType !== null) {
      postPhoneRecall?.({
        countryCode,
        language: navigator.language,
        phone: removeSpaceSE(phone),
        type: recallType,
      });
    }
  };

  // 发送邮箱验证码
  const handleSendEmailCode = (params, sendCodeSuccessCb) => {
    const { email } = params || {};
    kcsensorsManualTrack({ spm: ['emailSendCode', '1'], data: extraTrackingConfigData }, 'page_click');
    sendEmailVerifyCode?.({
      t,
      fromAccount: true,
      toast,
      email: removeSpaceSE(email),
      // 三方账号注册一定是发老业务验证码
      validationBiz: 'REGISTER',
      sendCodeSuccessCb,
    });
    // 注册召回接口调用
    if (recallType !== null) {
      postEmailRecall?.({
        language: navigator.language,
        type: recallType,
        email: removeSpaceSE(email),
      });
    }
  };

  // 获取勾选的协议
  const getUserTermList = formValues => {
    const list = [
      // 前面步骤已经勾选的协议
      ...(userTermList || []),
    ];
    allTermList.forEach(item => {
      // 如果已勾选，则要统一存到 userTermList，提供给注册接口使用
      if (formValues[item.name]) {
        // 针对多条协议合并成一条展示的 case
        if (item.innerName) {
          item.innerName.forEach(name => {
            const currItem: any = {
              termId: getTermId(name, multiSiteConfig?.termConfig),
            };
            list.push(currItem);
          });
        } else {
          const currItem: any = {
            termId: getTermId(item.name, multiSiteConfig?.termConfig),
          };
          if (item.version) {
            currItem.version = item.version;
          }
          list.push(currItem);
        }
      }
    });
    return list;
  };

  // 获取勾选的开关
  const getRegisterFlagList = formValues => {
    const list: string[] = [];
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
        const key = typeof item.key !== 'undefined' ? item.key : idx + 1;
        // 翻译中的协议链接，可以配置协议 id, 也可以配置协议名称
        if (item.type === 'termId') {
          variables.transValues[`url${key}`] = getTermUrl(item.value);
        } else if (item.type === 'termCode') {
          variables.transValues[`url${key}`] = getTermUrl(getTermId(item.value, multiSiteConfig?.termConfig));
        }
        variables.transComponents[`a${key}`] = (
          <a
            href={variables.transValues?.[`url${key}`]}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              handleClickTerm(marketingFlag?.name);
            }}
            aria-label={`Link ${key}`}
          />
        );
        return variables;
      },
      { transValues: {}, transComponents: {} }
    );
  };

  const setAllTermCheck = () => {
    const termConfigList = tenantConfig.signup.termConfigList();
    const termValues = allTermList.reduce((values, item) => {
      // 当前需要展示该协议
      if (termConfigList.includes(item.name)) {
        values.push({
          name: item.name,
          errors: [],
          value: true,
        });
      }

      return values;
    }, [] as Array<{ name: string; errors: string[]; value: boolean }>);

    if (marketingFlag && marketingFlag.name) {
      termValues.push({
        name: marketingFlag.name,
        errors: [],
        value: true,
      });
    }

    setFields(termValues);
  };

  // 掉交注册
  const handleSubmit = async () => {
    const createAccountConfirmTrackParam = {
      before_click_element_value: '',
      after_click_element_value: 'create Account and Clain Reward',
    };
    try {
      const values = await validateFields();
      // 添加上报埋点参数
      if (marketingFlag) {
        (createAccountConfirmTrackParam as any).AdvertiseAgreed = !!values.marketingFlag;
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
          'page_click'
        );
      }

      // 不能直接使用数组，防止以后改动忘记数组会合并所有配置项，造成问题
      const termConfigList = tenantConfig.signup.termConfigList();

      // 土耳其站上报是否勾选前两项非必填协议埋点
      if (
        termConfigList.includes('marketingMsgAuthoriseTerm') ||
        termConfigList.includes('personalDataAuthoriseTerm')
      ) {
        trackClick(['EnterAccount_NextPage', '1'], {
          AdvertiseAgreed: values.marketingMsgAuthoriseTerm,
          DataStorageAgreed: values.personalDataAuthoriseTerm,
        });
      }
      const _preRegisterData = {
        ...preRegisterData,
        ...values,
        ...(accountType === 'email'
          ? { email: values.account }
          : accountType === 'phone'
          ? { phone: values.account }
          : {}),
      };
      updateStore?.({
        preRegisterData: _preRegisterData,
        registerType: accountType,
      });
      if (fromDrawer) {
        kcsensorsManualTrack({ spm: ['sideRegister', 'signup'] }, 'page_click');
      } else {
        kcsensorsManualTrack({ spm: ['signup', '1'] }, 'page_click');
      }

      // 发送验证码成功后的回调
      const sendCodeSuccessCb = () => {
        updateStore?.({
          userTermList: getUserTermList(values),
          registerFlagList: getRegisterFlagList(values),
        });
        // 执行完成的回调
        onFinish?.();
      };
      // 发送验证码
      const handleSendCode = () => {
        if (accountType === 'email') {
          kcsensorsManualTrack({ spm: ['newEmailConfirm', '1'], data: extraTrackingConfigData }, 'page_click');
          handleSendEmailCode(_preRegisterData, sendCodeSuccessCb);
        } else if (accountType === 'phone') {
          kcsensorsManualTrack({ spm: ['newPhoneConfirm', '1'], data: extraTrackingConfigData }, 'page_click');
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
        'page_click'
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
          handleSendCode
        );
      } else {
        handleSendCode();
      }
    } catch (e) {
      // 输入账号，协议未选中才展示协议签署提示弹窗
      if (getFieldError('account')?.length <= 0 && !checkTerm()) {
          kcsensorsManualTrack({
            spm: ['agreementPopup', '1']
          })
        setTermTipModal(true);
        return;
      }
      kcsensorsManualTrack({ spm: ['accountConfirmError', '1'] });
      kcsensorsManualTrack(
        {
          spm: ['createAccount', 'confirm'],
          data: {
            ...createAccountConfirmTrackParam,
            clickStatus: 'AccountFormatError',
          },
        },
        'page_click'
      );
      if (accountType === 'email') {
        kcsensorsManualTrack({ spm: ['emailConfirmError', '1'], data: extraTrackingConfigData });
      } else if (accountType === 'phone') {
        kcsensorsManualTrack({ spm: ['phoneConfirmError', '1'], data: extraTrackingConfigData });
      }
    }
  };

  const handleTermTipModalClose = () => {
    setTermTipModal(false);
    kcsensorsManualTrack({
      spm: ['agreementPopup', 'close']
    }, 'page_click')
  };

  const handleTermTipModalOk = async () => {
    kcsensorsManualTrack({
      spm: ['agreementPopup', 'agreeAndContinue']
    }, 'page_click')
    setAllTermCheck();
    setTermTipModal(false);
    await handleSubmit();
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
      kcsensorsManualTrack({ spm: ['EmailInsert', '1'], data: extraTrackingConfigData }, 'page_click');
    } else if (accountType === 'phone') {
      kcsensorsManualTrack({ spm: ['PhoneInsert', '1'], data: extraTrackingConfigData }, 'page_click');
    }
  };

  const handleInviteCodeBlur = () => {
    kcsensorsManualTrack({ spm: ['referralCode', '1'], data: extraTrackingConfigData }, 'page_click');
  };

  // 获取国家区号列表
  useEffect(() => {
    if (!countryCodes?.length) {
      getCountryCodes?.();
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
  }, []);

  return (
    <>
      {/* 有历史记录 或者 三方极简注册 或者 三方绑定 */}
      {(prevStepList?.length || fromBindThirdPartyAccount || fromThirdPartySimpleSignup) && <Back onBack={onBack} />}
      {/* h5 如果有邀请者信息，则不展示默认标题 */}
      {isH5 && inviterInfo ? (
        // 如果设置了标题，则展示标题
        setAccountTitle ? (
          <h2 className={clsx(commonStyles.setAccountTitle, fromDrawer && commonStyles.fromDrawer)}>
            {setAccountTitle}
          </h2>
        ) : null
      ) : (
        // 其他情况，则都展示标题
        <h2 className={clsx(commonStyles.setAccountTitle, fromDrawer && commonStyles.fromDrawer)}>
          {setAccountTitle || (inviterInfo ? t('2e2b938c53714000a8fd') : t('wUEBcjqHdgcAzj9HpTfQJh'))}
        </h2>
      )}
      {setAccountDesc ? (
        <p className={clsx(styles.setAccountDesc, fromDrawer && styles.fromDrawer)}>{setAccountDesc}</p>
      ) : null}
      {/* @ts-ignore */}
      <Form size="large" form={form} className={styles.extendForm}>
        <FusionInputFormItem
          form={form}
          countryCodes={countryCodes}
          initValues={{
            // 回退到输入账号页面的时候，希望用户能看到输入的账号
            countryCode: preRegisterData?.countryCode || initPhoneCode,
            account: preRegisterData?.email || preRegisterData?.phone || initEmail || initPhone || '',
          }}
          // 三方登录带入的新账号不允许修改
          disabled={(fromBindThirdPartyAccount || fromThirdPartySimpleSignup) && (initEmail || initPhone)}
          onInputFocus={handleAccountFocus}
          onAccountInput={onAccountInput}
          onInputBlur={handleAccountBlur}
          multiSiteConfig={multiSiteConfig}
          scene="signup"
        />
        {multiSiteConfig?.accountConfig?.supportRCode && (
          // @ts-ignore
          <FormItem label={t('referral_msg')} name="referralCode" initialValue="">
            <NewInviteCode className={styles.referral} defaultExpand={false} onBlur={handleInviteCodeBlur} />
          </FormItem>
        )}
        <ErrorAlert msg={registerTip} />
        {showAgreement ? (
          <div className={styles.agreeFormWrapper} data-inspector="signup-agree-wrapper">
            {allTermList.map(item => {
              if (!getTenantConfig().signup.termConfigList().includes(item.name)) {
                return null;
              }
              const { name, i18nKey, rules, transValues, transComponents } = item;

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
                  transValues={transValues}
                  transComponents={transComponents}
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
                termCode={marketingFlag.name}
                multiSiteConfig={multiSiteConfig}
                onClick={handleClickTerm(marketingFlag.name)}
              />
            )}
          </div>
        ) : null}
        {/* @ts-ignore */}
        <Button
          fullWidth
          size="large"
          loading={loading || isCaptchaOpen}
          disabled={
            loading ||
            isCaptchaOpen ||
            // 如果没有同意协议，则按钮置灰
            !signupBtnNotDisabled
          }
          onClick={handleSubmit}
          data-inspector="signup_confirm_btn"
        >
          <span>{singUpBtnText || t('8BokFUmPawn1eYyz9gja63')}</span>
          {bonusImg || null}
        </Button>
        {isShowForgetLeft && forgetLeft ? <div className={commonStyles.alreadyHasCount}>{forgetLeft}</div> : null}
      </Form>
      <TermTipModal
        multiSiteConfig={multiSiteConfig}
        isOpen={termTipModal}
        onClose={handleTermTipModalClose}
        onOk={handleTermTipModalOk}
      />
    </>
  );
};

export default SetAccount;
