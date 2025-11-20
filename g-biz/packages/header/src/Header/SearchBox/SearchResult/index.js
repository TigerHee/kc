/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Empty } from '@kux/mui';
import { useCompliantShow } from '@packages/compliantCenter';
import { namespace } from '../../model';
import Spot from './Spot';
import Futures from './Futures';
import Earn from './Earn';
import Web3 from './Web3';
import { useLang } from '../../../hookTool';
import { BoxWrapper, Divider, BlankWrapper, Container } from './styled';
import { SEARCH_FUTURE_ENTRANCE_FUTURE_SPM } from '../../config';

import { kcsensorsManualTrack } from '../../../common/tools';

export default (props) => {
  const { inDrawer, additional, miniMode, loading } = props;
  const { t } = useLang();
  const { searchList, spotList, futuresList, earnList, web3List, symbolsMap } = useSelector(
    (state) => state[namespace],
  );
  useEffect(() => {
    if (!searchList || searchList.length === 0) {
      kcsensorsManualTrack(['NavigationSearchNullSearchResult', '1'], {
        groupId: additional.searchSessionId,
        contentItem: additional.searchWords,
        pagecate: 'NavigationSearchNullSearchResult',
      });
    }
  }, [additional, searchList]);

  // 使用spmid判断(如英国ip隐藏合约搜索结果)
  const showSearchFuture = useCompliantShow(SEARCH_FUTURE_ENTRANCE_FUTURE_SPM);

  if (loading) {
    return (
      <BlankWrapper inDrawer={inDrawer}>
        <Spin size="small" style={{ margin: '0 auto' }} />
      </BlankWrapper>
    );
  }
  if (!searchList || searchList.length === 0) {
    return (
      <BlankWrapper inDrawer={inDrawer}>
        <Empty description={t('vFzzhYEWzn2Fz9YfHR4P2H')} />
      </BlankWrapper>
    );
  }

  return (
    <Container inDrawer={inDrawer} miniMode={miniMode}>
      <BoxWrapper inDrawer={inDrawer}>
        <Spot symbolsMap={symbolsMap} data={spotList} {...props} />
        {spotList.length > 0 ? <Divider inDrawer={inDrawer} /> : null}
        <Futures symbolsMap={symbolsMap} data={futuresList} {...props} />
        {futuresList.length > 0 && showSearchFuture ? <Divider inDrawer={inDrawer} /> : null}
        <Earn data={earnList} {...props} />
        {earnList.length > 0 ? <Divider inDrawer={inDrawer} /> : null}
        <Web3 data={web3List} {...props} />
      </BoxWrapper>
    </Container>
  );
};
