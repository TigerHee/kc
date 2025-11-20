/**
 * Owner: garuda@kupotech.com
 */
import React, { useMemo } from 'react';

import AdvancedLimit from './AdvancedLimit';
import HiddenLimit from './HiddenLimit';
import Stop from './Stop';

import { STOP_LIMIT, STOP_MARKET, ADVANCED_LIMIT, HIDDEN_LIMIT } from '../config';
import { useGetActiveTab } from '../hooks/useGetData';

const AdvancedCont = {
  [STOP_LIMIT]: Stop,
  [STOP_MARKET]: Stop,
  [ADVANCED_LIMIT]: AdvancedLimit,
  [HIDDEN_LIMIT]: HiddenLimit,
};

const AdvancedForm = (props) => {
  const { stopOrderType } = useGetActiveTab();

  const FormComponent = useMemo(() => {
    return AdvancedCont[stopOrderType] || null;
  }, [stopOrderType]);

  if (!FormComponent) return null;
  return <FormComponent {...props} />;
};

export default React.memo(AdvancedForm);
