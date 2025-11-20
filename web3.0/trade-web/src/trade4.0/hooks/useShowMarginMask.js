/**
 * Owner: Ray.Lee@kupotech.com
 */
import { useSelector } from 'dva';
import { useTradeType } from '@/hooks/common/useTradeType';
import { checkIsMargin } from '@/meta/tradeTypes';
import MarginMask from '@/pages/Portal/MarginMask';

/**
 * 未开通杠杆，展示 开通杠杆遮罩
 */
const useShowMarginMask = () => {
  const tradeType = useTradeType();

  const userPosition = useSelector((state) => state.marginMeta.userPosition);
  const isNotOpenMargin = userPosition?.openFlag === false;
  const showMarginMask = checkIsMargin(tradeType) && isNotOpenMargin;

  if (showMarginMask) {
    return MarginMask;
  }
  return null;
};

export default useShowMarginMask;
