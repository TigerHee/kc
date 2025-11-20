/**
 * Owner: willen@kupotech.com
 */
import React, {useState} from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import styled from '@emotion/native';
import useLang from 'hooks/useLang';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import {showToast} from '@krn/bridge';
import {Button} from '@krn/ui';
import {cancelLimitOrder} from 'services/order';

const Wrapper = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.colorV2.divider8};
  padding: 14px 0px 15px 0;
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 500;
  line-height: 20.8px;
  color: ${props => props.theme.colorV2.text};
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const Label = styled.Text`
  font-size: 13px;
  font-weight: 400;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '17px')};
  color: ${props => props.theme.colorV2.text40};
`;

const Value = styled.Text`
  font-size: 13px;
  font-weight: 500;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '17px')};
  color: ${props => props.theme.colorV2.text};
`;

export default ({info, onFresh}) => {
  const {
    fromCurrency,
    toCurrency,
    fromSize,
    toSize,
    expireAt,
    price,
    orderNo: bizNo,
    isCancelable,
  } = info || {};
  const {_t, dateTimeFormat, numberFormat} = useLang();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);
      const params = {
        bizNo,
      };
      await cancelLimitOrder(params);
      showToast(_t('6mQYC6Mrtwmuxj8anF9Lzs'));
      onFresh && onFresh();
    } catch (error) {
      error.msg && showToast(error.msg);
    }
    setLoading(false);
  };

  return (
    <TouchableOpacity activeOpacity={0.6}>
      <Wrapper>
        <HeaderWrapper>
          <Title>
            <CoinCodeToName coin={fromCurrency} />/
            <CoinCodeToName coin={toCurrency} />
          </Title>
          {isCancelable && (
            <Button
              type="secondary"
              size="small"
              onPress={handleCancel}
              disabled={loading}
              loading={{
                spin: loading,
                size: 'xsmall',
                color: '#fff',
              }}>
              {_t('dUw7c9cVTGh8k3RhrK1QtX')}
            </Button>
          )}
        </HeaderWrapper>
        <Row>
          <Label>{_t('8yXEiA5KZXVo1c5LapfxJn')}</Label>
          <Value>
            {numberFormat(fromSize)} <CoinCodeToName coin={fromCurrency} />
          </Value>
        </Row>
        <Row>
          <Label>{_t('qEJLEXK5QMia8vzzr7KCyG')}</Label>
          <Value>
            {numberFormat(toSize)} <CoinCodeToName coin={toCurrency} />
          </Value>
        </Row>
        <Row>
          <Label>{_t('8tXxccEW8cH4pAWm6m3iic')}</Label>
          <Value>
            {numberFormat(price)} <CoinCodeToName coin={toCurrency} />
          </Value>
        </Row>
        <Row>
          <Label>{_t('188Xf249zDgRYXywijdihy')}</Label>
          <Value>{dateTimeFormat(expireAt)}</Value>
        </Row>
      </Wrapper>
    </TouchableOpacity>
  );
};
