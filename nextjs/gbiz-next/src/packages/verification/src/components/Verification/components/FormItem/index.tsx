/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Form, IFormItemProps } from '@kux/design';
import { useMemo } from 'react';
import useLang from '../../../../hooks/useLang';
import { useVerification } from '../../model';

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

interface InnerFormItemProps extends IFormItemProps {
  initialValue?: Record<string, string>;
}

export default function InnerFormItem(props: InnerFormItemProps) {
  const { label, name, children, initialValue, help, rules = [], ...restProps } = props;
  const { formError } = useVerification();
  const { t } = useLang();
  const commonRules = useMemo(
    () => [
      {
        validator: (_rule, _value, callback) => {
          if (formError[name as string]) {
            callback(new Error(formError[name as string]));
          } else {
            callback();
          }
        },
      },
      {
        required: true,
        message: t('form.required'),
      },
    ],
    [formError, name],
  );
  return (
    <OriginFormItem
      label={<div>{label}</div>}
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
