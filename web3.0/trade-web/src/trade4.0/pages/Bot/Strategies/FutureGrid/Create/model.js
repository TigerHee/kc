/**
 * Owner: mike@kupotech.com
 */
import { createContext, useContext } from 'react';
import useFormCommonModel from 'Bot/hooks/useFormCommonModel.js';

const ContextOfCreatePage = createContext(null);

export const Provider = useFormCommonModel(ContextOfCreatePage, {
  direction: 'short',
  leverage: 1,
});

export const useModel = () => useContext(ContextOfCreatePage);
