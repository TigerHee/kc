/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Form, Spin, styled, useSnackbar } from '@kux/mui';
import { evtEmitter } from 'helper';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Back from 'src/components/Account/Kyc/common/components/Back';
import {
  PADDING_LG,
  PADDING_XL,
  PADDING_XS,
} from 'src/components/Account/Kyc/constants/paddingSize';
import { PAGE_TYPE } from 'src/components/Account/Kyc/KycKybHome/constants';
import { withRouter } from 'src/components/Router';
import {
  postCompanyAddition,
  postCompanyContact,
  postCompanyCredentials,
  postCompanyNormal,
  postCompanySubmit,
} from 'src/services/kyb';
import { kcsensorsManualExpose, saTrackForBiz, trackClick } from 'src/utils/ga';
import isMobile from 'src/utils/isMobile';
import { captureEvent } from '@sentry/nextjs';
import { KYB_CERT_TYPES, VERIFY_CONTAINER_CLASS_NAME } from '../../config';
import useKybStatus from '../../hooks/useKybStatus';
import { Header } from '../Home/components/styled';
import Prompt from './components/Prompt';
import Steps from './components/Steps';
import { ButtonGroup, ExForm, Section } from './components/styled';
import useSteps from './hooks/useSteps';
import renderRow from './utils/renderRow';
import { push, replace } from '@/utils/router';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import AccountLayout from '@/components/AccountLayout';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const { useForm } = Form;

// 埋点枚举：kyb 等级
const APPLY_KYB_LEVELS = {
  0: 'pre',
  1: 'company',
  2: 'applicant',
  3: 'documents',
  4: 'optional',
  5: 'additional',
};

// 用于各字段注册监听 valueChange 事件
const KYB_FIELD_STATE_CHANGE_EVT = 'KYB_FIELD_STATE_CHANGE';
const evt = evtEmitter.getEvt();

const Container = styled.div`
  margin-bottom: 90px;
`;
const Body = styled.div`
  padding: 0 ${PADDING_XL}px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 0 ${PADDING_LG}px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0 ${PADDING_XS}px;
  }
`;

function KybCertification({ query }) {
  const [form] = useForm();
  const { kybStatus, kybStatusEnum } = useKybStatus();
  const { message } = useSnackbar();
  const rv = useResponsiveSSR();
  const dispatch = useDispatch();
  const companyDetail = useSelector((state) => state.kyb?.companyDetail);
  const loading = useSelector(
    ({ loading }) => loading.effects['kyb/pullCompanyDetail'] || loading.effects['kyc/pullKycInfo'],
  );

  const kybType = String(companyDetail?.kybType ?? query.kybType ?? KYB_CERT_TYPES.COMMON);

  const isH5 = !rv?.sm;
  const size = isH5 ? 'large' : 'xlarge';

  const [localPhase, setLocalPhase] = useState(-1);
  const [remotePhase, setRemotePhase] = useState(-1);
  const [formData, setFormData] = useState(null);
  // 审核拒绝的原因
  const [rejectedReasons, setRejectedReason] = useState({});
  const rejectedReasonsRef = useRef({});
  const [isChanged, setIsChanged] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [promptEnable, setPromptEnable] = useState(false);
  const initRef = useRef(false);

  const scrollToFailOrTop = () => {
    // 加点延时，避免视图未更新获取不到 error 字段的 className
    setTimeout(() => {
      const target = document
        .querySelector('.KuxForm-itemError[type="secondary"]')
        // 找到包裹 error 字段的用于定位的容器
        ?.closest(`.${VERIFY_CONTAINER_CLASS_NAME}`);
      if (target) {
        const { y } = target.getBoundingClientRect() ?? { y: 0 };
        const header = document.querySelector('.gbiz-Header');
        const { height: offsetY } = header?.getBoundingClientRect() ?? { height: 0 };
        window.scrollBy({
          behavior: 'smooth',
          top: y - offsetY - 10,
        });
      } else {
        window.scrollTo({
          behavior: 'smooth',
          top: 0,
        });
      }
    }, 50);
  };

  // 注册校验回调，给各字段监听校验事件
  const registerValidate = (callback) => {
    evt.on(KYB_FIELD_STATE_CHANGE_EVT, callback);
    return () => evt.off(KYB_FIELD_STATE_CHANGE_EVT, callback);
  };
  // 校验字段并触发各字段的回调
  const validate = async (fields) => {
    try {
      const res = await form.validateFields(fields);
      evt.emit(KYB_FIELD_STATE_CHANGE_EVT);
      return res;
    } catch (err) {
      evt.emit(KYB_FIELD_STATE_CHANGE_EVT);
      throw err;
    }
  };

  const steps = useSteps({
    size,
    form,
    formData,
    rejectedReasons,
    kybType,
    validate,
    registerValidate,
  });

  const { sections = [] } = steps.find((step) => step.index === localPhase) ?? {};

  const findPrevStep = (phase = localPhase) =>
    steps.filter((s) => !s.hidden && s.index < phase).pop();
  const prevStep = findPrevStep();
  const findNextStep = (phase = localPhase) => steps.find((s) => s.index > phase && !s.hidden);
  const nextStep = findNextStep();

  const handleSave = async (phase = remotePhase, temp = false) => {
    setSaveLoading(true);
    let payload;
    if (temp) {
      // 临时保存不做校验
      payload = form.getFieldsValue();
      payload.currentPhase = phase;
    } else {
      try {
        payload = await validate();
        payload.currentPhase = phase;
      } catch (err) {
        setSaveLoading(false);
        scrollToFailOrTop();
        throw err;
      }
    }
    // 虽然分保存步骤，但数据全量提交
    payload = { ...formData, ...payload, kybType };
    const sensorsExtra = {
      kyb_country: payload.registrationCountry,
      company_type: payload.companyType,
      kyb_submit_result: 'success',
    };
    try {
      let res = null;
      switch (localPhase) {
        case 1:
          if (payload.detailSameOfficeAddress) {
            // 勾选了注册地址和工作地址相同的选项
            // 注册地址拷贝到工作地址
            payload.workCountry = payload.registrationCountry;
            payload.workProvince = payload.registrationProvince;
            payload.workCity = payload.registrationCity;
            payload.workStreet = payload.registrationStreet;
            payload.workHome = payload.registrationHome;
            payload.workPostcode = payload.registrationPostcode;
          }
          sensorsExtra.trading_volume = payload.tradeAmount;
          if (moment.isMoment(payload.registrationDate)) {
            payload.registrationDate = payload.registrationDate.format('YYYY-MM-DD');
          }
          res = await postCompanyNormal(payload);
          break;
        case 2:
          // 永久有效传固定字符串，而非格式化时间
          payload.idExpireDate = payload.idExpireDateIsPermanent
            ? 'permanent'
            : payload.idExpireDate.format('YYYY-MM-DD');
          payload.source = 'web';
          res = await postCompanyContact(payload);
          break;
        case 3:
          res = await postCompanyCredentials(payload);
          break;
        case 4:
        case 5:
          res = await postCompanyAddition(payload);
          break;
        default:
          throw new Error('Invalid step');
      }
      if (!res.success) {
        throw res;
      }
      setIsChanged(false);
    } catch (err) {
      sensorsExtra.kyb_submit_result = 'fail';
      message.error(err.msg ?? err.message);
      throw new Error(err.msg ?? err.message);
    } finally {
      saTrackForBiz({ saType: 'kyb_submit_result' }, [], {
        ...sensorsExtra,
        apply_kyb_level: APPLY_KYB_LEVELS[localPhase],
        kyb_submit_terminal: isMobile() ? 'web_mobile' : 'web_pc',
        TerminalType: 'js',
      });
      setSaveLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setPromptEnable(false); // 前置先把路由拦截去掉
      const res = await postCompanySubmit();
      if (!res.success) {
        throw res;
      }
      trackClick(['B1KYBVerifyProcess', 'submit']);
      push('/account/kyb/home');
    } catch (error) {
      setPromptEnable(true); // 报错后不需要跳转，恢复路由拦截
      console.error(error);
      message.error(error?.msg || error?.message);
      if (error?.code === '2000') {
        // 出现错误码 2000，缺少材料
        // 可能是前后端校验的材料不一致
        captureEvent({
          level: 'error',
          message: 'Missing material',
          tags: {
            companyType: formData.companyType,
            errorType: 'kyb_submit_error',
          },
          fingerprint: 'kyb_submit_error',
        });
      }
    }
  };

  const handlePrev = async () => {
    if (!prevStep) {
      return;
    }
    try {
      if (isChanged) {
        // 检查是否有未保存的内容，有则需要进行保存
        await handleSave(remotePhase, true);
      }
      setLocalPhase(prevStep.index);
    } catch (err) {
      console.err(err);
    } finally {
      scrollToFailOrTop();
    }
  };

  const handleNext = async () => {
    const newStep = findNextStep();
    const hasNext = !!newStep;
    try {
      // 没有下一步时把进度设置回 1
      // 因为如果审核被拒绝，进度要从第一步重新开始
      await handleSave(hasNext ? newStep.index : 1);
    } catch (err) {
      console.error(err);
      return;
    }
    trackClick([
      'B1KYBVerifyProcess',
      `${APPLY_KYB_LEVELS[localPhase]}Next`,
      remotePhase === localPhase
        ? // 当前进度等于服务端进度时，代表首次提交
        1
        : // 非首次提交，区分更新和不更新数据
        isChanged
          ? 3
          : 2,
    ]);
    switch (localPhase) {
      case 1:
        trackClick(['companyInfo', 'continue']);
        break;
      case 2:
        trackClick(['contactInfo', 'continue']);
        break;
      case 3:
        trackClick(['verificationDocuments', 'continue']);
        break;
      case 4:
        trackClick(['additionalDetails', 'continueOrSubmit']);
        break;
      case 5:
        trackClick(['supplyDocuments', 'finish']);
        break;
    }
    if (hasNext) {
      // 最大进度不可逆（除了最后提交审核要重置为 1）
      setRemotePhase(Math.max(newStep.index, remotePhase));
      setLocalPhase(newStep.index);
      scrollToFailOrTop();
    } else {
      // 没有下一步时，提交审核
      handleSubmit();
    }
  };

  const handleValuesChange = useCallback(
    (values) => {
      setFormData({ ...formData, ...values });
      setIsChanged(true);
    },
    [formData],
  );

  useEffect(() => {
    if (companyDetail) {
      const { verifyFailReason = {}, ...others } = companyDetail;
      form.setFieldsValue(others);
      // form 里的元素是按需渲染，有渲染的表单值才能通过 form 实例获取
      // 所以把全量字段另外存一份，避免丢失
      setFormData(others);
      setRejectedReason(verifyFailReason);
    }
  }, [companyDetail, form]);

  useEffect(() => {
    form.setFields(
      Object.keys(rejectedReasons).map((name) => {
        return { name, value: formData?.[name], errors: [rejectedReasons[name]] };
      }),
    );
  }, [localPhase, rejectedReasons]);

  useEffect(() => {
    if (kybStatus) {
      if ([kybStatusEnum.VERIFYING, kybStatusEnum.VERIFIED].includes(kybStatus)) {
        // 审核中和审核通过的不可访问此页面
        // 重定向到 kyb 落地页
        replace('/account/kyb/home');
        return;
      }
      setPromptEnable(true);
    }
  }, [kybStatus, kybStatusEnum]);

  useEffect(() => {
    dispatch({ type: 'kyc/getKybCountries' });
    dispatch({ type: 'kyc/getKycCode' });
    dispatch({ type: 'kyb/pullCompanyDetail' }).then((data) => {
      if (!data?.companyType) {
        // 无企业类型为 kyb 重构前的存量数据
        // 重定向到选择国家/企业类型页面
        replace('/account/kyb/setup');
      }
    });
    dispatch({
      type: 'kyc/pullKycInfo',
      payload: { type: PAGE_TYPE.institution.type },
    });
  }, []);

  useEffect(() => {
    if (!initRef.current && formData && kybStatus) {
      if (kybType !== String(formData.kybType || KYB_CERT_TYPES.COMMON)) {
        // kybType 不一致，重置为第一步
        setLocalPhase(1);
        setRemotePhase(1);
      } else if (kybStatus === kybStatusEnum.UNVERIFIED) {
        const currentPhase = Math.max(formData.currentPhase, 1);
        setLocalPhase(currentPhase);
        setRemotePhase(currentPhase);
      } else {
        let curStep = steps.find((s) => s.index === formData.currentPhase);
        if (!curStep || curStep.hidden) {
          // 若没有或隐藏，取下一个可视的步骤
          curStep = findNextStep(formData.currentPhase);
        }
        if (!curStep || curStep.hidden) {
          // 还是没有或隐藏，取上一个可视的步骤
          curStep = findPrevStep(formData.currentPhase);
        }
        if (!curStep) {
          // 还是没有找到当前的步骤，取第一个可视的步骤
          curStep = steps.find((s) => !s.hidden);
        }
        setLocalPhase(curStep?.index ?? 1);
        setRemotePhase(5);
      }
      scrollToFailOrTop();
      initRef.current = true;
    }
  }, [formData, steps, kybStatus, kybType]);

  useEffect(() => {
    if (initRef.current && !sections.length && localPhase > 0) {
      // 无内容可渲染
      captureEvent({
        level: 'error',
        message: 'No content in step',
        tags: {
          companyType: formData?.companyType,
          currentPhase: localPhase,
          kybStatus,
          errorType: 'kyb_render_error',
        },
        fingerprint: 'kyb_render_error',
      });
    }
  }, [localPhase, sections, kybStatus, formData?.companyType]);

  useEffect(() => {
    switch (localPhase) {
      case 1:
        kcsensorsManualExpose(['companyInfo', 1]);
        break;
      case 2:
        kcsensorsManualExpose(['contactInfo', 1]);
        break;
      case 3:
        kcsensorsManualExpose(['verificationDocuments', 1]);
        break;
      case 4:
        kcsensorsManualExpose(['additionalInfo', 1]);
        break;
      case 5:
        kcsensorsManualExpose(['supplyDocuments', 1]);
        break;
    }
  }, [localPhase]);

  const onBcck = () => {
    if (kybType === KYB_CERT_TYPES.KUCOIN_PAY && !query?.pageFromHome) {
      push(`/account/kyb/setup?kybType=${kybType}`);
    } else {
      push(`/account/kyb/home?kybType=${kybType}`);
    }
  };

  return (
    <Container>
      <Back onBack={onBcck} />
      <Header>{PAGE_TYPE.institution.title()}</Header>
      <Body>
        <Spin spinning={loading} size="small">
          {steps.filter(({ hidden }) => !hidden).length > 1 ? (
            <Steps current={remotePhase}>
              {steps.map(({ index, name, hidden, error }) =>
                hidden ? null : <Steps.Step key={index} index={index} name={name} error={error} />,
              )}
            </Steps>
          ) : null}
          {formData ? (
            <ExForm form={form} onValuesChange={handleValuesChange}>
              {sections.map((section) => (
                <Section
                  key={section.label}
                  label={section.label}
                  description={section.description}
                  closer={section.closer}
                  style={section.style}
                >
                  {section.children.map(renderRow)}
                </Section>
              ))}
              <ButtonGroup
                loading={saveLoading}
                hiddenBack={!prevStep}
                lastStep={!nextStep}
                onBack={handlePrev}
                onNext={handleNext}
              />
            </ExForm>
          ) : null}
        </Spin>
      </Body>
      {promptEnable ? (
        <Prompt
          isChanged={isChanged}
          onSave={() => handleSave(remotePhase, true)}
          kybType={kybType}
        />
      ) : null}
    </Container>
  );
}

const KybCertificationWithLayout = (props) => {
  return (
    <ErrorBoundary scene={SCENE_MAP.kyc.kyb_certification}>
      <AccountLayout>
        <KybCertification {...props} />
      </AccountLayout>
    </ErrorBoundary>
  );
};

export default withRouter()(KybCertificationWithLayout);
