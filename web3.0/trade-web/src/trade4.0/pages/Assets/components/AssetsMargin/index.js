/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useMemo, Fragment } from 'react';
import LabelValue from '../LabelValue';
import Buttons from '../Buttons';
import RiskValue from '../RiskValue';
import { useSelector } from 'dva';
import useMarginModel from '@/hooks/useMarginModel';
import CoinCurrencyPro from '../CoinCurrencyPro';

import Row, { Col } from '../Row';
import Spin from '@mui/Spin';
import { CrossPositonSocket } from '@/components/SocketSubscribe';
import CoinCodeToName from '@/components/CoinCodeToName';

/**
 * AssetsMargin
 * 全仓资产模块
 * 包含 折合總資產，base，quote， 风险率
 */
const AssetsMargin = (props) => {
  const { isMd, ...restProps } = props;
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const marginMap = useSelector((state) => state.user_assets.marginMap);
  const isLogin = useSelector((state) => state.user.isLogin);

  const [base, quote] = currentSymbol.split('-');
  const { availableBalance: baseAvailableBalance } = marginMap[base] || {};
  const { availableBalance: quoteAvailableBalance } = marginMap[quote] || {};

  const { statusInfo, totalBalance, liabilityRate, totalLiability } =
    useMarginModel([
      'statusInfo',
      'totalBalance',
      'liabilityRate',
      'totalLiability',
    ]);
  const { code: status } = statusInfo || {};

  const displayTotalBalance = useMemo(() => {
    return <CoinCurrencyPro showType={2} value={totalBalance} coin="BTC" />;
  }, [totalBalance]);

  const showNoBalence = isLogin && +totalBalance <= 0 && +totalLiability <= 0;

  return (
    <Fragment>
      <CrossPositonSocket />
      <Spin spinning={!!(isLogin && totalBalance === undefined)} {...restProps}>
        <RiskValue
          md={isMd}
          value={displayTotalBalance}
          percent={liabilityRate}
          status={status}
          onlyRenderValue
        />
        <Row>
          <Col>
            <LabelValue
              currency={base}
              value={baseAvailableBalance}
              label={<CoinCodeToName coin={base} />}
            />
          </Col>
          <Col>
            <LabelValue
              currency={quote}
              value={quoteAvailableBalance}
              label={<CoinCodeToName coin={quote} />}
            />
          </Col>
        </Row>
      </Spin>
      <Buttons highlightTransfer={showNoBalence} />
    </Fragment>
  );
};

export default memo(AssetsMargin);
