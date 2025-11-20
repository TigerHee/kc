import React, {memo, useMemo} from 'react';

import {SharePostSceneType} from 'hooks/copyTrade/useShare/constant';
import {MY_LEADING_RENDER_ITEM_TYPE} from '../constant';
import {useStore} from '../hooks/useStore';
import MyFollowerItem from './MyFollowerItem';
import {
  MyLeadCurrentPositionInfo,
  MyLeadHistoryPositionInfo,
} from './MyLeadPositionInfo';
import {CopyTradeCardWrap} from './styles';

const MY_LEAD_CARD_BY_RENDER_TYPE_MAP = {
  [MY_LEADING_RENDER_ITEM_TYPE.myPositionCurrent]: MyLeadCurrentPositionInfo,
  [MY_LEADING_RENDER_ITEM_TYPE.myPositionHistory]: MyLeadHistoryPositionInfo,
  [MY_LEADING_RENDER_ITEM_TYPE.myFollower]: MyFollowerItem,
};

const MyLeadingRenderCard = ({info, refetchCurList}) => {
  const {state} = useStore();
  const {renderCardType} = state;

  const Comp = useMemo(
    () => MY_LEAD_CARD_BY_RENDER_TYPE_MAP[renderCardType],
    [renderCardType],
  );

  const isCurPosition =
    renderCardType === MY_LEADING_RENDER_ITEM_TYPE.myPositionCurrent;

  return useMemo(
    () => (
      <CopyTradeCardWrap>
        {!!Comp && (
          <Comp
            info={info}
            sharePostScene={SharePostSceneType.MyLead}
            refetchCurList={isCurPosition ? refetchCurList : undefined}
          />
        )}
      </CopyTradeCardWrap>
    ),
    [Comp, info, isCurPosition, refetchCurList],
  );
};

export default memo(MyLeadingRenderCard);
