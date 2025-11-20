/**
 * Owner: tiger@kupotech.com
 */
import { Input } from '@kux/mui';
import { useMemo, useEffect, useRef } from 'react';
import CommonSelect from '../CommonSelect';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default ({ relationInputToSelectList, ...otherProps }) => {
  const { form, name, complianceMetaCode } = otherProps;

  const isRenderSelect = useMemo(() => {
    return relationInputToSelectList.includes(complianceMetaCode);
  }, [relationInputToSelectList, complianceMetaCode]);

  const prevIsRenderSelect = usePrevious(isRenderSelect);

  useEffect(() => {
    if (prevIsRenderSelect !== undefined && prevIsRenderSelect !== isRenderSelect) {
      form.setFieldsValue({ [name]: '' });
    }
  }, [isRenderSelect, prevIsRenderSelect]);

  return isRenderSelect ? <CommonSelect {...otherProps} /> : <Input {...otherProps} />;
};
