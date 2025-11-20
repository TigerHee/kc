/**
 * Owner: garuda@kupotech.com
 */

import React from 'react';

import AdvancedForm from './AdvancedForm';
import AdvancedLimit from './AdvancedLimit';
import HiddenLimit from './HiddenLimit';
import Limit from './Limit';
import Market from './Market';
import Stop from './Stop';

import {
  ADVANCED_LIMIT,
  HIDDEN_LIMIT,
  LIMIT,
  MARKET,
  STOP,
  STOP_LIMIT,
  STOP_MARKET,
} from '../config';
import { useGetActiveTab } from '../hooks/useGetData';

const CONTENT_MAP = {
  [LIMIT]: () => <Limit />,
  [MARKET]: () => <Market />,
  [STOP]: () => <AdvancedForm />,
  [STOP_LIMIT]: () => <Stop />,
  [STOP_MARKET]: () => <Stop />,
  [ADVANCED_LIMIT]: () => <AdvancedLimit />,
  [HIDDEN_LIMIT]: () => <HiddenLimit />,
};

const FormCont = () => {
  const { activeTab } = useGetActiveTab();

  return CONTENT_MAP[activeTab] ? CONTENT_MAP[activeTab]() : null;
};

export default React.memo(FormCont);
