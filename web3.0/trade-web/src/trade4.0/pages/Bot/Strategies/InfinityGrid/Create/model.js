/**
 * Owner: mike@kupotech.com
 */
import { createContext, useContext } from 'react';
import useFormCommonModel from 'Bot/hooks/useFormCommonModel.js';

const ContextOfCreatePage = createContext(null);

export const Provider = useFormCommonModel(ContextOfCreatePage);

export const useModel = () => useContext(ContextOfCreatePage);
