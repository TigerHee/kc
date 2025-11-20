/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-17 21:05:55
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-06-26 17:58:41
 * @FilePath: /trade-web/src/trade4.0/pages/Markets/components/common/List.js
 * @Description:
 */
import React from 'react';
import VirtualizedList from 'src/trade4.0/components/VirtualizedList/react-window-virtual';
import Empty from '@mui/Empty';
import Item from './Item';
import { styled, fx, colors, withMedia } from '@/style/emotion';
import { FlexColumm, TextOverFlow } from '@/style/base';
import { useSelector, useDispatch } from 'dva';
import Spin from '@mui/Spin';
import { useIsRTL } from '@/hooks/common/useLang';

export const ListWrapper = styled(FlexColumm)`
  ${fx.position('relative')}
  ${fx.flex(1)}
  ${fx.overflow('hidden')}
`;

const List = (props) => {
  const isRTL = useIsRTL();
  const fetchLoadingSwitch = useSelector(state => state.tradeMarkets.fetchLoadingSwitch);
  const isByAreaLoading = useSelector(
    (state) => state.loading.effects['tradeMarkets/pullMarketRecordsByArea'],
  );
  const isBySymbolsLoading = useSelector(
    (state) => state.loading.effects['tradeMarkets/pullRecordsBySymbols'],
  );
  // 控制点击收藏的按钮时，不需要展示loading效果
  if (fetchLoadingSwitch && (isByAreaLoading || isBySymbolsLoading)) {
    return <Spin style={{ height: '100%' }} />;
  }

  return (
    <ListWrapper>
      {props?.items?.length === 0 ? (
        <Empty />
      ) : (
        <VirtualizedList
          direction={isRTL ? 'rtl' : 'ltr'}
          props={props}
          itemHeight={44}
          itemCount={props.items.length}
          render={Item}
        />
      )}
    </ListWrapper>
  );
};

export default React.memo(List);
