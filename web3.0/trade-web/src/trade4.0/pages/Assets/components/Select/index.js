/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import { SelectWrapper, EyeWrapper, TradeTypeBox } from '../../style';
import { EyeClose, EyeOpen } from './Icon';
import { useDispatch, useSelector } from 'dva';
import { _t } from 'utils/lang';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import useSensorFunc from '@/hooks/useSensorFunc';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useIsTradingBot } from '@/hooks/common/useTradeMode';
/**
 * Select
 * 策略只显示币币账户
 */
const Select = (props) => {
  const { isMd } = props;
  const tradeType = useTradeType();
  const showAssets = useSelector((state) => state.setting.showAssets);
  const isBot = useIsTradingBot();
  const dispatch = useDispatch();
  const sensorFunc = useSensorFunc();

  const { label1 } = TRADE_TYPES_CONFIG[tradeType] || {};
  const isTrade = tradeType === 'TRADE';

  const onShowChange = () => {
    sensorFunc(['assetDisplayArea', 'hidden']);
    dispatch({ type: 'setting/toggleShowAssets' });
  };

  return (
    <SelectWrapper {...props} isTradeAndNotMd={isTrade && !isMd}>
      <EyeWrapper onClick={onShowChange}>
        {showAssets ? <EyeOpen /> : <EyeClose />}
      </EyeWrapper>
      {Boolean(label1) && (
        <TradeTypeBox isTradeAndMd={isTrade && isMd}>
          {(isTrade || isBot) ? _t('trade.account') : label1()}
        </TradeTypeBox>
      )}
    </SelectWrapper>
  );
};

export default memo(Select);
