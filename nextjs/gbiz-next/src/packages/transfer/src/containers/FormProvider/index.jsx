/**
 * Owner: solar@kupotech.com
 */
import { Form } from '@kux/mui';
import { useMemo } from 'react';
import { useTransferDispatch } from '../../utils/redux';
import { FormContext } from '../Form/form';
import { useProps } from '../../hooks/props';
import { DEFAULT_CURRENCY, INIT_DIRECTION } from '../../constants';

export default function FormProvider({ children }) {
  const [form] = Form.useForm();
  const dispatchTransfer = useTransferDispatch();

  // 通过defaultProps传入的默认配置
  const { payAccountType, recAccountType, currency, payTag, recTag } = useProps(
    (state) => state.fieldsDefault,
  );
  const initialValues = useMemo(() => {
    return {
      payAccountType,
      recAccountType,
      currency,
      payTag: payTag || '',
      recTag: recTag || '',
    };
  }, []);
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFieldsChange={(_, allFields) => {
        const hasError = allFields.some((field) => field.errors.length > 0);
        dispatchTransfer({
          type: 'update',
          payload: {
            hasError,
          },
        });
      }}
    >
      <FormContext.Provider value={form}>{children}</FormContext.Provider>
    </Form>
  );
}
