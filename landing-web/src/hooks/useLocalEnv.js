/**
 * Owner: melon@kupotech.com
 */
import { useEventCallback } from '@kux/mui/hooks';

const useLocalEnv = () => {
  const { hostname } = window.location;
  return !!hostname?.match('localhost');
};
export default useLocalEnv;
