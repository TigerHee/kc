import useLocale from 'hooks/useLocale';
import { ICMechanismOutlined } from '@kux/icons';
import { Button, Dialog, Form, Steps, Tooltip, useSnackbar } from '@kux/mui';
import { withRouter } from 'components/Router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomSelect from 'src/components/Account/Kyc/common/components/CustomSelect';
import {
  KC_KYC_BENEFITS,
  KC_PI_KYC1_BENEFITS,
  KC_PI_KYC2_BENEFITS,
} from 'src/constants/kyc/benefits';
import { KYC_TYPE } from 'src/constants/kyc/enums';
import useKycCache from 'src/hooks/useKycCache';
import useRegionOptions from 'src/hooks/useRegionOptions';
import { getKycState } from 'src/services/kyc';
import { addLangToPath, _t, _tHTML } from 'src/tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import Back from '../../../../components/Back';
import Benefit from '../../../../components/Benefit';
import KycRetain from '../../../../components/KycRetain';
import useIsPI from '../../../../Home/hooks/useIsPI';
import useRewardAmount from '../../../../hooks/useRewardAmount';
import formatLocalLangNumber from '../../../../utils/formatLocalLangNumber';
import replaceWithBackUrl from '../../../../utils/replaceWithBackUrl';
import {
  Body,
  CertTitle,
  Container,
  Content,
  Desc,
  ExSteps,
  FormLabel,
  GapBox,
  Header,
  Nav,
  QuestionIcon,
  Region,
  Restricted,
  StateLabel,
  StateLabelText,
  ToKYB,
  Wrapper,
} from './components/styled';
import { push } from '@/utils/router';

const { useForm, useWatch, FormItem } = Form;

const CountryOfIssueKC = ({ regions, query }) => {
  const { currentLang } = useLocale();
  const [form] = useForm();
  const regionCode = useWatch('regionCode', form); // 选择注册国家
  const userState = useWatch('userState', form); // 选择注册州省
  const regionOptions = useRegionOptions(regions);
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const [cache, pullCache, postCache] = useKycCache();
  const rewardAmount = useRewardAmount();
  const isPI = useIsPI({ regionCode });

  const [questionOpen, setQuestionOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stateConfig, setStateConfig] = useState({}); // 州省数据，某些注册国家需要选择
  const stateOptions = useMemo(() => {
    if (!stateConfig?.displayState) {
      return [];
    }
    return (stateConfig.stateData ?? []).map(({ code, name, limitState }) => {
      return {
        label: () => (
          <StateLabel>
            <StateLabelText>{name}</StateLabelText>
            {limitState && (
              <Tooltip title={_t('x38c8B5XLMgZgeMKaf5cSd')} placement="top">
                <Restricted>{_t('uCQNHSVrZKcrqS71dULWqJ')}</Restricted>
              </Tooltip>
            )}
          </StateLabel>
        ),
        title: name,
        value: code,
        disabled: limitState,
      };
    });
  }, [stateConfig]);

  const formatAmount = formatLocalLangNumber({
    data: rewardAmount,
    lang: currentLang,
    interceptDigits: 2,
  });

  const rewardMsg =
    rewardAmount > 0
      ? _tHTML('339b87a4f2944800a812', {
        amount: formatAmount,
        currency: 'USDT',
      })
      : null;

  const handleBack = async () => {
    if (query.backUrl) {
      window.location.href = query.backUrl.startsWith('/')
        ? addLangToPath(query.backUrl)
        : query.backUrl;
    } else {
      dispatch({ type: 'kyc/update', payload: { kycRedirect: false } });
      push('/account/kyc');
    }
  };

  const handleToKYB = () => {
    trackClick(['contrySelectPage', 'institutionalVerification']);
    push('/account/kyb/setup');
  };

  const handleSubmit = async () => {
    let data = null;
    try {
      data = await form.validateFields();
    } catch (err) {
      return;
    }
    trackClick(['contrySelectPage', 'getVerifyButton']);
    try {
      setLoading(true);
      let success = false;
      // 国家和州省有更新才提交，否则直接下一步
      if (cache.region !== data.regionCode || cache.userState !== data.userState) {
        success = await postCache({
          region: data.regionCode,
          userState: data.userState,
          type: KYC_TYPE.PERSONAL,
        });
      } else {
        success = true;
      }
      success && replaceWithBackUrl('/account/kyc/setup/identity-type', query.backUrl);
    } catch (err) {
      console.error(err);
      message.error(err?.msg || err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch({ type: 'kyc/getKYC3RewardInfo' });
    pullCache().then(({ type, region, userState }) => {
      if (type === KYC_TYPE.PERSONAL && region) {
        form.setFieldsValue({ regionCode: region, userState });
      }
    });
    kcsensorsManualExpose(['countrySelectPage', '1']);
  }, []);

  useEffect(() => {
    if (!regionCode) {
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getKycState({
          region: regionCode,
          // 查询州省信息的接口依赖证件类型（无数据则不展示）
          // 而设计上把这个州省的选择放在了选择证件类型之前
          // 后端不给新接口，让前端写死证件类型为护照
          // 因为现在只有护照类型的国家才需要选择州省
          identityType: 'passport',
        });

        setStateConfig(res?.data || {});
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [regionCode]);

  useEffect(() => {
    const ipRegion = regions.find(({ isIpRegion }) => isIpRegion);
    if (ipRegion) {
      form.setFieldsValue({ regionCode: ipRegion.code });
    }
  }, [regions, form]);

  return (
    <Container>
      <Wrapper>
        <Nav>
          <Back onBack={handleBack} />
          <ToKYB onClick={handleToKYB}>
            <ICMechanismOutlined size={18} />
            <span>{_t('kyc.certification.mechanism')}</span>
          </ToKYB>
        </Nav>
        <Body>
          <Header>{_t('be346cea74a24800a0c1')}</Header>
          <Content>
            <Region>
              <Form form={form}>
                <FormLabel>
                  <span>{_t('b9bc87e7af7c4800ae9e')}</span>
                  <QuestionIcon size={16} onClick={() => setQuestionOpen(true)} />
                </FormLabel>
                <FormItem
                  name="regionCode"
                  rules={[{ required: true, message: _t('3bd2f2b960d14800a155') }]}
                >
                  <CustomSelect
                    name="regionCode"
                    options={regionOptions}
                    // size={size}
                    allowSearch
                    value={regionCode}
                    onChange={() => {
                      trackClick(['contrySelectPage', 'countrySelect']);
                    }}
                  />
                </FormItem>
                {stateConfig?.displayState ? (
                  <>
                    <FormLabel>{_t('800911a6ada54000a4b6')}</FormLabel>
                    <FormItem
                      name="userState"
                      rules={[{ required: true, message: _t('3bd2f2b960d14800a155') }]}
                    >
                      <CustomSelect
                        name="userState"
                        options={stateOptions}
                        allowSearch
                        value={userState}
                      />
                    </FormItem>
                  </>
                ) : null}
              </Form>
              {regionCode ? (
                <GapBox gap={isPI ? 16 : 12}>
                  <Desc>{_tHTML('5daa3987d2434800afe9')}</Desc>
                  {isPI ? (
                    <ExSteps size="small" direction="vertical">
                      <Steps.Step
                        status={'process'}
                        title={
                          <CertTitle>
                            <span>{_t('2fd9c0dd3cde4000abb7')}</span>
                          </CertTitle>
                        }
                        description={
                          <Benefit
                            rewardMsg={rewardMsg}
                            unlockInfos={KC_PI_KYC1_BENEFITS()}
                            collectInfos={[_t('f9b43fd2ffdf4000a6c5'), _t('8a5769cf4cc54800ae5b')]}
                          />
                        }
                      />
                      <Steps.Step
                        status={'wait'}
                        title={
                          <CertTitle>
                            <span>{_t('fe9978d0f98f4000a109')}</span>
                          </CertTitle>
                        }
                        description={
                          <Benefit
                            unlockInfos={KC_PI_KYC2_BENEFITS()}
                            collectInfos={[_t('a279676c69734000a122'), _t('edb8be65563e4000a96a')]}
                          />
                        }
                      />
                    </ExSteps>
                  ) : (
                    <Benefit
                      rewardMsg={rewardMsg}
                      unlockInfos={KC_KYC_BENEFITS()}
                      collectInfos={[_t('8d9082e901794000a32e'), _t('7a4a102325b74000aee4')]}
                    />
                  )}
                </GapBox>
              ) : null}
            </Region>
            <Button size="large" fullWidth loading={loading} onClick={handleSubmit}>
              {_t('7021b44675954000a833')}
            </Button>
          </Content>
        </Body>
      </Wrapper>
      <Dialog
        title={_t('f10c1636a3634800abd1')}
        open={questionOpen}
        cancelText={null}
        okText={_t('18dac345a9464000a0a6')}
        centeredFooterButton
        onCancel={() => setQuestionOpen(false)}
        onOk={() => setQuestionOpen(false)}
      >
        <span>{_t('92b2e2f02f124000a6a5')}</span>
      </Dialog>
      <KycRetain />
    </Container>
  );
};

export default withRouter()(CountryOfIssueKC);
