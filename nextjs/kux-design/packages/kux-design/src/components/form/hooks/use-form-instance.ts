/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { FormContext } from '../context/form-context';

export default function useFormInstance() {
  const { form } = React.useContext(FormContext);
  return form;
} 