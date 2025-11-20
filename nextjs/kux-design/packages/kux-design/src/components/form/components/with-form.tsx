/**
 * Owner: victor.ren@kupotech.com
 */
import { FormInstance } from 'rc-field-form';
import { Form } from './form';
import { IWithFormOptions, WithFormComponent, WithFormReturn } from '../types/index';

export function withForm<P = any, V = any>(options: IWithFormOptions): WithFormReturn<P, V> {
  return (Comp: WithFormComponent<P, V>) => {
    return (props: P) => {
      return (
        <Form {...options}>
          {(values: V, form: FormInstance<V>) => {
            return <Comp {...props} values={values} form={form} />;
          }}
        </Form>
      );
    };
  };
} 