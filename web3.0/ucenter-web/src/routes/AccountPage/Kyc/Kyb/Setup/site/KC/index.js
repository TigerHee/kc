/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { Box, Button as OriginButton, Form, styled, useResponsive, useSnackbar } from '@kux/mui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/Account/Kyc/common/components/Back';
import CustomSelect from 'src/components/Account/Kyc/common/components/CustomSelect';
import { withRouter } from 'src/components/Router';
import { getUserArea } from 'src/services/homepage';
import { postCompanyNormal } from 'src/services/kyb';
import { _t } from 'src/tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'src/utils/ga';
import { push } from 'utils/router';
import { COMPANY_TYPE, COMPANY_TYPE_LIST, KYB_CERT_TYPES } from '../../../../config';
import useCountryOptions from '../../../hooks/useCountryOptions';

const Container = styled.div`
  width: 580px;
  margin: 0 auto;
`;
const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  margin-top: 48px;
  margin-bottom: 24px;
`;
const { useForm, FormItem } = Form;

const FormItemTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  .KuxForm-item + & {
    margin-top: 4px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const FormItemDescription = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin: 4px 0 16px;
`;
const Button = styled(OriginButton)`
  gap: 8px;
  width: 100%;
  margin-top: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
`;

function KybSetup({ dispatch, companyDetail, loading, query }) {
  const [form] = useForm();
  const countryOptions = useCountryOptions();
  const { message } = useSnackbar();
  const rv = useResponsive();

  const kybType = String(companyDetail?.kybType ?? query.kybType ?? KYB_CERT_TYPES.COMMON);

  const [submitLoading, setSubmitLoading] = useState(false);

  const isH5 = !rv?.sm;
  const size = isH5 ? 'large' : 'xlarge';

  const companyTypeOptions = useMemo(() => {
    if (kybType === KYB_CERT_TYPES.KUCOIN_PAY) {
      return COMPANY_TYPE_LIST.filter((option) =>
        [COMPANY_TYPE.NORMAL, COMPANY_TYPE.INDIVIDUAL_ENTERPRISE].includes(option.value),
      );
    }
    return COMPANY_TYPE_LIST;
  }, [kybType]);

  const handleInit = useCallback(async () => {
    if (loading) {
      return;
    }
    form.setFieldsValue(companyDetail);
    if (!companyDetail?.registrationCountry) {
      try {
        const { data, success } = await getUserArea();
        if (success && data.registrationCountry) {
          form.setFieldsValue({ registrationCountry: data.registrationCountry });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [loading, companyDetail]);

  const handleSubmit = async () => {
    if (submitLoading) {
      return;
    }
    trackClick(['ChooseVerify']);
    let res = null;
    try {
      res = await form.validateFields();
    } catch (err) {
      console.error(err);
      return;
    }
    trackClick(['selectCountryAndComType', 'continue'], {
      type: res.companyType,
    });
    if (
      companyDetail?.verifyFailReason?.companyType &&
      res.companyType === companyDetail?.companyType
    ) {
      message.error(_t('30de614421a74800aebc'));
      return;
    }
    try {
      setSubmitLoading(true);
      const { success } = await postCompanyNormal({
        ...res,
        currentPhase: 0,
        kybType,
      });
      if (!success) {
        throw res;
      }
      if (kybType === KYB_CERT_TYPES.KUCOIN_PAY) {
        push(`/account/kyb/certification?kybType=${KYB_CERT_TYPES.KUCOIN_PAY}`);
      } else {
        dispatch({ type: 'kyb/update', payload: { showMaterialList: true } });
        push('/account/kyb/home');
      }
    } catch (err) {
      console.error(err);
      message.error(err?.msg || err?.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    dispatch({ type: 'kyc/getKybCountries' });
    dispatch({ type: 'kyb/pullCompanyDetail' });
    kcsensorsManualExpose(['selectCountryAndComType', '1']);
  }, []);

  useEffect(() => {
    handleInit();
  }, [handleInit]);

  if (!Object.values(KYB_CERT_TYPES).includes(kybType)) {
    return null;
  }

  return (
    <Container>
      {kybType === KYB_CERT_TYPES.KUCOIN_PAY ? null : (
        <Back
          hasMarginLeft={false}
          onBack={() => {
            dispatch({ type: 'kyb/update', payload: { kybRedirect: false } });
            push('/account/kyc');
          }}
        />
      )}

      <Title>{_t('6d4b6b45cb494800ad24')}</Title>
      <Form form={form} initialValues={companyDetail}>
        <FormItemTitle>{_t('a0ff01d52f824000a117')}</FormItemTitle>
        <FormItemDescription>{_t('ad6685fbd18e4000adfa')}</FormItemDescription>
        <FormItem
          label={_t('cNg5brNKAigAH4CJBUxK94')}
          name="registrationCountry"
          rules={[{ required: true }]}
        >
          <CustomSelect
            options={countryOptions}
            size={size}
            allowSearch
            name="registrationCountry"
            onChange={() => {
              trackClick(['B1KYBVerifyProcess', 'Country']);
              trackClick(['selectCountryAndComType', 'country']);
            }}
          />
        </FormItem>
        <Box size={8} />
        <FormItemTitle>{_t('00fc9b3eeedc4000acd0')}</FormItemTitle>
        <FormItemDescription>{_t('7735f2938aaf4800ae50')}</FormItemDescription>
        <FormItem
          label={_t('1697d795cbef4800a8ad')}
          name="companyType"
          rules={[{ required: true }]}
        >
          <CustomSelect
            options={companyTypeOptions}
            size={size}
            name="companyType"
            onChange={(value) => {
              trackClick(['B1KYBVerifyProcess', 'CompanyType']);
              trackClick(['selectCountryAndComType', 'companyType'], {
                after_click_element_value: value,
              });
            }}
          />
        </FormItem>
        <Button
          size={isH5 ? 'basic' : 'large'}
          loading={loading || submitLoading}
          onClick={handleSubmit}
        >
          {_t('83fd14a4e1604000a696')}
          <ICArrowRight2Outlined />
        </Button>
      </Form>
    </Container>
  );
}

export default connect(({ kyb, loading }) => ({
  companyDetail: kyb?.companyDetail,
  loading: loading.effects['kyb/pullCompanyDetail'],
}))(withRouter()(KybSetup));
