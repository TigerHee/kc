/**
 * Owner: Ray.Lee@kupotech.com
 */
import {useSelector} from 'react-redux';

const useMarginMarkMap = (orderType = 'MARKET') => {
  const marginMarkMap = useSelector(state => state.convert.marginMarkMap);
  const limitMarginMarkMap = useSelector(
    state => state.convert.limitMarginMarkMap,
  );

  return orderType === 'MARKET' ? marginMarkMap : limitMarginMarkMap;
};

export default useMarginMarkMap;
