/**
 * Owner: vijay.zhou@kupotech.com
 * kyc 认证前置选择国家和证件
 * 在【kyc】和【迁移前补充 kyc】页面使用
 */
import { Checkbox, Dialog, Form, Radio, Tooltip, useSnackbar, useTheme } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';
import { getIdentityTypes, getKycState } from 'services/kyc';
import Back from 'src/components/Account/Kyc/common/components/Back';
import CustomSelect from 'src/components/Account/Kyc/common/components/CustomSelect';
import { tenantConfig } from 'src/config/tenant';
import { _t } from 'src/tools/i18n';
import ResidenceDialog from '../ResidenceDialog';
import useResponsiveSSR from '@/hooks/useResponsiveSSR';

import {
  Container,
  ExTag,
  FormItemLabel,
  Item,
  ItemContent,
  ItemIconWrapper,
  List,
  QuestionIcon,
  Restricted,
  StateLabel,
  StateLabelText,
  SubmitButton,
  Title,
  Wrapper,
} from './styled';

const { FormItem, useForm, useWatch } = Form;

const KycCountryOfIssue = ({
  siteType = tenantConfig.kyc.siteRegion,
  initData = {},
  countries = [],
  loading,
  regionLock,
  canBack = true,
  onBack,
  onSubmit,
}) => {
  const [form] = useForm();
  const { message } = useSnackbar();
  const regionCode = useWatch('regionCode', form); // 选择注册国家
  const identityType = useWatch('identityType', form); // 选择证件类型
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';

  const [stateConfig, setStateConfig] = useState({}); // 州省数据，某些注册国家需要选择
  const [isStateLoading, setStateLoading] = useState(false);
  const [identityTypeConfig, setIdentityTypeConfig] = useState(null);
  const [isIdentityTypeLoading, setIdentityTypeLoading] = useState(false);
  const [residenceDialogOpen, setResidenceDialogOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);

  const finallyLoading = loading || isStateLoading || isIdentityTypeLoading;
  const size = isH5 ? 'large' : 'xlarge';
  const { recommendIdType } = identityTypeConfig ?? {};
  const needToChangeSite =
    tenantConfig.kyc.onlySupportCurrentRegion &&
    countries.find((c) => c.value === regionCode)?.siteType !== siteType;

  const identityTypeOptions = useMemo(() => {
    if (!identityTypeConfig) {
      return [];
    }
    const {
      localIdentityTypeList = [],
      commonIdentityTypeList = [],
      recommendIdType,
    } = identityTypeConfig;
    const options = [];
    localIdentityTypeList?.forEach((item) => {
      item.type === recommendIdType
        ? options.unshift({ ...item, isFast: true })
        : options.push({ ...item, isFast: true });
    });
    commonIdentityTypeList?.forEach((item) => {
      item.type === recommendIdType ? options.unshift(item) : options.push(item);
    });
    return options;
  }, [identityTypeConfig]);
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

  const handleSubmit = async () => {
    if (finallyLoading) {
      return;
    }
    try {
      const data = await form.validateFields();
      if (needToChangeSite) {
        setResidenceDialogOpen(true);
        return;
      }
      onSubmit?.(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCountryChange = async (regionCode) => {
    if (regionCode) {
      try {
        setIdentityTypeLoading(true);
        const res = await getIdentityTypes({ region: regionCode, siteType });
        if (!res.success) {
          throw res;
        }
        setIdentityTypeConfig(res.data);
        form.setFieldsValue({ identityType: res.data?.recommendIdType });
      } catch (err) {
        console.error(err);
        message.error(err?.msg ?? err?.message);
      } finally {
        setIdentityTypeLoading(false);
      }
    }
  };

  useEffect(() => {
    form.setFieldsValue(initData);
    if (initData.regionCode) {
      handleCountryChange(initData.regionCode);
    }
  }, []);

  useEffect(() => {
    /** 拉取州省信息 */
    (async () => {
      if (!regionCode || !identityType) {
        return;
      }
      setStateLoading(true);
      try {
        const res = await getKycState({
          region: regionCode,
          identityType,
        });

        setStateConfig(res?.data || {});
      } catch (error) {
        console.error(error);
      } finally {
        setStateLoading(false);
      }
    })();
  }, [regionCode, identityType]);

  return (
    <Container>
      <Wrapper>
        {canBack ? <Back hasMarginLeft={false} onBack={onBack} /> : null}
        <Title>{_t('8f390a11652c4000aa74')}</Title>
        <Form form={form}>
          <FormItemLabel>
            <span>{_t('cNg5brNKAigAH4CJBUxK94')}</span>
            <QuestionIcon size={16} onClick={() => setQuestionOpen(true)} />
          </FormItemLabel>
          <FormItem
            name="regionCode"
            rules={[{ required: true, message: _t('3bd2f2b960d14800a155') }]}
          >
            <CustomSelect
              name="regionCode"
              options={countries}
              size={size}
              allowSearch
              value={regionCode}
              onChange={handleCountryChange}
              disabled={regionLock}
            />
          </FormItem>
          {identityTypeConfig ? (
            <>
              <FormItemLabel>{_t('5dea463e49444800a28d')}</FormItemLabel>
              <FormItem
                name="identityType"
                rules={[{ required: true, message: _t('3bd2f2b960d14800a155') }]}
              >
                <Radio.Group name="identityType">
                  <List>
                    {identityTypeOptions.map(({ name, type, icon, iconDark, isFast }) => {
                      return (
                        <Item
                          key={type}
                          onClick={() => form.setFieldsValue({ identityType: type })}
                        >
                          <ItemIconWrapper>
                            <img src={isDark ? iconDark ?? icon : icon} alt="icon" />
                          </ItemIconWrapper>
                          <ItemContent>
                            {name}
                            {isFast ? <ExTag>{_t('b45e2b12c0dd4000a96a')}</ExTag> : null}
                            {type === recommendIdType ? (
                              <ExTag>{_t('da5ef3312e974000ac02')}</ExTag>
                            ) : null}
                          </ItemContent>
                          <Checkbox
                            checked={type === identityType}
                            size="basic"
                            checkOptions={{ type: 1, checkedType: 1 }}
                          />
                        </Item>
                      );
                    })}
                  </List>
                </Radio.Group>
              </FormItem>
            </>
          ) : null}
          {stateConfig?.displayState ? (
            <>
              <FormItemLabel>{_t('800911a6ada54000a4b6')}</FormItemLabel>
              <FormItem
                name="userState"
                label={_t('752ded6733434800a0b3')}
                rules={[{ required: true, message: _t('3bd2f2b960d14800a155') }]}
              >
                <CustomSelect
                  name="userState"
                  options={stateOptions}
                  size={size}
                  loading={isStateLoading}
                  allowSearch
                />
              </FormItem>
            </>
          ) : null}
        </Form>
        <SubmitButton size="large" loading={finallyLoading} onClick={handleSubmit}>
          {_t('5dad5f1f450e4000a437')}
        </SubmitButton>
      </Wrapper>
      {tenantConfig.kyc.onlySupportCurrentRegion ? (
        <ResidenceDialog
          open={residenceDialogOpen}
          regionCode={regionCode}
          shouldAlert
          onCancel={() => setResidenceDialogOpen(false)}
        />
      ) : null}
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
    </Container>
  );
};

export default KycCountryOfIssue;
