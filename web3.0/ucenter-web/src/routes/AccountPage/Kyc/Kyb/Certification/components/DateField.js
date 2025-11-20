/**
 * Owner: vijay.zhou@kupotech.com
 */
import { DatePicker, Form } from '@kux/mui';
import moment from 'moment';
import { TOTAL_FIELD_INFOS } from 'src/routes/AccountPage/Kyc/config';
import useRules from '../hooks/useRules';

const DateField = ({ name, size, help, required = true, disabled = false, formData }) => {
  const { companyType } = formData ?? {};
  const label = TOTAL_FIELD_INFOS[name]?.title?.({ companyType });
  const rules = useRules({ name, required, formData });

  const isValid = moment.isMoment(formData?.[name]) && formData[name].isValid();
  return (
    <Form.FormItem label={label} name={name} help={help} rules={rules}>
      <DatePicker
        size={size}
        defaultValue={isValid ? formData?.[name] : moment()}
        disabled={disabled}
      />
    </Form.FormItem>
  );
};

export default DateField;
