import React from 'react';

import {FormLabelRequiredText, FormLabelText, FormLabelWrap} from './styles';

const FormLabel = ({required, children}) => {
  return (
    <FormLabelWrap>
      <FormLabelText>
        {!!required && <FormLabelRequiredText>* </FormLabelRequiredText>}
        {children}
      </FormLabelText>
    </FormLabelWrap>
  );
};

export default FormLabel;
