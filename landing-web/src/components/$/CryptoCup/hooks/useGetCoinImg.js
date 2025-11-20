/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector } from 'dva';

function useGetCoinImg() {
  const categories = useSelector(state => state.categories);

  return {
    categories,
    getIconUrl: code => {
      return categories[code]?.iconUrl || '';
    },
  };
}

export default useGetCoinImg;
