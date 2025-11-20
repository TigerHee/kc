/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect } from 'react';
import { Loading, Empty } from '@kux/design';
import clsx from 'clsx';
import Spot from './Spot';
import Futures from './Futures';
import Earn from './Earn';
import Web3 from './Web3';
import { useTranslation } from 'tools/i18n';
import { useAbTest } from '../../hooks';
import { kcsensorsManualTrack } from '../../../common/tools';
import { useHeaderStore } from '../../model';
import styles from './styles.module.scss';
import { useCompliantShow } from 'packages/compliantCenter';
import { ALPHA_TRADE_AB_TEST, SEARCH_FUTURE_ENTRANCE_FUTURE_SPM } from '../../config';

export default props => {
  const { inDrawer, additional, miniMode, loading } = props;
  const { t } = useTranslation('header');
  const searchList = useHeaderStore(state => state.searchList) || [];
  const spotList = useHeaderStore(state => state.spotList) || [];
  const futuresList = useHeaderStore(state => state.futuresList) || [];
  const earnList = useHeaderStore(state => state.earnList) || [];
  const web3List = useHeaderStore(state => state.web3List) || [];
  const alphaList = useHeaderStore(state => state.alphaList) || [];
  const symbolsMap = useHeaderStore(state => state.symbolsMap) || {};
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

  // alpha 灰度结果
  const { show: showSearchAlpha } = useAbTest(ALPHA_TRADE_AB_TEST);

  if (loading) {
    return (
      <div className={clsx(styles.blankWrapper, inDrawer && styles.blankWrapperInDrawer)}>
        <Loading type="brand" size="medium" style={{ margin: '0 auto' }} />
      </div>
    );
  }
  if (!searchList || searchList.length === 0) {
    return (
      <div className={clsx(styles.blankWrapper, inDrawer && styles.blankWrapperInDrawer)}>
        <Empty name="no-record" description={t('vFzzhYEWzn2Fz9YfHR4P2H')} />
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.container, inDrawer && styles.containerInDrawer)}
      style={{ marginTop: inDrawer ? '0' : miniMode ? '14px' : '20px' }}
    >
      <div className={clsx(styles.boxWrapper, inDrawer && styles.boxWrapperInDrawer)}>
        <Spot symbolsMap={symbolsMap} data={spotList} {...props} />
        {spotList.length > 0 ? (
          <div className={styles.divider} style={{ margin: inDrawer ? '12px 0' : '12px' }} />
        ) : null}
        <Futures symbolsMap={symbolsMap} data={futuresList} {...props} />
        {futuresList.length > 0 && showSearchFuture ? (
          <div className={styles.divider} style={{ margin: inDrawer ? '12px 0' : '12px' }} />
        ) : null}
        {showSearchAlpha && (
          <>
            <Web3 type="ALPHA" title="Alpha" data={alphaList} {...props} />
            {alphaList.length > 0 ? (
              <div className={styles.divider} style={{ margin: inDrawer ? '12px 0' : '12px' }} />
            ) : null}
          </>
        )}
        <Earn data={earnList} {...props} />
        {earnList.length > 0 ? (
          <div className={styles.divider} style={{ margin: inDrawer ? '12px 0' : '12px' }} />
        ) : null}
        <Web3 type="WEB3" title="Web3" data={web3List} {...props} />
      </div>
    </div>
  );
};
