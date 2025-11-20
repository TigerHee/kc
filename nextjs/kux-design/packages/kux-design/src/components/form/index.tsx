/**
 * Owner: victor.ren@kupotech.com
 *
 * @description Form component
 */

import './style.scss';

export { FormProvider, useWatch } from 'rc-field-form';
export { Form } from './components/form';
export { FormItem } from './components/form-item';
export { withForm } from './components/with-form';
export { default as useForm } from './hooks/use-form';
export { default as useFormInstance } from './hooks/use-form-instance';

export type {
  IFormProps,
  IFormItemProps,
  IWithFormOptions,
  WithFormComponent,
  WithFormReturn,
  WithFormComponentProps,
} from './types/index';
