/**
 * Owner: solar@kupotech.com
 */
import { Form } from '@kux/mui';
import { useMemo } from 'react';
import { useUnifiedStatus } from '@transfer/hooks/unified';
import { getInitDirection } from '@transfer/constants';
import { useTransferDispatch } from '../../utils/redux';
import { FormContext } from '../Form/form';
import { useProps } from '../../hooks/props';
import { genProcessAccount } from '../../utils/accounts';

export default function FormProvider({ children }) {
  const [form] = Form.useForm();
  const dispatchTransfer = useTransferDispatch();
  const { isUnifiedMode } = useUnifiedStatus();

  const INIT_DIRECTION = useMemo(() => getInitDirection(isUnifiedMode), [isUnifiedMode]);

  // 通过defaultProps传入的默认配置
  const {
    payAccountType = INIT_DIRECTION[0][0],
    recAccountType = INIT_DIRECTION[1][0],
    currency,
    payTag,
    recTag,
  } = useProps((state) => state.fieldsDefault);
  const adaptUnified = useProps((state) => state.adaptUnified);

  const processAccount = genProcessAccount(adaptUnified, isUnifiedMode);

  const initialValues = useMemo(() => {
    return {
      payAccountType: processAccount(payAccountType),
      recAccountType: processAccount(recAccountType),
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
