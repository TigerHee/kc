/*
 * @owner: june.lee@kupotech.com
 */
import { createContext } from 'react';
import useContextSelector from '../../../hooks/common/useContextSelector/useContextSelector';
import createSelectorProvider from '../../../hooks/common/useContextSelector/createSelectorProvider';

const propsContext = createContext({});
export const SelectorProvider = createSelectorProvider(propsContext);

export default function usePropsSelector(selector) {
  return useContextSelector(propsContext, selector);
}
