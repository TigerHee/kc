/*
 * @owner: borden@kupotech.com
 */
import { useDispatch } from 'dva';
import { useRequest as useAhookRequest } from 'ahooks';
import showError from 'src/dvaHooks/showError';

const defaultFormatResponse = (res) => res;

export default function useRequest(service, options) {
  const dispatch = useDispatch();
  const { onError, ...other } = options || {};

  return useAhookRequest(async () => {
    const res = await service();
    const formatResult = options?.formatResult || defaultFormatResponse;
    return formatResult(res);
  }, {
    onError: (error) => {
      const errorHandler = () => {
        showError().onError(
          { ...error, ...error?.responseJson || null },
          dispatch,
        );
      };
      if (typeof onError === 'function') {
        onError(error, errorHandler);
      } else {
        errorHandler();
      }
    },
    ...other,
  });
}
