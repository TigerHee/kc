/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import { KuFoxFormContext } from '../aux';

export default function useFormInstance() {
  const { form } = React.useContext(KuFoxFormContext);
  return form;
}
