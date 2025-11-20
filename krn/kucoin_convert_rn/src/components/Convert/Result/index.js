/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect, useState} from 'react';
import styled from '@emotion/native';
import {useSelector, useDispatch} from 'react-redux';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import useLang from 'hooks/useLang';
import orderSuccessLight from 'assets/convert/order_success_light.png';
import orderSuccessDark from 'assets/convert/order_success_dark.png';
import orderFailLigth from 'assets/convert/order_fail_light.png';
import orderFailDark from 'assets/convert/order_fail_dark.png';
import {useNavigation} from '@react-navigation/native';
import useTracker from 'hooks/useTracker';
import MarginRewardModal from 'components/Convert/Result/MarginRewardModal';
import ThemeImage from 'components/Common/ThemeImage';
import {Button} from '@krn/ui';

const Result = styled.View`
  flex: 1;
  padding: 48px 12px 12px;
  background: ${({theme}) => theme.colorV2.overlay};
`;

const ContextCont = styled.View`
  align-items: center;
  justify-content: center;
`;

const BtnCont = styled.View`
  flex-direction: column;
  align-items: center;
`;

const TextCont = styled.View`
  justify-content: center;
`;

const IconCont = styled.View`
  margin-bottom: 12px;
`;

const ResultIcon = styled(ThemeImage)`
  width: 148px;
  height: 148px;
`;
const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  line-height: 31.2px;
  color: ${({theme}) => theme.colorV2.text};
  text-align: center;
`;

const Detail = styled.Text`
  font-size: 28px;
  /* line-height: 40px; */
  font-weight: 700;
  color: ${({theme}) => theme.colorV2.primary};
  text-align: center;
  margin: 4px 0;
`;

const Desc = styled.Text`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({theme}) => theme.colorV2.text60};
  text-align: center;
`;

const MainButton = styled(Button)`
  margin: 40px 0;
  min-width: 220px;
`;

export default ({params, resetToStep1}) => {
  const {_t, numberFormat} = useLang();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {onClickTrack, onExpose} = useTracker();
  const [marginRewardModalVisible, setMarginRewardModalVisible] =
    useState(false);

  const to = useSelector(state => state.convert.to);
  const priceInfo = useSelector(state => state.convert.priceInfo);
  const orderResult = useSelector(state => state.convert.orderResult);

  const isSuccess = orderResult?.success === true;
  const isFail = orderResult?.success === false;
  const {fromCurrency, fromSize, isLimit} = params || {};

  const onRetry = () => {
    if (!isLimit) {
      dispatch({
        type: 'convert/update',
        payload: {
          priceInfo: {
            ...priceInfo,
            // autoLoopCount: 1,
            tickerId: null,
            lastUpdateTime: -1,
          },
        },
      });
    }

    navigation.navigate('ConvertPage', {step: 2});
  };

  /**
   * 市价跳转到 订单详情
   * 限价跳转到 当前委托单
   */
  const toOrder = () => {
    try {
      onClickTrack({
        blockId: 'convertResultNew',
        locationId: 1,
        properties: {
          symbol: to.coin,
          amount: orderResult?.data?.toCurrencySize,
        },
      });
    } catch (e) {}
    dispatch({type: 'convert/resetFormData'});
    if (isLimit) {
      navigation.replace('ConvertHistoryPage', {
        tab: 'CURRENT',
      });
    } else {
      navigation.replace('ConvertHistoryDetailPage', {
        tickerId: params.tickerId,
      });
    }
  };

  const retry = () => {
    try {
      onClickTrack({
        blockId: 'convertResultNew',
        locationId: 4,
        properties: {text: ''},
      });
    } catch (e) {}
    onRetry();
  };

  useEffect(() => {
    if (orderResult?.success) {
      try {
        onExpose({
          blockId: 'convertResultNew',
          locationId: 1,
          properties: {
            symbol: to.coin,
            amount: orderResult?.data?.toCurrencySize,
          },
        });
      } catch (e) {}
      try {
        onExpose({
          blockId: 'convertResultNew',
          locationId: 2,
          properties: {
            symbol: to.coin,
            amount: orderResult?.data?.toCurrencySize,
          },
        });
      } catch (e) {}
    } else if (orderResult?.code && !orderResult?.success) {
      try {
        onExpose({
          blockId: 'convertResultNew',
          locationId: 4,
          properties: {text: ''},
        });
      } catch (e) {}
    }
  }, [orderResult?.code, orderResult?.success, to]);

  useEffect(() => {
    setMarginRewardModalVisible(
      orderResult?.data?.issueCoupons?.includes?.('MARGIN_INT_FREE'),
    );
  }, [orderResult?.data?.issueCoupons]);

  const handlePress = () => {
    if (isSuccess) {
      toOrder();
      return;
    }

    retry();
  };

  return (
    <Result>
      <ContextCont>
        <IconCont>
          <ResultIcon
            darkSrc={isSuccess ? orderSuccessDark : orderFailDark}
            lightSrc={isSuccess ? orderSuccessLight : orderFailLigth}
            autoRotateDisable
          />
        </IconCont>

        {isSuccess ? (
          <TextCont>
            <Title>
              {isLimit
                ? _t('uVWR9GxJdEL9M3FbdnTsnF')
                : _t('f2DbckNFCXaWxiEwKhYqBW')}
            </Title>
            {!isLimit && (
              <Detail>
                {numberFormat(orderResult?.data?.toCurrencySize || 0)}{' '}
                <CoinCodeToName coin={to.coin} />
              </Detail>
            )}

            <Desc>
              {isLimit
                ? _t('ao7g454ewpwZJWYZUs7ZNC', {
                    num: numberFormat(fromSize || 0),
                    currency: fromCurrency,
                  })
                : _t('9QdRSHYTphYMRxaA2mdgCb')}
            </Desc>
          </TextCont>
        ) : isFail ? (
          <TextCont>
            <Title>{_t('vPR4Bq24AEuZ5Ct6We6EFS')}</Title>
            <Desc>
              {+orderResult.code === 4112
                ? _t('nsPWLYCQd7uf27gh99RiqG')
                : orderResult?.msg}
            </Desc>
          </TextCont>
        ) : null}
      </ContextCont>

      <BtnCont>
        <MainButton size="large" onPress={handlePress}>
          {isSuccess
            ? _t('7B7iyCieyGuCPPZ5JcbXhJ')
            : _t('bdW6jeBWc5F44wK4EEkzNr')}
        </MainButton>
      </BtnCont>

      <MarginRewardModal
        show={marginRewardModalVisible}
        setShow={() => setMarginRewardModalVisible(false)}
      />
    </Result>
  );
};
