/**
 * Owner: solar@kupotech.com
 */
import { Form } from '@kux/mui';
import { useCallback } from 'react';
import { useFormInstance } from '../containers/Form/form';

/**
 * payAccountType
 * recAccountType
 * currency
 * amount
 * payTag
 * recTag
 */

// 表单项都用watch，方便watch
export function useFormField(field) {
  const form = useFormInstance();
  return Form.useWatch(field, form);
}
// 强制表单项改变值
export function useForceFormFieldChange() {
  const form = useFormInstance();
  return useCallback((getValues) => {
    form.setFieldsValue(getValues(form.getFieldsValue()));
  }, []);
}
