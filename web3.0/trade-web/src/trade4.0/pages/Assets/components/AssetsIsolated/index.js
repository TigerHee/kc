/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useMemo, useCallback, Fragment } from 'react';
import RiskValue from '../RiskValue';
import LabelValue from '../LabelValue';
import Row, { Col } from '../Row';
import { PositionBar, Label } from '../../style';
import Buttons from '../Buttons';
import { _t } from 'src/utils/lang';
import { styled } from '@/style/emotion';
import CoinCurrencyPro from '../CoinCurrencyPro';
import { useDispatch, useSelector } from 'dva';
import { isNil } from 'lodash';
import { STATUS } from '@/meta/margin';
import { ACCOUNT_CODE } from '@/meta/const';
import NoBalance from '../NoBalance';
import { Placeholder } from '@/components/Mask';
import CoinCodeToName from '@/components/CoinCodeToName';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import { formatLittleSize, formatLittlePercent } from '@/utils/format';
import Spin from '@mui/Spin';
import useWorkerSubscribe, { getTopic } from '@/hooks/useWorkerSubscribe';
import {
  checkIsSupportClosePosition,
  checkIsSupportCancelClosePosition,
} from '@/pages/Portal/ClosePositionModal/utils';
import { sensorFunc } from '@/hooks/useSensorFunc';
import usePriceChangeColor from '@/hooks/usePriceChangeColor';

const _noop = {};
const ISOLATED_STATUS = STATUS[ACCOUNT_CODE.ISOLATED];

export const PNLValueWrapper = styled.span`
  color: ${(props) => props.color || props.theme.colors.primary};
`;
export const LiquidationPriceValueWrapper = styled.span`
  color: ${(props) => props.theme.colors.complementary};
`;

/**
 * AssetsIsolated
 * 逐仓资产模块
 * 包含 折合總資產，风险率，base，quote, 盈利，强平
 */
const AssetsIsolated = (props) => {
  const dispatch = useDispatch();
  const { isMd, ...restProps } = props;

  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const positionMap = useSelector((state) => state.isolated.positionMap);
  const isolatedSymbolsMap = useSelector((state) => state.symbols.isolatedSymbolsMap);
  const isLogin = useSelector((state) => state.user.isLogin);

  const { pnlPrecision = 2 } = isolatedSymbolsMap[currentSymbol] || {};
  const isolatedPosition = positionMap[currentSymbol] || _noop;
  const topic = getTopic('/margin/isolatedPosition:{SYMBOL_LIST}', currentSymbol);
  useWorkerSubscribe(topic, true);
  const { up, down } = usePriceChangeColor();

  const {
    status,
    earning,
    earningRate,
    liabilityRate,
    liquidationPrice,
    accumulatedPrincipal,
    totalConversionLiability,
    totalConversionBalance: totalBalance,
  } = isolatedPosition;

  const [base, quote] = currentSymbol.split('-');
  const { availableBalance: baseAvailableBalance } = isolatedPosition[base] || {};
  const { availableBalance: quoteAvailableBalance } = isolatedPosition[quote] || {};

  const displayTotalBalance = useMemo(() => {
    return <CoinCurrencyPro showType={2} value={totalBalance} coin="BTC" />;
  }, [totalBalance]);

  const { isHideEarningRate, isHideLiquidationPrice } = ISOLATED_STATUS[status] || {};

  const liqPrice =
    !isNil(liquidationPrice) && !isHideLiquidationPrice && +liquidationPrice >= 0 ? (
      `${liquidationPrice}`
    ) : (
      <Placeholder />
    );

  const pnl = useMemo(() => {
    if (!isHideEarningRate) {
      const displayEarningRate = formatLittlePercent({ value: earningRate });
      const displayEarning = formatLittleSize({
        value: earning,
        withSign: true,
        fixed: pnlPrecision,
      });
      if ([displayEarning, displayEarningRate].every(v => !isNil(v))) {
        return `${displayEarning}(${displayEarningRate})`;
      }
    }
    return <Placeholder />;
  }, [isHideEarningRate, earning, earningRate, pnlPrecision]);

  const pnlColor = useMemo(() => {
    return earning >= 0 ? up : down;
  }, [earning, up, down]);

  const tooltip = useMemo(() => {
    if (+accumulatedPrincipal >= 0) {
      return _t('isolated.pnl.desc');
    }
    return (
      <div>
        <div>{_t('isolated.pnl.desc2')}</div>
        <div style={{ marginTop: 16 }}>{_t('isolated.pnl.formula')}</div>
      </div>
    );
  }, [accumulatedPrincipal]);

  // 没有资产时 隐藏 盈亏和强平，高亮 划转按钮
  const showNoBalence = isLogin && +totalBalance <= 0 && +totalConversionLiability <= 0;
  // 是否支持一键平仓
  const isSupportClosePosition = checkIsSupportClosePosition(status);
  const isSupportCancelClosePosition = checkIsSupportCancelClosePosition(isolatedPosition);

  const openClosePositionModal = useCallback(() => {
    const { [base]: baseAsset, [quote]: quoteAsset, ...other } = isolatedPosition;
    dispatch({
      type: 'isolated/updateClosePositionModalConfig',
      payload: {
        visible: true,
        baseAsset,
        quoteAsset,
        ...other,
      },
    });
    sensorFunc(['assetDisplayArea', 'closePosition']);
  }, [base, quote, isolatedPosition, dispatch, sensorFunc]);

  const openCancelClosePositionModal = useCallback(() => {
    dispatch({
      type: 'isolated/updateCancelClosePositionModalConfig',
      payload: {
        visible: true,
        ...isolatedPosition,
      },
    });
    sensorFunc(['assetDisplayArea', 'canelClosePosition']);
  }, [dispatch, isolatedPosition, sensorFunc]);

  return (
    <Fragment>
      <Spin spinning={!!(isLogin && totalBalance === undefined)} {...restProps}>
        <PositionBar>
          <Label bold>
            <SymbolCodeToName code={currentSymbol} />
          </Label>
          {isSupportClosePosition && (
            <a onClick={openClosePositionModal}>{_t('vgzWfdsGbtgNLJrDpz1v4P')}</a>
          )}
          {isSupportCancelClosePosition && (
            <a onClick={openCancelClosePositionModal}>{_t('39KvvPYFBnvWh6j94CgdqD')}</a>
          )}
        </PositionBar>
        <RiskValue
          md={isMd}
          value={displayTotalBalance}
          percent={liabilityRate}
          status={status}
          onlyRenderValue
        />
        {showNoBalence && <NoBalance />}
        <Row>
          <Col className={isMd && showNoBalence ? 'responsive' : ''}>
            <LabelValue
              currency={base}
              value={baseAvailableBalance}
              label={<CoinCodeToName coin={base} />}
            />
            <LabelValue
              currency={quote}
              value={quoteAvailableBalance}
              label={<CoinCodeToName coin={quote} />}
            />
          </Col>

          {!showNoBalence && (
            <Col>
              <LabelValue
                tooltip={tooltip}
                formatValue={false}
                value={<PNLValueWrapper color={pnlColor}>{pnl}</PNLValueWrapper>}
                label={
                  <Fragment>
                    {_t('position.pnl')} (<CoinCodeToName coin={quote} />)
                  </Fragment>
                }
              />
              <LabelValue
                label={_t('isolated.column.liqPrice')}
                formatValue={false}
                value={<LiquidationPriceValueWrapper>{liqPrice}</LiquidationPriceValueWrapper>}
              />
            </Col>
          )}
        </Row>
      </Spin>
      <Buttons highlightTransfer={showNoBalence} />
    </Fragment>
  );
};

export default memo(AssetsIsolated);
