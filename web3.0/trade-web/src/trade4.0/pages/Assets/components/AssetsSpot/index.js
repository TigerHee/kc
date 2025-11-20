/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useEffect, Fragment } from 'react';
import { MainAccount } from '../../style';
import LabelValue from '../LabelValue';
import { useSelector } from 'dva';
import Buttons from '../Buttons';
import Row, { Col } from '../Row';
import { _t } from 'src/utils/lang';
import usePolling from '@/hooks/usePolling';
import { BalanceSocket } from '@/components/SocketSubscribe';
import Spin from '@mui/Spin';
import { isFutureSymbol } from 'Bot/helper';

const getPair = (currentSymbol) => {
  if (isFutureSymbol(currentSymbol)) {
    return [null, 'USDT'];
  }
  return currentSymbol.split('-');
};
/**
 * AssetsSpot
 * 币币资产模块
 *
 * 机器人模式下, 会展示
 * 当前交易对是现货, 显示base, quota; 合约交易对就只显示quota 余额
 */
const AssetsSpot = (props) => {
  const { isMd, ...restProps } = props;
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const [coin, pair] = getPair(currentSymbol);


  // 这个是资金账户接口
  const { startPolling, cancelPolling } = usePolling(
    'user_assets/pullMainAccountCoins',
    'user_assets/registerMainAccountPolling',
  );

  const isLogin = useSelector((state) => state.user.isLogin);
  const mainMap = useSelector((state) => state.user_assets.mainMap);
  const tradeMap = useSelector((state) => state.user_assets.tradeMap);

  const coinMainBalance = coin ? mainMap?.[coin]?.availableBalance : null;
  const pairMainBalance = mainMap?.[pair]?.availableBalance;
  const coinTradeBalance = coin ? tradeMap?.[coin]?.availableBalance : null;
  const pairTradeBalance = tradeMap?.[pair]?.availableBalance;

  // 都没值的时候显示 loading
  const loading = [
    coinMainBalance,
    pairMainBalance,
    coinTradeBalance,
    pairTradeBalance,
  ].every((item) => item === undefined);

  useEffect(() => {
    if (isLogin) {
      startPolling();
    }
    return () => {
      if (isLogin) {
        cancelPolling();
      }
    };
  }, [isLogin]);

  return (
    <Fragment>
      <BalanceSocket />
      <Spin spinning={!!(isLogin && loading)} {...restProps}>
        <Row>
          <Col>
            {isMd && <MainAccount>{_t('trade.account')}</MainAccount>}
            {!!coin && (
              <LabelValue label={coin} currency={coin} value={coinTradeBalance} labelHighlight />
            )}
            <LabelValue
              label={pair}
              currency={pair}
              value={pairTradeBalance}
              labelHighlight
            />
          </Col>
          <Col>
            <MainAccount style={{ marginTop: isMd ? 0 : '8px' }}>
              {_t('trans.account.main')}
            </MainAccount>
            {!!coin && <LabelValue label={coin} currency={coin} value={coinMainBalance} />}
            <LabelValue label={pair} currency={pair} value={pairMainBalance} />
          </Col>
        </Row>
      </Spin>
      <Buttons showRepay={false} showBorrow={false} showDeposit />
    </Fragment>
  );
};

export default memo(AssetsSpot);
