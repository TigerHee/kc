/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { useForm as useRcForm } from 'rc-field-form';
import { toArray } from '../aux';

function toNamePathStr(name) {
  const namePath = toArray(name);
  return namePath.join('_');
}
export default function useForm(form) {
  const [rcForm] = useRcForm();
  const itemsRef = React.useRef({});

  const wrapForm = React.useMemo(
    () =>
      form ?? {
        ...rcForm,
        __INTERNAL__: {
          itemRef: (name) => (node) => {
            const namePathStr = toNamePathStr(name);
            if (node) {
              itemsRef.current[namePathStr] = node;
            } else {
              delete itemsRef.current[namePathStr];
            }
          },
        },
        getFieldInstance: (name) => {
          const namePathStr = toNamePathStr(name);
          return itemsRef.current[namePathStr];
        },
      },
    [form, rcForm],
  );

  return [wrapForm];
}
