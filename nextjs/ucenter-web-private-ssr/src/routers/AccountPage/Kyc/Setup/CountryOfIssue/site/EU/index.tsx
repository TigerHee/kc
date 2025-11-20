import { ICMechanismOutlined, ICQuestionOutlined } from '@kux/icons';
import { Form } from '@kux/mui';
import { Button, Tooltip, Modal, toast, Empty } from '@kux/design';
import { withRouter } from 'components/Router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomSelect from 'src/components/Account/Kyc/common/components/CustomSelect';
import { KYC_TYPE } from 'src/constants/kyc/enums';
import useKycCache from 'src/hooks/useKycCache';
import useRegionOptions from 'src/hooks/useRegionOptions';
import { getKycState } from 'src/services/kyc';
import { addLangToPath, _t, _tHTML } from 'src/tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import Back from 'routers/AccountPage/Kyc/components/Back';
import KycRetain from 'routers/AccountPage/Kyc/components/KycRetain';
import replaceWithBackUrl from 'routers/AccountPage/Kyc/utils/replaceWithBackUrl';
import { push } from '@/utils/router';
import styles from './styles.module.scss';
import Benefit from './components/Benefit';
import ExRadio from './components/ExRadio';
import { tenantConfig } from 'src/config/tenant';

const { useForm, useWatch, FormItem } = Form;

interface IFormData {
  regionCode: string;
  userState?: string | null;
}
interface IStateConfig {
  displayState?: boolean;
  stateData?: {
    code: string;
    name: string;
    limitState: boolean;
  }[];
}

const CountryOfIssueEU = ({ regions, query }) => {
  const [form] = useForm<IFormData>();
  const regionCode = useWatch('regionCode', form); // 选择注册国家
  const userState = useWatch('userState', form); // 选择注册州省
  /** @todo 过滤出欧盟国家 */
  const regionOptions = useRegionOptions(regions, tenantConfig.kyc.siteRegion);
  const dispatch = useDispatch();
  const [cache, pullCache, postCache] = useKycCache();
  const [terms, setTerms] = useState<{ title: string, value?: boolean }[]>([
    { title: /** @todo */ 'I am opening the account for myself', value: undefined },
    { title: /** @todo */ 'I have no connections to the USA whatsoever', value: undefined },
    { title: /** @todo */ 'I am not a political exposed person', value: undefined },
  ]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [rejectedOpen, setRejectedOpen] = useState(false);

  const [questionOpen, setQuestionOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stateConfig, setStateConfig] = useState<IStateConfig>({}); // 州省数据，某些注册国家需要选择
  const stateOptions = useMemo(() => {
    if (!stateConfig?.displayState) {
      return [];
    }
    return (stateConfig.stateData ?? []).map(({ code, name, limitState }) => {
      return {
        label: () => (
          <div className={styles.stateLabel}>
            <span>{name}</span>
            {limitState && (
              <Tooltip content={_t('x38c8B5XLMgZgeMKaf5cSd')} placement="top">
                <p className={styles.restricted}>{_t('uCQNHSVrZKcrqS71dULWqJ')}</p>
              </Tooltip>
            )}
          </div>
        ),
        title: name,
        value: code,
        disabled: limitState,
      };
    });
  }, [stateConfig]);

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

  const handleOpenTerms = async () => {
    let data: IFormData | null = null;
    try {
      data = await form.validateFields();
    } catch (err) {
      return;
    }
    setTerms(terms.map((term) => ({ ...term, value: undefined })));
    setTermsOpen(true);
  };

  const handleSubmit = async () => {
    let data: IFormData | null = null;
    try {
      data = await form.validateFields();
    } catch (err) {
      return;
    }
    trackClick(['contrySelectPage', 'getVerifyButton']);
    try {
      setTermsOpen(false);
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
    } catch (err: any) {
      console.error(err);
      toast.error(err?.msg || err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejected = () => {
    setTermsOpen(false);
    setRejectedOpen(true);
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
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.nav}>
          <Back onBack={handleBack} />
          <div className={styles.toKYB} onClick={handleToKYB}>
            <ICMechanismOutlined size={18} />
            <span>{_t('kyc.certification.mechanism')}</span>
          </div>
        </div>
        <section className={styles.body}>
          <h1 className={styles.header}>{_t('be346cea74a24800a0c1')}</h1>
          <div className={styles.content}>
            <div className={styles.region}>
              <Form form={form}>
                <div className={styles.formLabel}>
                  <span>{_t('b9bc87e7af7c4800ae9e')}</span>
                  <ICQuestionOutlined className={styles.questionIcon} size={16} onClick={() => setQuestionOpen(true)} />
                </div>
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
                    <div className={styles.formLabel}>{_t('800911a6ada54000a4b6')}</div>
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
                <div className={styles.gapBox}>
                  <div className={styles.desc}>{_tHTML('5daa3987d2434800afe9')}</div>
                  <Benefit />
                </div>
              ) : null}
            </div>
            <Button size="large" type="primary" fullWidth loading={loading} onClick={handleOpenTerms}>
              {_t('7021b44675954000a833')}
            </Button>
          </div>
        </section>
      </div>
      <Modal
        isOpen={questionOpen}
        title={_t('f10c1636a3634800abd1')}
        okText={_t('18dac345a9464000a0a6')}
        onOk={() => setQuestionOpen(false)}
        onClose={() => setQuestionOpen(false)}
      >
        <span>{_t('92b2e2f02f124000a6a5')}</span>
      </Modal>
      <Modal
        isOpen={termsOpen}
        size="medium"
        title={/** @todo */ 'Declaration'}
        onClose={() => setTermsOpen(false)}
        centeredFooterButton={false}
        mobileTransform
        footer={<div className={styles.termsFooter}>
          <Button type="text" onClick={() => setTermsOpen(false)}>
            {/** @todo */ 'Cancel'}
          </Button>
          <Tooltip
            content={terms.some((term) => term.value === undefined) ? /** @todo */ 'Please complete above declaration' : undefined}
            placement="top-end"
            mobileTransform
          >
            <Button
              type="primary"
              disabled={terms.some((term) => term.value === undefined)}
              onClick={
                terms.every((term) => term.value)
                  ? handleSubmit
                  : handleRejected
              }
            >
              {/** @todo */ 'Confirm'}
            </Button>
          </Tooltip>
        </div>}
      >
        <span className={styles.radioDesc}>
          {/** @todo */ 'By clicking continue, I confirm the below statement '}
        </span>
        <div className={styles.radioWrapper}>
          {
            terms.map((term) => (
              <ExRadio
                key={term.title}
                title={term.title}
                value={term.value}
                onChange={(value) => {
                  setTerms(terms.map((t) => t.title === term.title ? { ...t, value } : t));
                }}
              />
            ))
          }
        </div>
      </Modal>
      <Modal
        isOpen={rejectedOpen}
        okText={/** @todo */ 'Understood'}
        onClose={() => setRejectedOpen(false)}
        className={styles.rejectedModal}
      >
        <Empty
          name="warn"
          size="small"
          title={/** @todo */ 'Sorry, we can\'t proceed with your verification'}
          description={/** @todo */ 'We only process users for verification who open an account for themselves, have no ties to the USA, and are not politically exposed.'}
        />
      </Modal>
      <KycRetain />
    </main>
  );
};

export default withRouter()(CountryOfIssueEU);
