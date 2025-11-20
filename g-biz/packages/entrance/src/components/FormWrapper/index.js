/**
 * Owner: iron@kupotech.com
 */
import React, { useRef, useState, useCallback } from 'react';
import each from 'lodash/each';

function FormWrapper(params = {}) {
  return (Component) => {
    function Wrapper(props) {
      const formRef = useRef(null);
      const [canFormSubmit, setCanFormSubmit] = useState(false);
      const onFormChange = useCallback(() => {
        if (formRef.current && formRef.current.form) {
          const ifHasError = Object.values(formRef.current.form.getFieldsError()).some((v) => v);
          if (ifHasError) {
            setCanFormSubmit(false);
            return;
          }
          // 校验值是否输入完全
          const values = formRef.current.form.getFieldsValue();
          const { excludeKey } = params || {};
          if (excludeKey && excludeKey.length) {
            each(excludeKey, (key) => {
              delete values[key];
            });
          }
          const _canFormSubmit = !Object.values(values).some((v) => !v);
          if (canFormSubmit !== _canFormSubmit) {
            setCanFormSubmit(_canFormSubmit);
          }
        }
      }, [canFormSubmit]);
      return (
        <>
          <Component
            {...props}
            canFormSubmit={canFormSubmit}
            wrappedComponentRef={formRef}
            onFormChange={onFormChange}
          />
        </>
      );
    }
    return Wrapper;
  };
}

export default FormWrapper;
