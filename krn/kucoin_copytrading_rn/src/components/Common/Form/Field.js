import React, {memo, useMemo} from 'react';
import {useController, useFormContext} from 'react-hook-form';
import {View} from 'react-native';
import styled from '@emotion/native';

import {RowWrap} from 'constants/styles';
import FormLabel from './FormLabel';
import {LabelLengthText} from './styles';

const ErrorMessage = styled.Text`
  color: ${({theme}) => theme.colorV2.secondary};
  font-size: 12px;
  margin-top: 8px;
`;

const FormField = ({
  name = '',
  label,
  rules,
  children,
  hiddenErrorMsg = false,
  maxLength,
  style,
  styles = {},
}) => {
  const {control} = useFormContext();

  const controller = useController({
    name,
    control,
    rules,
  });
  const {
    field: {onChange, onBlur, value},
    fieldState: {error},
  } = controller;
  const isRequired = rules?.required;
  const maxLengthValid = maxLength > 0;

  const memoizedChildren = useMemo(() => {
    return (
      children?.({
        onChange,
        onBlur,
        value,
        error,
      }) || null
    );
  }, [children, error, onBlur, onChange, value]);

  return (
    <View style={style}>
      {label && !React.isValidElement(label) ? (
        <RowWrap>
          <FormLabel required={isRequired}>{label}</FormLabel>
          {maxLengthValid && (
            <LabelLengthText>
              ({value?.length || 0}/{maxLength})
            </LabelLengthText>
          )}
        </RowWrap>
      ) : label ? (
        label
      ) : null}
      {/* 子组件实际上是受控的输入组件 */}

      {memoizedChildren}

      {!hiddenErrorMsg && error && (
        <ErrorMessage style={styles.errorStyle}>{error.message}</ErrorMessage>
      )}
    </View>
  );
};

export default memo(FormField);
