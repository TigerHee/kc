/**
 * Owner: tiger@kupotech.com
 */
import { useContext } from 'react';
import { CommonContext } from '../context';

export default () => {
  const commonData = useContext(CommonContext);
  return commonData;
};
