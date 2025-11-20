/*
 * @owner: borden@kupotech.com
 */
import { useRequest as useAhookRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import showError from 'src/plugins/showError';

const defaultFormatResponse = (res) => res;

export default function useRequest(service, options) {
  const dispatch = useDispatch();
  const { onError, ...other } = options || {};

  return useAhookRequest(
    async (...rest) => {
      const res = await service(...rest);
      const formatResult = options?.formatResult || defaultFormatResponse;
      return formatResult(res);
    },
    {
      onError: (error) => {
        const errorHandler = () => {
          showError({ ...error, ...(error?.responseJson || null) }, dispatch);
        };
        if (typeof onError === 'function') {
          onError(error, errorHandler);
        } else {
          errorHandler();
        }
      },
      ...other,
    },
  );
}
