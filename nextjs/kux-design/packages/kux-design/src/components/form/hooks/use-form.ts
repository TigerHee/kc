/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { useForm as useRcForm } from 'rc-field-form';
import { toArray } from '../utils/array-utils';

function toNamePathStr(name: string | string[]): string {
  const namePath = toArray(name);
  return namePath.join('_');
}

export default function useForm(form?: any) {
  const [rcForm] = useRcForm();
  const itemsRef = React.useRef<Record<string, any>>({});

  const wrapForm = React.useMemo(
    () =>
      form ?? {
        ...rcForm,
        __INTERNAL__: {
          itemRef: (name: string | string[]) => (node: any) => {
            const namePathStr = toNamePathStr(name);
            if (node) {
              itemsRef.current[namePathStr] = node;
            } else {
              delete itemsRef.current[namePathStr];
            }
          },
        },
        getFieldInstance: (name: string | string[]) => {
          const namePathStr = toNamePathStr(name);
          return itemsRef.current[namePathStr];
        },
      },
    [form, rcForm],
  );

  return [wrapForm];
} 