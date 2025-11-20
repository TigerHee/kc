import React, {memo, useMemo} from 'react';

import {SharePostSceneType} from 'hooks/copyTrade/useShare/constant';
import {MY_COPY_RENDER_ITEM_TYPE} from '../constant';
import {useStore} from '../hooks/useStore';
import CurrentTradingProfit from '../TraderProfitComponents/CurrentTradingProfit';
import HistoryTradingProfit from '../TraderProfitComponents/HistoryTradingProfit';
import MyAttentionTraderInfoCard from './MyAttentionTraderInfoCard';
import {
  MyCopyCurrentPositionInfo,
  MyCopyHistoryPositionInfo,
} from './MyCopyPosition';
import {CopyTradeCardWrap} from './styles';

const MY_COPIES_CARD_BY_RENDER_TYPE_MAP = {
  [MY_COPY_RENDER_ITEM_TYPE.myPositionCurrent]: MyCopyCurrentPositionInfo,
  [MY_COPY_RENDER_ITEM_TYPE.myPositionHistory]: MyCopyHistoryPositionInfo,
  [MY_COPY_RENDER_ITEM_TYPE.myTradeCurrent]: CurrentTradingProfit,
  [MY_COPY_RENDER_ITEM_TYPE.myTradeHistory]: HistoryTradingProfit,
  [MY_COPY_RENDER_ITEM_TYPE.myAttention]: MyAttentionTraderInfoCard,
};

const MyCopyRenderCard = ({info, refetchCurList}) => {
  const {state} = useStore();
  const {renderCardType} = state;

  const Comp = useMemo(
    () => MY_COPIES_CARD_BY_RENDER_TYPE_MAP[renderCardType] || null,
    [renderCardType],
  );

  const isCurPosition =
    MY_COPY_RENDER_ITEM_TYPE.myPositionCurrent === renderCardType;

  return useMemo(
    () => (
      <CopyTradeCardWrap>
        <Comp
          info={info}
          sharePostScene={SharePostSceneType.MyCopy}
          refetchCurList={isCurPosition ? refetchCurList : undefined}
        />
      </CopyTradeCardWrap>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Comp, info],
  );
};

export default memo(MyCopyRenderCard);
