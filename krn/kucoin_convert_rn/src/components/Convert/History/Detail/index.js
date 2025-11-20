/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect, useMemo} from 'react';
import styled from '@emotion/native';
import Status from './Status';
import CoinInfo from './CoinInfo';
import AccountInfo from './AccountInfo';
import FooterLayout from './FooterLayout';
import useLang from 'hooks/useLang';
import {useDispatch, useSelector} from 'react-redux';
import {Loading, useTheme} from '@krn/ui';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import {isUndef} from 'utils/helper';
import {Platform} from 'react-native';

const Wrapper = styled.View`
  padding: 8px 16px 40px 16px;
  background: ${props => props.theme.colorV2.overlay};
`;
const SplitLine = styled.View`
  margin: 24px 0;
  height: 0.5px;
  background: ${props => props.theme.colorV2.divider8};
`;
const Content = styled.Text`
  font-size: 12px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '20px')};
  color: ${props => props.theme.colorV2.text};
  text-align: right;
  font-weight: 500;
`;
const Time = styled(FooterLayout)`
  margin-bottom: 12px;
`;
const PriceContentWrapper = styled.View``;
const StyledLoading = styled(Loading)`
  margin: 200px auto;
  position: relative;
  left: -12px;
`;
//处理价格精度
const handlePrice = num => {
  const arr = (num + '').split('.');
  const integers = arr[0];
  const decimals = arr[1];

  const len = integers.length;
  let newNum;
  const handleDecimals = index => {
    if (decimals) {
      return integers + '.' + decimals.slice(0, index);
    }
    return integers;
  };
  if (len > 6) {
    newNum = integers;
  } else if (len === 5) {
    newNum = handleDecimals(1);
  } else if (len === 4) {
    newNum = handleDecimals(2);
  } else if (len === 3) {
    newNum = handleDecimals(3);
  } else if (len > 0 && integers !== '0') {
    newNum = handleDecimals(4);
  } else {
    const index = decimals
      ? decimals.split('').findIndex(item => item !== '0')
      : -1;
    newNum = handleDecimals(index + 4);
  }
  return parseFloat(newNum);
};

export default ({params}) => {
  const {isLimit, tickerId, ...limitDetail} = params;
  const {_t, dateTimeFormat, numberFormat} = useLang();
  const dispatch = useDispatch();
  const theme = useTheme();
  const marketDetail = useSelector(state => state.order.detail);
  const loading = useSelector(
    state => state.loading.effects['order/queryConvertOrderDetail'],
  );
  const detail = isLimit ? limitDetail : marketDetail || {};

  const fromCurrencySize = isLimit ? detail.fromSize : detail.fromCurrencySize;
  const toCurrencySize = isLimit ? detail.toSize : detail.toCurrencySize;

  useEffect(() => {
    if (!isLimit) {
      dispatch({type: 'order/queryConvertOrderDetail', payload: {tickerId}});
    }
    return () => dispatch({type: 'order/update', payload: {detail: {}}});
  }, [dispatch, tickerId, isLimit]);

  const priceInfo = useMemo(() => {
    return [
      {
        coin: detail.fromCurrency,
        price: isLimit
          ? detail.price
          : handlePrice(toCurrencySize / fromCurrencySize),
        unit: detail.toCurrency,
      },
      {
        coin: detail.toCurrency,
        price: isLimit
          ? detail.inversePrice
          : handlePrice(fromCurrencySize / toCurrencySize),
        unit: detail.fromCurrency,
      },
    ];
  }, [detail, isLimit]);

  const time = isLimit ? detail.tradedAt : detail.createdAt;

  const accountInfo = useMemo(() => {
    // 市价
    if (!isLimit) {
      return detail.accountType === 'BOTH'
        ? [
            {
              type: 'MAIN',
              num: detail.mainAmount,
              currency: detail.fromCurrency,
            },
            {
              type: 'TRADE',
              num: detail.tradeAmount,
              currency: detail.fromCurrency,
            },
          ]
        : detail.accountType
        ? [
            {
              type: detail.accountType,
              num: fromCurrencySize,
              currency: detail.fromCurrency,
            },
          ]
        : [];
    }
    // 限价
    return detail.fromAccountTypes.map(item => ({
      type: item,
      num: item === 'TRADE' ? detail.tradeAccountSize : detail.mainAccountSize,
      currency: detail.fromCurrency,
    }));
  }, [detail, isLimit]);
  return (
    <Wrapper>
      <StyledLoading
        spin={loading}
        coverElementStyle={{backgroundColor: theme.colorV2.overlay}}>
        {detail.status ? (
          <Status status={detail.status} tips={detail.errorMsgType} />
        ) : null}
        <CoinInfo
          route="history"
          info={{
            from: {
              coin: detail.fromCurrency,
              num: fromCurrencySize,
              direction: _t('f1fUs5np2HnVWsgQPhB9LC'),
            },
            to: {
              coin: detail.toCurrency,
              num: toCurrencySize,
              direction: _t('1izXduRcCW4CqMQTDi3Nry'),
            },
          }}
        />
        <AccountInfo account={accountInfo} />
        <SplitLine />
        <Time title={isLimit ? _t('ik6S9nwKMffC9MUTX3TFMD') : _t('deal.time')}>
          <Content>{time ? dateTimeFormat(time) : '--'}</Content>
        </Time>
        <FooterLayout title={_t('2LGfGDPpg72iELkFTMdaoD')}>
          <PriceContentWrapper>
            {priceInfo.map((item, index) => {
              return (
                <Content key={item.coin || index}>
                  {item.coin ? (
                    <>
                      1 {<CoinCodeToName coin={item.coin} />} ={' '}
                      {numberFormat(item.price)}{' '}
                      {<CoinCodeToName coin={item.unit} />}
                    </>
                  ) : (
                    '--'
                  )}
                </Content>
              );
            })}
            {!isUndef(detail.taxSize) && (
              <Content>
                {_t('2zrN1Gb62TuWAVJY34m3LT')}
                {numberFormat(detail.taxSize)}{' '}
                {<CoinCodeToName coin={detail.taxCurrency} />}
              </Content>
            )}
          </PriceContentWrapper>
        </FooterLayout>
      </StyledLoading>
    </Wrapper>
  );
};
