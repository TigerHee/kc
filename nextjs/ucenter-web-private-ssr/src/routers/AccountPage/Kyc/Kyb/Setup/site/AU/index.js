/**
 * Owner: tiger@kupotech.com
 */
import { Button, Form } from '@kux/mui';
import Back from 'components/Account/Kyc/common/components/Back';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from 'src/components/Account/Kyc/common/components/CustomSelect';
import ResidenceDialog from 'src/components/Account/Kyc/ResidenceDialog';
import { KYC_TYPE } from 'src/constants/kyc/enums';
import useKycCache from 'src/hooks/useKycCache';
import { _t } from 'src/tools/i18n';
import useCountryOptions from '../../../hooks/useCountryOptions';
import { ChooseContainer } from './styled';
import { push, replace } from '@/utils/router';

const { useForm, useWatch, FormItem } = Form;

export default () => {
  const dispatch = useDispatch();
  const { kybInfo = {} } = useSelector((state) => state.kyc ?? {});
  const [form] = useForm();
  const regionCode = useWatch('regionCode', form);
  const countryOptions = useCountryOptions();
  const needToChangeSite = regionCode !== 'AU';
  const [residenceDialogOpen, setResidenceDialogOpen] = useState(false);
  const [, pullCache, postCache] = useKycCache();

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      console.error(error);
      return;
    }
    if (needToChangeSite) {
      setResidenceDialogOpen(true);
      return;
    }
    try {
      const success = await postCache({
        type: KYC_TYPE.INSTITUTIONAL,
        region: values.regionCode,
      });
      if (success) push('/account/kyb/home');
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => push('/account/kyc');

  useEffect(() => {
    dispatch({ type: 'kyc/getKybCountries' });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { region, type } = await pullCache();
        if ((region && type === KYC_TYPE.INSTITUTIONAL) || kybInfo.verifyStatus !== -1) {
          replace('/account/kyb/home');
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [kybInfo]);

  return (
    <ChooseContainer>
      <Back hasMarginLeft={false} onClick={handleBack} />
      <h1 className="pageTitle">{_t('8837aa51d4a24800a4ab')}</h1>
      <div className="formItemDesc">{_t('11f16647fabf4000aba4')}</div>
      <Form form={form}>
        <FormItem
          name="regionCode"
          label={_t('cNg5brNKAigAH4CJBUxK94')}
          rules={[{ required: true, message: _t('3bd2f2b960d14800a155') }]}
        >
          <CustomSelect
            name="regionCode"
            options={countryOptions}
            size="xlarge"
            allowSearch
            value={regionCode}
            disabled={false}
          />
        </FormItem>
      </Form>
      <Button size="large" fullWidth onClick={handleSubmit}>
        {_t('6Rwtu47WMHudsXue7tgH3h')}
      </Button>
      <ResidenceDialog
        open={residenceDialogOpen}
        regionCode={regionCode}
        shouldAlert
        onCancel={() => setResidenceDialogOpen(false)}
      />
    </ChooseContainer>
  );
};
