/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Form } from '@kux/mui';
import CustomSelect from 'src/components/Account/Kyc/common/components/CustomSelect';
import { TOTAL_FIELD_INFOS } from 'routes/AccountPage/Kyc/config';
import useRules from '../hooks/useRules';

const SelectField = ({
  name,
  size,
  help,
  required = true,
  allowSearch,
  options = [],
  formData,
}) => {
  const { companyType } = formData ?? {};
  const label = TOTAL_FIELD_INFOS[name]?.title?.({ companyType });
  const rules = useRules({ name, required, formData });

  return (
    <Form.FormItem label={label} name={name} help={help} rules={rules}>
      <CustomSelect
        size={size}
        value={formData?.[name]}
        allowSearch={allowSearch}
        options={options}
      />
    </Form.FormItem>
  );
};

export default SelectField;
