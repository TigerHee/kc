/**
 * Owner: solar@kupotech.com
 */
import React, { createContext, useContext } from 'react';

export const FormContext = createContext();

export function useFormInstance() {
  return useContext(FormContext);
}
