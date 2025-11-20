/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Form, Input } from '@kux/mui';
import { TOTAL_FIELD_INFOS } from 'routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';
import useRules from '../hooks/useRules';

const TextField = ({ name, size, help, required = true, form, formData }) => {
  const { companyType } = formData ?? {};
  const label = TOTAL_FIELD_INFOS[name]?.title?.({ companyType });
  const rules = useRules({ name, required, formData });

  return (
    <Form.FormItem
      label={`${label} ${!required ? _t('bce448f70a354000a28c') : ''}`}
      name={name}
      help={help}
      rules={rules}
    >
      <Input size={size} defaultValue={formData?.[name]} />
    </Form.FormItem>
  );
};

export default TextField;
