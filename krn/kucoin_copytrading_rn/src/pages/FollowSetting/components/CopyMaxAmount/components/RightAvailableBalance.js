import {useUpdateEffect} from 'ahooks';
import React, {memo, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';

import convertAddIc from 'assets/common/ic-convert-add.png';
import AmountTransferDrawer from 'components/AmountTransferDrawer';
import NumberFormat from 'components/Common/NumberFormat';
import {largeHitSlop} from 'constants/index';
import {useGetUSDTCurrencyInfo} from 'hooks/useGetUSDTCurrencyInfo';
import {ConvertIcon, ExtraAmountText, RightRow} from '../styles';

const RightAvailableBalance = ({disabled, triggerValidateField}) => {
  const tradeMap = useSelector(state => state.assets.tradeMap) || {};
  const settleSymbol = getBaseCurrency();

  const {availableBalance = 0} = tradeMap[settleSymbol] || {};
  const {precision} = useGetUSDTCurrencyInfo();

  // 可用余额更新时 再次触发校验
  useUpdateEffect(() => {
    if (disabled) {
      return;
    }
    triggerValidateField();
  }, [availableBalance]);

  const amountTransferDrawerRef = useRef();
  return (
    <>
      <RightRow>
        <ExtraAmountText>
          <NumberFormat
            options={{maximumFractionDigits: precision}}
            style={{fontWeight: '500'}}>
            {availableBalance}
          </NumberFormat>
          {` ${getBaseCurrency()}`}
        </ExtraAmountText>
        {!disabled && (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={largeHitSlop}
            onPress={() => amountTransferDrawerRef.current.open()}>
            <ConvertIcon source={convertAddIc} />
          </TouchableOpacity>
        )}
      </RightRow>
      <AmountTransferDrawer ref={amountTransferDrawerRef} />
    </>
  );
};
export default memo(RightAvailableBalance);
