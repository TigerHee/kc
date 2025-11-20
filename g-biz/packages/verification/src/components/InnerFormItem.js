/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Form } from '@kux/mui';
import { useContext, useMemo } from 'react';
import { FormItemLabel } from './commonUIs';
import FormContext from '../utils/formContext';
import useLang from '../hooks/useLang';

const { FormItem: OriginFormItem } = Form;

const formItemLayout = {
  required: false,
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

export default function InnerFormItem(props) {
  const { label, name, children, initialValue, help, rules = [], ...restProps } = props;
  const { formError } = useContext(FormContext);
  const { _t } = useLang();
  const commonRules = useMemo(
    () => [
      {
        validator: (_rule, _value, callback) => {
          if (formError[name]) {
            callback(new Error(formError[name]));
          } else {
            callback();
          }
        },
      },
      {
        required: true,
        message: _t('form.required'),
      },
    ],
    [formError, name],
  );
  return (
    <OriginFormItem
      label={<FormItemLabel>{label}</FormItemLabel>}
      name={name}
      validateStatus="success"
      initialValue={initialValue}
      help={help}
      rules={[...commonRules, ...rules]}
      validateTrigger={['onSubmit']}
      validateFirst
      {...formItemLayout}
      {...restProps}
    >
      {children}
    </OriginFormItem>
  );
}
