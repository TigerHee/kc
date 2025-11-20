/**
 * Owner: iron@kupotech.com
 */
import { useDispatch } from 'react-redux';
import securityVerify from './securityVerify';

export default () => {
  const dispatch = useDispatch();
  return securityVerify(dispatch);
};
