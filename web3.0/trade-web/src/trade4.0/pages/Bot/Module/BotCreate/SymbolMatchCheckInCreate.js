/**
 * Owner: mike@kupotech.com
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { isSymbolMatchByBotId } from 'Bot/config';

export default React.memo((props) => {
  const botMatchSymbolMap = useSelector((state) => state.BotApp.botMatchSymbolMap);
  const strategy = useSelector((state) => state.BotStatus.strategy);
  const currentSymbol = useSelector((state) => state.BotStatus.currentSymbol);
  const isMatch = isSymbolMatchByBotId(strategy.id, currentSymbol, botMatchSymbolMap);
  const dispatch = useDispatch();
  useEffect(() => {
    // 创建中发生不匹配直接切换到策略列表
    if (!isMatch) {
      dispatch({
        type: 'BotStatus/backList',
      });
    }
  }, [isMatch]);
  return props.children;
});
