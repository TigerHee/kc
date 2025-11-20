import { Box, Button, Form, styled, useResponsive } from '@kux/mui';
import Back from 'components/Account/Kyc/common/components/Back';
import { useEffect, useState } from 'react';
import CustomSelect from 'src/components/Account/Kyc/common/components/CustomSelect';
import ResidenceDialog from 'src/components/Account/Kyc/ResidenceDialog';
import createResponsiveMarginCss from 'src/components/Account/Kyc/utils/createResponsiveMarginCss';
import { tenantConfig } from 'src/config/tenant';
import { _t } from 'src/tools/i18n';

const { useForm, FormItem, useWatch } = Form;

const Container = styled.div`
  ${({ theme }) => createResponsiveMarginCss(theme)};
`;
const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 580px;
`;
const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  margin-top: 48px;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
`;
const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  margin-top: 4px;
  font-size: 16px;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
`;
export default ({
  siteType = tenantConfig.kyc.siteRegion,
  initData = {},
  countries,
  loading,
  onSubmit,
  canBack = true,
  backText,
  onBack,
}) => {
  const [form] = useForm();
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const size = isH5 ? 'large' : 'xlarge';
  const regionCode = useWatch('regionCode', form);
  const needToChangeSite =
    tenantConfig.kyc.onlySupportCurrentRegion &&
    countries.find((c) => c.value === regionCode)?.siteType !== siteType;
  const [residenceDialogOpen, setResidenceDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (loading) {
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

  useEffect(() => {
    form.setFieldsValue(initData);
  }, []);

  return (
    <Container>
      <Wrapper>
        {canBack ? <Back hasMarginLeft={false} backText={backText} onClick={onBack} /> : null}

        <Title>{_t('b0614d49b7ae4800ab38')}</Title>
        <Desc>{_t('edf4b9a779f34800a526')}</Desc>
        <Box size={64} />
        <Form form={form}>
          <FormItem
            name="regionCode"
            rules={[{ required: true, message: _t('3bd2f2b960d14800a155') }]}
          >
            <CustomSelect name="regionCode" options={countries} size={size} allowSearch />
          </FormItem>
        </Form>
        <Box size={16} />
        <Button fullWidth size="large" onClick={handleSubmit}>
          {_t('5dad5f1f450e4000a437')}
        </Button>
        {tenantConfig.kyc.onlySupportCurrentRegion ? (
          <ResidenceDialog
            open={residenceDialogOpen}
            regionCode={regionCode}
            shouldAlert
            onCancel={() => setResidenceDialogOpen(false)}
          />
        ) : null}
      </Wrapper>
    </Container>
  );
};
