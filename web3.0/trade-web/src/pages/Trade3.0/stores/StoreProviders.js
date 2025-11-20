/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import dealOrdersStore from './store.dealOrders';
import openOrdersStore from './store.openOrders';
import callAuctionStore from './store.callAuction';
import marketSnapshotStore from './store.marketSnapshot';
import tradeMarketsStore from './store.tradeMarkets';
import socketStore from './store.socket';

const StoreProviders = ({ children }) => {
  return (
    <dealOrdersStore.ProviderWrap>
      <openOrdersStore.ProviderWrap>
        <marketSnapshotStore.ProviderWrap>
          <tradeMarketsStore.ProviderWrap>
            <socketStore.ProviderWrap>
              <callAuctionStore.ProviderWrap>{children}</callAuctionStore.ProviderWrap>
            </socketStore.ProviderWrap>
          </tradeMarketsStore.ProviderWrap>
        </marketSnapshotStore.ProviderWrap>
      </openOrdersStore.ProviderWrap>
    </dealOrdersStore.ProviderWrap>
  );
};

export default StoreProviders;
