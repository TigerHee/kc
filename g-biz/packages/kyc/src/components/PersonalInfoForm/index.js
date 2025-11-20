/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Select, ThemeProvider, Tooltip, useResponsive } from '@kux/mui';
import { ClassNames } from '@emotion/react';
import { delay, forEach, map, omit } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { kcsensorsManualTrack } from '@utils/sensors';
import { tenantConfig } from '@packages/kyc/src/config/tenant';
import { kycSeniorSubmit, filterParams } from '../../common/components/CommonFunctions';
import RootEmotionCacheProvider from '../../common/components/RootEmotionCacheProvider';
import {
  SOURCE,
  NEED_IDCARD,
  FAIL_REASON,
  ERROR_FIELD_MAP,
  FIELD_ERROR_MAP,
  KYC_TYPE,
  StepsListMap,
} from '../../common/constants';
import { namespace, initState } from './model';
import CountrySelect from './components/CountrySelect';
import IDType from './components/IDType';
import Privacy from './components/Privacy';
import ClearDialog from './components/ClearDialog';
import { checkRegExp, checkValues, isIOS } from './config';
import { getKycState } from './service';
import useLang from '../../hookTool/useLang';
import InfoFormTR from './components/InfoForm_TR';
import {
  Wrapper,
  NameWrapper,
  Name,
  FormWrapper,
  FormTitle,
  FormTitle2,
  FormItemWrapper,
  BtnWrapper,
  StateLabel,
  StateLabelText,
  Restricted,
} from './style';

const { FormItem, useForm } = Form;

const PersonalKyc1Form = (props = {}) => {
  const { _t, i18n } = useLang();
  const { language: currentLang } = i18n || {}; // 当前语言
  const {
    checkError = '',
    kycInfo = {},
    countries = [],
    failureReason,
    recommendIdType,
    kycClearInfo,
    specialTypeList,
  } = useSelector((state) => state[namespace] || {});
  const {
    onError,
    onSuccessCallback,
    identity2VerifyFailedCallback,
    setStepList = () => {},
  } = props;

  const editKyc = kycInfo.primaryVerifyStatus === 1;
  const [form] = useForm();
  const { getFieldsError } = form;
  const dispatch = useDispatch();
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const isios = isIOS();
  const isCN = currentLang === 'zh_CN';
  const defaultRegionCode = kycInfo.regionCode === 'CN' ? kycInfo.regionCode : '';
  const isUndefinedRegionCode = undefined !== defaultRegionCode;
  const defaultNeedIdCard = isUndefinedRegionCode ? NEED_IDCARD.includes(defaultRegionCode) : isCN;
  const [needIdCard, setNeedIdCard] = useState(false);
  const [needVerifyIdCardLength, setNeedVerifyIdCardLength] = useState(true); // 是否校验身份证长度
  const [disabled, setDisabled] = useState(false);
  const [formParams, setFormParams] = useState({});
  const [step, setStep] = useState(2); // kyc1步骤
  const [isManualChangeCountry, setManualChangeCountry] = useState(false); // 是否手动切换了国家
  const [isClearDialogOpen, setClearDialogOpen] = useState(false); // 打回提示弹窗是否显示
  const [stateConfig, setStateConfig] = useState({});
  const [isStateLoading, setStateLoading] = useState(false);
  const [curStepAllValue, setCurStepAllValue] = useState({});
  const [curStepFormErr, setCurStepFormErr] = useState([]);
  const [regionCode, setRegionCode] = useState('');
  const [isBack, setIsBack] = useState(false);

  const loading = useSelector(
    (state) =>
      state.loading.effects[`${namespace}/primaryUpdate`] ||
      state.loading.effects[`${namespace}/primarySubmit`],
  );
  const identityTypesLoading = useSelector(
    (state) => state.loading.effects[`${namespace}/getIdentityTypes`],
  );
  const isPullKycInfoLoading = useSelector(
    (state) => state.loading.effects[`${namespace}/pullKycInfo`],
  );

  useEffect(() => {
    setCurStepAllValue(form.getFieldsValue());
  }, [step]);

  // 清空数据
  const resetHandler = () => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        ...initState,
      },
    });
  };

  // 初始化拉取kyc信息
  useEffect(() => {
    dispatch({ type: `${namespace}/pullKycInfo`, payload: { type: KYC_TYPE.PERSONAL } });

    return () => {
      resetHandler();
    };
  }, []);

  const checkIdentityNumberValues = (value, cb) => {
    return new Promise((resolve, reject) => {
      delay(() => {
        if (!value && kycInfo.identityNumber) {
          resolve();
          return;
        }
        // 验证输入的字符长度
        if (needVerifyIdCardLength) {
          if (!value || value.trim() === '') {
            typeof cb === 'function' && cb();
            reject(new Error(_t('kyc.account.sec.certificate.holder')));
            return;
          }
          if (needIdCard && value.length !== 18) {
            typeof cb === 'function' && cb();
            reject(new Error(_t('kyc.verify.idcard.len')));
            return;
          }
        }
        if (!value || value.trim() === '') {
          typeof cb === 'function' && cb();
          reject(new Error(_t('kyc.account.sec.certificate.holder')));
          return;
        }
        resolve();
      }, 300);
    });
  };

  // 错误原因处理
  const errorKeys = Object.keys(failureReason);
  const errors = {};
  forEach(errorKeys, (key) => {
    const { code } = failureReason[key];
    if (code === 'otherError') {
      errors[ERROR_FIELD_MAP[key]] = failureReason[key].val;
    } else if (FAIL_REASON[code]) {
      const reason = FAIL_REASON[code].key;
      if (reason) {
        errors[ERROR_FIELD_MAP[key]] = _t(reason);
      } else {
        errors[ERROR_FIELD_MAP[key]] = FAIL_REASON[code].en_US || failureReason[key].valEn;
      }
    }
  });

  useEffect(() => {
    setNeedIdCard(defaultNeedIdCard);
  }, [defaultNeedIdCard]);

  useEffect(() => {
    // 录入kyc1界面，支持中英文
    dispatch({ type: `${namespace}/kycGetCountries` });
  }, [isCN]);

  // 埋点
  const handleGA = useCallback((type, index, data = {}, otherParams = {}, actionType = 'click') => {
    const _data = { ...{ KYCInfoEditType: '2page_need_next' }, ...data };
    try {
      if (actionType === 'click') {
        kcsensorsManualTrack({ spm: [type, index], _data, ...otherParams }, 'page_click');
      } else if (actionType === 'expose') {
        kcsensorsManualTrack({ spm: [type, index], _data }, 'expose');
      } else {
        kcsensorsManualTrack({ spm: [type, index], _data }, actionType);
      }
    } catch (error) {
      console.log('err', error);
    }
  }, []);

  useEffect(() => {
    // kyc1通过再回填信息
    if (kycInfo.primaryVerifyStatus === 1) {
      const params = {};
      const info = kycInfo;
      params.identityType = info.identityType;
      form.setFieldsValue(params);
      // 初始化时，kycInfo有值，则不需要校验长度
      setNeedVerifyIdCardLength(info.identityNumber === undefined || info.identityNumber === null);
      errors.identityNumber && form.validateFields(['identityNumber']);
    }
  }, [kycInfo]);

  useEffect(() => {
    if (kycInfo.primaryVerifyStatus === 1) {
      formParams?.identityType &&
        setDisabled(formParams?.identityType && formParams?.identityType !== kycInfo?.identityType);
    }
  }, [kycInfo, countries, isBack, formParams]);

  useEffect(() => {
    if (countries?.length > 0 && !isPullKycInfoLoading) {
      if (kycInfo?.regionCode && kycInfo?.identityType) {
        const regionItem = countries.find((item) => item.code === kycInfo?.regionCode) || {};

        if (
          regionItem?.regionType &&
          ![1, 2].includes(regionItem?.regionType) &&
          !form.getFieldValue('regionCode')
        ) {
          form.setFieldsValue({
            regionCode: regionItem.code,
          });
          setRegionCode(regionItem.code);

          dispatch({
            type: `${namespace}/getIdentityTypes`,
            payload: {
              region: regionItem.code,
            },
          });
        }
      } else {
        const ipCountryList = countries.filter((i) => i.isIpRegion);
        const ipCountryItem = ipCountryList[0];

        if (ipCountryItem && ipCountryItem?.regionType === 3) {
          const { code } = ipCountryItem;
          if (!form.getFieldValue('regionCode')) {
            form.setFieldsValue({
              regionCode: code,
            });
            setRegionCode(code);
            dispatch({
              type: `${namespace}/getIdentityTypes`,
              payload: {
                region: code,
              },
            });
          }

          if (recommendIdType && !form.getFieldValue('identityType')) {
            form.setFieldsValue({
              identityType: recommendIdType,
            });
          }
        }
      }
      setCurStepAllValue(form.getFieldsValue());
    }
  }, [countries, kycInfo, recommendIdType, isPullKycInfoLoading]);

  useEffect(() => {
    // 手动切换国家默认选中推荐证件
    if (isManualChangeCountry && recommendIdType) {
      form.setFieldsValue({
        identityType: recommendIdType,
      });
      setCurStepAllValue(form.getFieldsValue());
    }
  }, [isManualChangeCountry, recommendIdType, regionCode]);

  const changeRegion = (param) => {
    if (NEED_IDCARD.includes(param)) {
      setNeedIdCard(true);
      setNeedVerifyIdCardLength(true);
    } else {
      setNeedIdCard(false);
      setNeedVerifyIdCardLength(false);
    }
  };

  // 获取需要验证的field
  const getValidateFieldsArr = () => {
    const allValues = form.getFieldsValue();
    const validateFieldsArr = [];

    const keys = Object.keys(allValues);

    forEach(keys, (key) => {
      if (editKyc) {
        /**
         * 编辑状态，不验证没有修改的值
         * kycInfo 没有值也要校验
         */
        if (allValues[key] !== kycInfo[key] || (!allValues[key] && !kycInfo[key])) {
          validateFieldsArr.push(key);
        }
      } else {
        validateFieldsArr.push(key);
      }
    });
    return validateFieldsArr;
  };

  // 按钮disabled状态
  const setButtonDisabled = (flag) => {
    if (flag) {
      setDisabled(flag);
      return;
    }

    // 去掉单独维护disable的字段
    const delList = [
      'userState',
      'fatherName',
      'motherName',
      'occupation',
      'province',
      'district',
      'neighborhood',
      'street',
      'buildingNo',
      'other',
      'birthDate',
    ];

    const allv = omit(form.getFieldsValue(), delList);

    const valuesArr = Object.values(allv);

    const arr = valuesArr.filter((item) => !item);

    setDisabled(
      editKyc
        ? !kycInfo?.firstName || !kycInfo?.lastName || !kycInfo?.identityNumber
          ? arr.length !== 0
          : false
        : arr.length !== 0,
    );
  };

  // kyc1点击下一步
  const handleContinue = () => {
    const validateFieldsArr = getValidateFieldsArr();

    form
      .validateFields(validateFieldsArr)
      .then(async (values) => {
        const newVal = form.getFieldsValue();
        handleGA('InfoEdit1Next', '1', {
          KYC1_edit_type: editKyc ? 'modify' : 'new',
        });
        if (specialTypeList.find((i) => i.type === newVal.identityType)) {
          handleSubmit(true);
          return;
        }

        setStep(2);
        setIsBack(false);
        // 证件类型变更，按钮禁用，证件号码清空重新输入
        setButtonDisabled(false, 2);
        setFormParams(values);

        // 处理认证弹窗步骤数据
        const type = 'normal';
        const stepList = (StepsListMap[type] || []).map((item) => {
          return { title: _t(item.title) };
        });
        setStepList(stepList);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  };

  // 重新分解字段的响应事件
  const onValuesChange = (fieldValues) => {
    setCurStepAllValue(form.getFieldsValue());

    const keys = Object.keys(fieldValues);
    const values = Object.values(fieldValues);
    const field = keys[0];

    if (!changeField(field, values[0])) {
      const flag =
        field === 'identityNumber' &&
        formParams?.identityType &&
        kycInfo?.identityType !== formParams?.identityType;

      flag ? setDisabled(!values[0].length > 0) : setButtonDisabled(false);
    }
  };

  const changeField = (field, value) => {
    if (['regionCode', 'identityType'].includes(field)) {
      handleGA('InfoEdit1', '1');
    } else {
      handleGA('InfoEdit2', '1');
    }

    const filteredReasons = { ...failureReason };
    FIELD_ERROR_MAP[field] &&
      filteredReasons[FIELD_ERROR_MAP[field]] &&
      delete filteredReasons[FIELD_ERROR_MAP[field]];

    if (field === 'regionCode') {
      changeRegion(value);
    }
    if (field === 'identityNumber') {
      changeIdentityNumber(value);
    }
    if (field === 'firstName' || field === 'lastName') {
      const identityNumberVal = form.getFieldValue('identityNumber');
      const identityTypeVal = form.getFieldValue('identityType');

      let flag = false;
      if (editKyc) {
        if (!identityNumberVal && kycInfo?.identityType !== identityTypeVal) {
          flag = true;
        } else {
          flag = value ? checkRegExp.test(value) : false;
        }
      } else {
        flag = value ? checkRegExp.test(value) : true;
      }
      if (field === 'firstName') {
        if (checkRegExp.test(form.getFieldValue('lastName'))) {
          setDisabled(true);
          return true;
        }
      }
      if (field === 'lastName') {
        if (checkRegExp.test(form.getFieldValue('firstName'))) {
          setDisabled(true);
          return true;
        }
      }

      setDisabled(flag);
      return flag;
    }

    dispatch({
      type: `${namespace}/update`,
      payload: { failureReason: filteredReasons, checkError: '' },
    });
  };

  const changeIdentityNumber = (value) => {
    if (!value && kycInfo.identityNumber !== undefined) {
      setNeedVerifyIdCardLength(false); // 如果当前是修改模式，并且没有值，则用默认值
    } else if (value && needIdCard) {
      // 如果有修改值，同时是中国，则需要校验长度
      setNeedVerifyIdCardLength(true);
    }
    dispatch({ type: `${namespace}/update`, payload: { checkError: '' } });
  };

  // 提交表单
  const submitAction = async (values) => {
    const params = {};
    if (editKyc) {
      // 编辑状态过滤掉没有修改的值
      const keys = Object.keys(values);
      forEach(keys, (key) => {
        if (values[key] !== kycInfo[key]) {
          params[key] = values[key];
        }
      });
    }
    const filteredParams = editKyc ? filterParams(params) : values;

    if (Object.keys(filteredParams)?.length === 0 && kycClearInfo?.clearStatus !== 1) {
      // 非待打回，编辑状态，没有修改数据，不调用接口
      typeof onSuccessCallback === 'function' &&
        onSuccessCallback(form.getFieldValue('identityType'), '', true, params?.regionCode);
      return;
    }

    filteredParams.source = SOURCE;

    if (editKyc) {
      filteredParams.clearStatus = kycClearInfo?.clearStatus;
    }
    const serviceAction = editKyc ? `${namespace}/primaryUpdate` : `${namespace}/primarySubmit`;

    const arr = Object.keys(params);
    handleGA('B1KYCInfoEdit2Continue', editKyc ? (arr.length ? '3' : '2') : '1');

    kycSeniorSubmit({
      values: filteredParams,
      dispatch,
      onSuccessCallback: () => {
        typeof onSuccessCallback === 'function' &&
          onSuccessCallback(form.getFieldValue('identityType'), '', false, params.regionCode);
      },
      onError: (error) => {
        typeof onError === 'function' && onError(error);
      },
      service: serviceAction,
      identity2VerifyFailedCallback,
    });
  };

  // 提交kyc1
  const handleSubmit = (isCheckClearStatus) => {
    const validateFieldsArr = getValidateFieldsArr();
    const allValues = form.getFieldsValue();
    const _validateFieldsArr = [];
    let location = '1';

    map(validateFieldsArr, (item) => {
      if (editKyc) {
        location = '2';
        if (allValues[item] || !kycInfo[item]) {
          _validateFieldsArr.push(item);
        }
      } else {
        _validateFieldsArr.push(item);
      }
    });

    if (_validateFieldsArr?.length) {
      location = '3';
    }

    form
      .validateFields(_validateFieldsArr)
      .then((values) => {
        // 打回逻辑
        if (isCheckClearStatus && kycClearInfo?.clearStatus === 1) {
          setClearDialogOpen(true);
          return;
        }

        const postParam = { ...formParams, ...values };
        const {
          fatherName,
          motherName,
          occupation,
          province,
          district,
          neighborhood,
          street,
          buildingNo,
          other,
          birthDate,
          ...baseParams
        } = postParam;

        const fetchParams = baseParams;

        if (tenantConfig.kyc1.isNeedTurkeyExtInfo) {
          fetchParams.turkeyExtInfo = {
            fatherName,
            motherName,
            occupation,
            province,
            district,
            neighborhood,
            street,
            buildingNo,
            other,
            birthDate: +birthDate,
          };
        }

        submitAction(fetchParams);

        handleGA('InfoEdit2Next', location, {
          KYC1_region_type: postParam.regionType,
          KYC1_edit_type: editKyc ? 'modify' : 'new',
        });
      })
      .catch((err) => {
        console.log('err:', err);
      });
  };

  // input输入达到最大值提示
  const [lenTips, setLenTips] = useState({});
  const checkInputLength = (key, length, maxLength) => {
    if (length === maxLength) {
      lenTips[key] = _t('8SzpPoVTJa2NHp9XkKZotU');
    } else {
      lenTips[key] = '';
    }
    setLenTips({ ...lenTips });
  };

  useEffect(() => {
    if (step === 2) {
      handleGA('B1KYCInfoEdit2', '1', {}, {}, 'expose');
    }
  }, [step]);

  const handleFilter = (inputValue, option) => {
    const { value, title } = option;
    const lowcaseInput = (inputValue || '').toLowerCase();
    return [value, title].some((v) => {
      return (v || '').toLowerCase().indexOf(lowcaseInput) > -1;
    });
  };

  const handleScroll = () => {
    document.getElementById('formWrapper').scrollTo({
      top: 204,
      behavior: 'smooth',
    });
  };

  // 获取州省数据
  const onGetStateData = async () => {
    setStateLoading(true);
    try {
      const allValues = form.getFieldsValue() || {};
      const { identityType, regionCode } = allValues;
      if (identityType && regionCode) {
        const res = await getKycState({
          region: regionCode,
          identityType,
        });

        setStateConfig(res?.data || {});
      }
    } catch (error) {
      console.log('onGetStateData error === ', error);
    }
    setStateLoading(false);
  };

  useEffect(() => {
    onGetStateData();
  }, [curStepAllValue?.identityType, curStepAllValue?.regionCode]);

  // step1 按钮禁用
  const isBtnDisable_step1_base = useMemo(() => {
    const requireList = ['identityType', 'regionCode'];
    return requireList.some((name) => !curStepAllValue[name]);
  }, [curStepAllValue]);

  // 按钮禁用 - 洲省
  const isBtnDisable_userState = useMemo(() => {
    return stateConfig?.displayState && !curStepAllValue?.userState;
  }, [curStepAllValue?.userState, stateConfig]);

  // 按钮禁用 - 土耳其元素
  const isBtnDisable_tr = useMemo(() => {
    const requireList = [
      'fatherName',
      'motherName',
      'occupation',
      'province',
      'district',
      'neighborhood',
      'street',
      'buildingNo',
      'birthDate',
    ];
    return (
      tenantConfig.kyc1.isNeedTurkeyExtInfo &&
      requireList.some((name) => {
        const errItem = curStepFormErr?.find((i) => i?.name?.[0] === name);
        return !curStepAllValue[name] || errItem?.errors?.length > 0;
      })
    );
  }, [curStepAllValue, curStepFormErr]);

  return (
    <Wrapper>
      <ClassNames>
        {() => (
          <FormWrapper id="formWrapper" className={step === 1 ? '' : 'needPadding'}>
            <Form
              form={form}
              onValuesChange={onValuesChange}
              onFieldsChange={() => {
                setCurStepFormErr(getFieldsError());
              }}
            >
              {step === 1 ? (
                <>
                  {/* 国家/地区 */}
                  <FormTitle>{_t('kyc_step1_issuing')}</FormTitle>
                  <FormItemWrapper>
                    <FormItem
                      label={isH5 ? '' : _t('cNg5brNKAigAH4CJBUxK94')}
                      name="regionCode"
                      help={errors.regionCode}
                      validateStatus="error"
                      rules={[
                        { required: true, message: _t('kyc.verification.info.country.select') },
                      ]}
                    >
                      <CountrySelect
                        onChange={(value) => {
                          if (value !== regionCode) {
                            form.setFieldsValue({ identityType: '', identityNumber: '' });
                          }
                          setRegionCode(value);
                          dispatch({
                            type: `${namespace}/getIdentityTypes`,
                            payload: {
                              region: value,
                            },
                          });
                          setManualChangeCountry(true);

                          handleGA(
                            'B1KYCInfoEdit1CountryChose',
                            value === countries[0]?.code ? '1' : '2',
                          );
                        }}
                        handleGA={handleGA}
                      />
                    </FormItem>
                  </FormItemWrapper>

                  {/* 選擇證件類型 */}
                  <FormTitle className="mb16">{_t('KYC_choose_document')}</FormTitle>
                  <FormItem
                    label={_t('6CwPAzZ9ssoqqYQNJSbh2y')}
                    name="identityType"
                    help={errors.identityType}
                    validateStatus="error"
                    rules={[{ required: true, message: _t('kyc.verification.info.cert.select') }]}
                  >
                    <IDType
                      handleScroll={handleScroll}
                      loading={identityTypesLoading || false}
                      handleGA={handleGA}
                      _t={_t}
                      identityType={form.getFieldValue('identityType')}
                      setFieldsValue={(identityType) => {
                        form.setFieldsValue({ identityType });

                        if (identityType !== kycInfo.identityType) {
                          form.setFieldsValue({ identityNumber: null });
                        } else {
                          changeField('identityType');
                        }
                      }}
                    />
                  </FormItem>

                  {/* 选择洲省 */}
                  {stateConfig?.displayState ? (
                    <>
                      <FormTitle className="mb16">{_t('9fBNsQGJ4tJUridwPbK8Cc')}</FormTitle>
                      <FormItem
                        name="userState"
                        label={_t('n7wpXzFijodxKU4k6qB7fk')}
                        rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
                        initialValue={formParams?.userState || kycInfo?.userState || ''}
                      >
                        <Select
                          loading={isStateLoading}
                          size="xlarge"
                          allowSearch
                          filterOption={handleFilter}
                          searchIcon={false}
                          options={stateConfig?.stateData?.map(({ code, name, limitState }) => {
                            return {
                              label: (
                                <StateLabel>
                                  <StateLabelText>{name}</StateLabelText>
                                  {limitState && (
                                    <Tooltip title={_t('x38c8B5XLMgZgeMKaf5cSd')} placement="top">
                                      <Restricted>{_t('uCQNHSVrZKcrqS71dULWqJ')}</Restricted>
                                    </Tooltip>
                                  )}
                                </StateLabel>
                              ),
                              value: code,
                              disabled: limitState,
                              title: name,
                            };
                          })}
                        />
                      </FormItem>
                    </>
                  ) : null}

                  <Privacy
                    isCN={isCN}
                    showJumio={
                      form.getFieldValue('regionCode') !== 'OT' &&
                      !['bvn', 'nin'].includes(form.getFieldValue('identityType'))
                    }
                  />

                  <BtnWrapper isios={isios}>
                    <Button
                      loading={isStateLoading || loading}
                      disabled={isBtnDisable_step1_base || isBtnDisable_userState}
                      onClick={handleContinue}
                    >
                      <span>{_t('1uQj2nEFstsPBLTJqNQRV9')}</span>
                    </Button>
                  </BtnWrapper>
                </>
              ) : (
                <>
                  <FormTitle2>{_t('kyc_step1')}</FormTitle2>
                  <NameWrapper>
                    <Name>
                      {/* 名 */}
                      <FormItem
                        label={_t('wmpz5yB7TdXGWtQ3sjboZV')}
                        name="firstName"
                        help={errors.firstName || lenTips.firstName}
                        validateStatus={lenTips.firstName ? 'warning' : 'error'}
                        rules={[
                          { required: true, message: _t('kyc.verify.firstName.required') },
                          {
                            validator: (a, value) => {
                              if (editKyc) {
                                if (value) {
                                  setDisabled(false);
                                  return checkValues(value, _t('kyc.verify.name.correct'), () => {
                                    setDisabled(true);
                                  });
                                }
                                setDisabled(false);
                                return;
                              }
                              return checkValues(value, _t('kyc.verify.name.correct'), () => {
                                setDisabled(true);
                              });
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder={
                            kycInfo.firstName ? kycInfo.firstName : _t('bvFN9V3koGFVvQPwR4mowg')
                          }
                          onFocus={() => handleGA('B1KYCInfoEdit2', '1')}
                          maxLength={32}
                          onChange={(e) => {
                            // const flag = checkValueIsZhStr(e?.target?.value, 'firstName');
                            // flag &&
                            checkInputLength('firstName', e?.target?.value?.length, 32);
                          }}
                          size="xlarge"
                          labelProps={{ 'shrink': true }}
                        />
                      </FormItem>
                    </Name>
                    <Name>
                      {/* 姓 */}
                      <FormItem
                        label={_t('28GFoDUetpjsfL9KDQ4pFs')}
                        name="lastName"
                        help={errors.lastName || lenTips.lastName}
                        validateStatus={lenTips.lastName ? 'warning' : 'error'}
                        rules={[
                          { required: true, message: _t('kyc.verify.lastName.required') },
                          {
                            validator: (a, value) => {
                              if (editKyc) {
                                if (value) {
                                  setDisabled(false);
                                  return checkValues(value, _t('kyc.verify.name.correct'), () => {
                                    setDisabled(true);
                                  });
                                }
                                if (!kycInfo.lastName) {
                                  return Promise.reject(
                                    new Error(_t('kyc.verify.lastName.required')),
                                  );
                                }
                                return;
                              }
                              return checkValues(value, _t('kyc.verify.name.correct'), () => {
                                setDisabled(true);
                              });
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder={
                            kycInfo.lastName ? kycInfo.lastName : _t('1PRpPiW1V5MR4HS2yemjXN')
                          }
                          onFocus={() => handleGA('B1KYCInfoEdit2', '2')}
                          maxLength={32}
                          onChange={(e) => {
                            checkInputLength('lastName', e?.target?.value?.length, 32);
                          }}
                          size="xlarge"
                          labelProps={{ 'shrink': true }}
                        />
                      </FormItem>
                    </Name>
                  </NameWrapper>

                  {/* 证件号码 */}
                  <FormItem
                    label={tenantConfig.kyc1.identityNumberLabel(_t)}
                    name="identityNumber"
                    help={errors.identityNumber || checkError || lenTips.identityNumber}
                    validateStatus={lenTips.identityNumber ? 'warning' : 'error'}
                    rules={[
                      { required: true, message: _t('kyc.account.sec.certificate.holder') },
                      {
                        validator: (a, value) => {
                          if (editKyc) {
                            if (value) {
                              setDisabled(false);
                              return checkIdentityNumberValues(value, () => {
                                setDisabled(true);
                              });
                            }
                            if (!kycInfo.identityNumber) {
                              return Promise.reject(
                                new Error(_t('kyc.account.sec.certificate.holder')),
                              );
                            }
                            return;
                          }
                          return checkIdentityNumberValues(value, () => {
                            setDisabled(true);
                          });
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder={
                        kycInfo?.identityType !== form.getFieldValue('identityType')
                          ? _t('h3riYGDW38k6PeBKApMTPd')
                          : kycInfo.identityNumber
                          ? kycInfo.identityNumber
                          : _t('h3riYGDW38k6PeBKApMTPd')
                      }
                      onFocus={() => handleGA('B1KYCInfoEdit2', '3')}
                      maxLength={32}
                      onChange={(e) => {
                        checkInputLength('identityNumber', e?.target?.value?.length, 32);
                      }}
                      size="xlarge"
                      labelProps={{ 'shrink': true }}
                    />
                  </FormItem>

                  {tenantConfig.kyc1.isNeedTurkeyExtInfo && <InfoFormTR />}

                  <BtnWrapper isios={isios}>
                    {/* <PreButton
                      onClick={() => {
                        setStep(1);
                        setIsBack(true);
                        errors.identityNumber = '';
                        dispatch({
                          type: `${namespace}/update`,
                          payload: { checkError: '' },
                        });
                        setFormParams({});
                        setStepList([]);
                      }}
                      loading={loading}
                      type="default"
                      variant="text"
                    >
                      <span>{_t('kyc_process_previous')}</span>
                    </PreButton> */}
                    {/* 继续 */}
                    <Button
                      loading={loading}
                      disabled={disabled || isBtnDisable_tr}
                      onClick={() => handleSubmit(true)}
                    >
                      <span>{_t('1uQj2nEFstsPBLTJqNQRV9')}</span>
                    </Button>
                  </BtnWrapper>
                </>
              )}
            </Form>
          </FormWrapper>
        )}
      </ClassNames>

      <ClearDialog
        open={isClearDialogOpen}
        onCancel={() => setClearDialogOpen(false)}
        onOk={async () => {
          await dispatch({ type: 'kyc/updateClearInfo' });
          setClearDialogOpen(false);
          handleSubmit(false);
        }}
      />
    </Wrapper>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <RootEmotionCacheProvider>
        <PersonalKyc1Form {...props} />
      </RootEmotionCacheProvider>
    </ThemeProvider>
  );
};
