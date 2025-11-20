/**
 * owner: larvide.peng@kupotech.com
 */
import useRequest from 'src/hooks/useRequest';


const usePullHistory = (method, option = {}) => {
  return useRequest(method, {
    manual: true,
    ...option,
    onSuccess: ({ success, items }) => {
      if (!success) return;
      return items;
    },
  });
};

export default usePullHistory;
