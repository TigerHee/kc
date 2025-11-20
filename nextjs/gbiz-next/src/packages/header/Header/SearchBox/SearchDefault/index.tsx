/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect } from 'react';
import clsx from 'clsx';
import History from './History';
import Hot from './Hot';
import Trend from './Trend';
import Futures from './Futures';
import Earn from './Earn';
import { useHeaderStore } from '../../model';
import styles from './styles.module.scss';
import { useCommonService } from 'packages/header/hookTool/useCommonService';

export default props => {
  const { inDrawer, miniMode, inTrade, visible } = props;
  const hotRecommend = useHeaderStore(state => state.hotRecommend);
  const aggregatedRecommend = useHeaderStore(state => state.aggregatedRecommend);
  const pullFuturesSymbols = useHeaderStore(state => state.pullFuturesSymbols);
  // const getCoinsCategory = useHeaderStore(state => state.getCoinsCategory);
  const pullMarginSymbols = useHeaderStore(state => state.pullMarginSymbols);
  const recommendSpot = useHeaderStore(state => state.recommendSpot);
  const recommendAggregated = useHeaderStore(state => state.recommendAggregated);
  const { pullCurrencies, pullSymbols } = useCommonService();

  useEffect(() => {
    if (visible) {
      pullSymbols();
      pullFuturesSymbols?.();
      pullCurrencies(); // 币种信息，头像
      pullMarginSymbols?.();
      recommendSpot?.();
      recommendAggregated?.();
    }
  }, [visible]);

  return (
    <div
      className={clsx(styles.container, {
        [styles.containerInDrawer]: inDrawer,
        [styles.containerInTrade]: !inDrawer && inTrade,
        [styles.containerMiniMode]: !inDrawer && !inTrade && miniMode,
      })}
      data-inspector="inspector_header_search_default"
    >
      <div className={clsx(styles.boxWrapper, inDrawer && styles.boxWrapperInDrawer)}>
        <History {...props} />
        {hotRecommend ? <Hot data={hotRecommend} {...props} /> : null}
        <Trend data={aggregatedRecommend} {...props} />
        <Futures data={aggregatedRecommend} {...props} />
        <Earn data={aggregatedRecommend} {...props} />
      </div>
    </div>
  );
};
