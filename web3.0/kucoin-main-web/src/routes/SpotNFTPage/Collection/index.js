/**
 * Owner: willen@kupotech.com
 */
import CustomTabs from 'components/SpotNFT/CustomTabs';
import MainContainer from 'components/SpotNFT/MainContainer';
import React, { memo, useCallback, useEffect, useState } from 'react';
import clxs from 'classnames';
import { _t } from 'tools/i18n';
import { connect } from 'react-redux';
import { withRouter } from 'components/Router';
import { push, replace } from 'utils/router';
import { getIsInApp } from 'helper';
import MysteryBoxList from './MysteryBoxList';
import NFTList from './NFTList';
import TradeRecords from './TradeRecords';
import WithDrawRecords from './WithDrawRecords';
import style from './style.less';

const { CustomTab } = CustomTabs;

const Collection = (props) => {
  const [activeTab, setActiveTab] = useState('nft');
  const { dispatch, isLogin, location } = props;
  // 判断是否是在App中
  const isApp = getIsInApp() || false;
  const tabActionMap = {
    nft: 'queryMyNFT',
    mystery: 'queryMysteryBox',
    trade: 'queryTradeRecords',
    record: 'queryWithDrawRecords',
  };
  useEffect(() => {
    if (location.query && location.query.t) {
      if (tabActionMap.hasOwnProperty(location.query.t)) {
        setActiveTab(location.query.t);
      } else {
        setActiveTab('nft');
      }
    }
  }, [location.query]);
  useEffect(() => {
    dispatch({
      type: `spot_nft_collection/${tabActionMap[activeTab]}`,
    });
  }, [dispatch, activeTab]);

  const tabChange = useCallback((e, value) => {
    e.preventDefault();
    // history.replace('/spot-nft/collection?t=' + value);
    replace('/spot-nft/collection?t=' + value);
  }, []);

  const handlePreventDefault = useCallback((e) => {
    e.preventDefault();
  }, []);

  if (!isLogin && isLogin !== undefined) {
    push(`/ucenter/signin?backUrl=${window.location.href}`);
    return null;
  }

  return (
    <div className={style.collection}>
      <MainContainer>
        <div
          className={clxs(style.tabContainer, {
            [style.tabContainerInApp]: isApp,
          })}
        >
          <CustomTabs indicatorFull={false} onChange={tabChange} value={activeTab}>
            <CustomTab
              active={activeTab === 'nft'}
              value="nft"
              className={style.tabs}
              label={
                <a href="/spot-nft/collection?t=nft" onClick={handlePreventDefault}>
                  {_t('igo.nft.collection.myNFTs')}
                </a>
              }
              key={'nft'}
            />
            <CustomTab
              active={activeTab === 'mystery'}
              value="mystery"
              className={style.tabs}
              label={
                <a href="/spot-nft/collection?t=mystery" onClick={handlePreventDefault}>
                  {_t('spot.nft.mystery.tab')}
                </a>
              }
              key={'mystery'}
            />
            <CustomTab
              active={activeTab === 'trade'}
              value="trade"
              className={style.tabs}
              label={
                <a href="/spot-nft/collection?t=trade" onClick={handlePreventDefault}>
                  {_t('spot.nft.trade.history.tab')}
                </a>
              }
              key={'trade'}
            />
            <CustomTab
              active={activeTab === 'record'}
              value="record"
              className={style.tabs}
              label={
                <a href="/spot-nft/collection?t=record" onClick={handlePreventDefault}>
                  {_t('igo.nft.collection.withdrawRecord')}
                </a>
              }
              key={'record'}
            />
          </CustomTabs>
        </div>
        {activeTab === 'nft' && <NFTList />}
        {activeTab === 'mystery' && <MysteryBoxList />}
        {activeTab === 'trade' && <TradeRecords />}
        {activeTab === 'record' && <WithDrawRecords />}
      </MainContainer>
    </div>
  );
};

export default connect((state) => {
  const { user } = state;
  const { isLogin } = user;
  return {
    isLogin,
  };
})(withRouter()(memo(Collection)));
