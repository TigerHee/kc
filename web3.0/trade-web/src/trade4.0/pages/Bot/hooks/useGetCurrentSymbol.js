/*
 * owner: borden@kupotech.com
 */
import { useSelector } from 'dva';

export default () => {
  return useSelector((state) => state.BotStatus.currentSymbol);
};
