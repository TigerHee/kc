/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { namespace } from '../../model';
import { useCommonService } from '../../../components/CommonServiceProvider';
import History from './History';
import Hot from './Hot';
import Trend from './Trend';
import Futures from './Futures';
import Earn from './Earn';
import { BoxWrapper, Container } from './styled';

export default (props) => {
  const { inDrawer, miniMode, inTrade, visible } = props;
  const dispatch = useDispatch();
  const { pullCurrencies, pullSymbols } = useCommonService();
  const { hotRecommend, aggregatedRecommend } = useSelector((state) => state[namespace] || {});

  useEffect(() => {
    if (visible) {
      pullSymbols();
      dispatch({ type: `${namespace}/pullFuturesSymbols` });
      pullCurrencies(); // 币种信息，头像
      dispatch({ type: `${namespace}/pullMarginSymbols` });
      dispatch({ type: `${namespace}/recommendSpot` });
      dispatch({ type: `${namespace}/recommendAggregated` });
    }
  }, [visible]);

  return (
    <Container
      inDrawer={inDrawer}
      miniMode={miniMode}
      inTrade={inTrade}
      data-inspector="inspector_header_search_default"
    >
      <BoxWrapper inDrawer={inDrawer}>
        <History {...props} />
        {hotRecommend ? <Hot data={hotRecommend} {...props} /> : null}
        <Trend data={aggregatedRecommend} {...props} />
        <Futures data={aggregatedRecommend} {...props} />
        <Earn data={aggregatedRecommend} {...props} />
      </BoxWrapper>
    </Container>
  );
};
