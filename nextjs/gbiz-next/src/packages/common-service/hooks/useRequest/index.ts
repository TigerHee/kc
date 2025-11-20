/*
 * @owner: borden@kupotech.com
 */
import useRequestImplement from './useRequestImplement';
import useRetryPlugin from './plugins/useRetryPlugin';
import useCachePlugin from './plugins/useCachePlugin';
import useThrottledPlugin from './plugins/useThrottledPlugin';

export default function useRequest(
  service: any,
  options: any,
  plugins: any = []
): any {
  return useRequestImplement(service, options, [
    ...(plugins || []),
    useThrottledPlugin,
    useCachePlugin,
    useRetryPlugin,
  ]);
}
