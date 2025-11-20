/**
 * Owner: clyne@kupotech.com
 */
import React, { memo, useState, useEffect } from 'react';
import TextTips from './TextTips';
import { Link } from 'src/components/Router';
import { _t } from 'src/utils/lang';
import { useGetCurrentSymbol, useGetCurrentSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import FutureChangeRate from 'src/trade4.0/components/FutureChangeRate';
import { SETTLE_CONTRACT } from 'src/trade4.0/meta/futures';
import SettlementCountdown from './SettlementCountdown';
import { useSelector } from 'dva';
import { useDetailData } from './hooks/useDetail';
import CountDown from 'src/trade4.0/components/CountDown';
import { usePullContractDetail } from '../hooks/usePullContract';

const FundCountDown = memo(() => {
  const nextFundingRateTime = useDetailData('nextFundingRateTime');
  const { pullContractDetail } = usePullContractDetail();
  const onFinish = () => {
    pullContractDetail();
  };
  return <CountDown value={nextFundingRateTime} onFinish={onFinish} />;
});

const FundingRate = ({ itemType }) => {
  const fundingFeeRate = useDetailData('fundingFeeRate');
  const serverTime = useSelector((state) => state.server_time.serverTime);
  const symbol = useGetCurrentSymbol();
  const contract = useGetCurrentSymbolInfo();
  const { type, settleDate } = contract || {};
  const isSettlement = type === SETTLE_CONTRACT;
  const [indexLabel, setIndexLabel] = useState(
    isSettlement && settleDate - serverTime <= 1800000 ? _t('settle.price') : '',
  );

  useEffect(() => {
    let _indexLabel = '';
    if (isSettlement && settleDate - serverTime <= 1800000) {
      _indexLabel = _t('settle.price');
    }

    setIndexLabel(_indexLabel);
  }, [symbol, isSettlement, serverTime, settleDate]);

  const toggleIndex = () => {
    if (indexLabel === '' && isSettlement) {
      setIndexLabel(_t('settle.price'));
    }
  };
  const SettleFund = (
    <div>
      {_t('trade.tooltip.fundingSettlement1')}
      <Link to={`/futures/contract/funding-rate-history/${symbol}`}>
        {_t('trade.tooltip.fundingSettlement2')}
      </Link>
    </div>
  );

  let header = [_t('contract.rate'), _t('trade.contract.settlement')];
  let tips = [null, SettleFund];
  const Fund = <FutureChangeRate className="gold" precision={4} value={fundingFeeRate} />;

  let value = (
    <div className="settle">
      {Fund}
      <div className="line">/</div>
      {isSettlement ? (
        <SettlementCountdown onTime30m={toggleIndex} settleDate={settleDate} />
      ) : (
        <FundCountDown />
      )}
    </div>
  );
  if (itemType === 'fund') {
    header = [_t('contract.rate')];
    tips = [null];
    value = <div className="settle">{Fund}</div>;
  } else if (itemType === 'settle') {
    header = [_t('trade.contract.settlement')];
    tips = [SettleFund];
    value = (
      <div className="settle">
        {isSettlement ? (
          <SettlementCountdown onTime30m={toggleIndex} settleDate={settleDate} />
        ) : (
          <FundCountDown />
        )}
      </div>
    );
  }
  return <TextTips tips={tips} header={header} value={value} />;
};

export default memo(FundingRate);
