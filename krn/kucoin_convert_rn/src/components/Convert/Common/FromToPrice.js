/**
 * Owner: willen@kupotech.com
 */
import React, {useMemo, useState} from 'react';
import styled from '@emotion/native';
import {useSelector} from 'react-redux';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import useLang from 'hooks/useLang';
import {TouchableOpacity, Platform} from 'react-native';

import icon from 'assets/convert/switch_horiental.png';
import {useEffect} from 'react';
import {divide} from 'utils/helper';

const TextWrap = styled.View`
  align-items: ${({isSwitch}) => (isSwitch ? 'center' : 'flex-end')};
  flex-direction: ${({fd}) => fd || 'column'};
`;

const TextBox = styled.Text`
  font-size: 14px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '18px')};
  color: ${({theme, color}) => theme.colorV2[color || 'text40']};
`;

const TransferBtn = styled.Image`
  width: 14px;
  height: 14px;
  margin-left: 4px;
`;

const getPrice = (coin, data) => {
  return coin === data.base ? data.price : data.inversePrice;
};

const getLimitPrice = (data1, data2) => {
  return divide(data1.amount, data2.amount, data1.precision);
};

/**
 * 价格转换预览
 */
export default ({
  color,
  isSwitch = false,
  textStyle,
  isLimit,
  ...restProps
}) => {
  const from = useSelector(state => state.convert.from);
  const to = useSelector(state => state.convert.to);
  const priceInfo = useSelector(state => state.convert.priceInfo);
  const limitPriceInfo = useSelector(state => state.convert.limitPriceInfo);
  const emptyMarketPriceInfo = useSelector(
    state => state.convert.emptyMarketPriceInfo,
  );

  const {numberFormat} = useLang();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setToggle(false);
  }, [from.coin, to.coin]);

  // 这里两个数据结构不一样
  const info =
    (isLimit
      ? limitPriceInfo
      : !from.amount && !to.amount
      ? emptyMarketPriceInfo
      : priceInfo) || {};

  const labels = useMemo(() => {
    const fromCoin = from.coin;
    const toCoin = to.coin;

    const limitFromPrice = getLimitPrice(to, from);
    const limitToPrice = getLimitPrice(from, to);

    const fromPrice = isLimit ? limitFromPrice : getPrice(fromCoin, info);
    const toPrice = isLimit ? limitToPrice : getPrice(toCoin, info);

    return {
      label1: (
        <TextBox color={color} style={textStyle}>
          1 <CoinCodeToName coin={fromCoin} /> ≈ {numberFormat(fromPrice)}{' '}
          <CoinCodeToName coin={toCoin} />
        </TextBox>
      ),
      label2: (
        <TextBox color={color} style={textStyle}>
          1 <CoinCodeToName coin={toCoin} /> ≈ {numberFormat(toPrice)}{' '}
          <CoinCodeToName coin={fromCoin} />
        </TextBox>
      ),
    };
  }, [info]);

  const handlePress = () => {
    setToggle(prev => !prev);
  };

  const renderToggle = () => {
    return isSwitch ? (
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <TransferBtn source={icon} />
      </TouchableOpacity>
    ) : null;
  };

  const renderLabel = (label1, label2) => {
    if (isSwitch) {
      return !toggle ? label1 : label2;
    }
    return (
      <>
        {label1}
        {label2}
      </>
    );
  };

  const priceKey = isLimit ? 'oneCoinPrice' : 'price';

  return (
    <TextWrap isSwitch={isSwitch} {...restProps}>
      {info[priceKey] ? (
        <>
          {renderLabel(labels.label1, labels.label2)}
          {renderToggle()}
        </>
      ) : (
        <TextBox color={color} style={textStyle}>
          --
        </TextBox>
      )}
    </TextWrap>
  );
};
