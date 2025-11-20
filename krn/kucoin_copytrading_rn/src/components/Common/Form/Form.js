//TODO 可能会移除 ，应该采用 react-form-hook + 非受控设计 理论上不需要再次封装formProvider
import React, {memo} from 'react';
import {FormProvider} from 'react-hook-form';
import {View} from 'react-native';

const Form = ({children, style, formMethods}) => {
  return (
    <FormProvider {...formMethods}>
      <View style={style}>{children}</View>
    </FormProvider>
  );
};

export default memo(Form);
