import React, {memo, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {getBaseCurrency} from 'site/tenant';

import convertAddIc from 'assets/common/ic-convert-add.png';
import AmountTransferDrawer from 'components/AmountTransferDrawer';
import NumberFormat from 'components/Common/NumberFormat';
import {largeHitSlop} from 'constants/index';
import {useGetUSDTCurrencyInfo} from 'hooks/useGetUSDTCurrencyInfo';
import {ConvertIcon, ExtraAmountText, RightRow} from './styles';

const MaxCanIncreaseBar = ({disabled, maxIncrease, closeOuterPopup}) => {
  const {precision} = useGetUSDTCurrencyInfo();

  const amountTransferDrawerRef = useRef();
  return (
    <>
      <RightRow>
        <ExtraAmountText>
          <NumberFormat
            options={{maximumFractionDigits: precision}}
            style={{fontWeight: '500'}}>
            {maxIncrease}
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
      <AmountTransferDrawer
        closeOuterPopup={closeOuterPopup}
        ref={amountTransferDrawerRef}
      />
    </>
  );
};
export default memo(MaxCanIncreaseBar);
