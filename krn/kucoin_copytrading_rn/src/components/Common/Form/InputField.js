import React, {memo} from 'react';

import Input from '../Input';
import FormField from './Field';

const InputField = ({
  name,
  label,
  hiddenErrorMsg,
  rules,
  placeholder,
  style,
  maxLength,
  ...rest
}) => {
  return (
    <FormField
      style={style}
      name={name}
      rules={rules}
      label={label}
      maxLength={maxLength}
      hiddenErrorMsg={hiddenErrorMsg}>
      {({error, ...register}) => (
        <Input
          {...rest}
          {...register}
          maxLength={maxLength}
          colorType={error && 'error'}
          placeholder={placeholder}
        />
      )}
    </FormField>
  );
};

export default memo(InputField);
