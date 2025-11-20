import { createContext } from 'react';

const FormContext = createContext({
  form: null,
  formData: {},
  formError: {},
  bizType: '',
  transactionId: '',
});

export default FormContext;
