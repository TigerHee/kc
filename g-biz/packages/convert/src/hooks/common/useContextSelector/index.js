/*
 * @owner: borden@kupotech.com
 */
import { storeContext } from '../../../config';
import useContextSelector from './useContextSelector';

export default (selector) => {
  return useContextSelector(storeContext, selector);
};
