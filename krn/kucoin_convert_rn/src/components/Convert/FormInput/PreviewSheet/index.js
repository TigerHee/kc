/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React, {useMemo, useState} from 'react';
import {Button, RichLocale} from '@krn/ui';
import {useSelector} from 'react-redux';
import useLang from 'hooks/useLang';
import CoinInfo from 'components/Convert/History/Detail/CoinInfo';
import FromToPrice from 'components/Convert/Common/FromToPrice';
import ErrorTip from 'components/Convert/Common/ErrorTip';
import useTracker from 'hooks/useTracker';
import ActionSheet from 'components/Common/ActionSheet';
import AccountAndIcon from 'components/Convert/Common/AccountAndIcon';
import TipTrigger from 'components/Convert/Common/TipTrigger';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import {isUndef, delt, divide, openLink} from 'utils/helper';
import {limitQuotePrice} from 'services/convert';
import {Platform} from 'react-native';

const AccountBox = styled.View`
  padding: 19px 16px 0;
`;

const ConvertBox = styled.View`
  /* margin-bottom: 16px; */
`;

const Row = styled.View`
  margin-bottom: 12px;
  flex-direction: row;
  justify-content: space-between;
`;

const Label = styled.Text`
  font-size: 14px;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text40};
  font-weight: 400;
`;

const Value = styled.Text`
  font-size: 14px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '18.2px')};
  font-weight: 500;

  color: ${({theme}) => theme.colorV2.text};
`;

const BtnBox = styled.View`
  flex-direction: row;
  margin-top: 32px;
  /* justify-content: space-between; */
`;

const OrderButton = styled(Button)`
  flex: 1;
`;

const Cont = styled.View`
  align-items: flex-end;
`;

const TextBox = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TagWrapper = styled.View`
  align-items: center;
  background-color: ${({theme}) => theme.colorV2.primary8};
  border-radius: 4px;
  padding: 2px 6px;
`;

const Tag = styled.Text`
  color: ${({theme}) => theme.colorV2.primary};
  font-size: 12px;
  font-weight: 500;
  /* line-height: 15.6px; */
`;

const RedTip = styled.Text`
  font-size: 14px;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.secondary};
`;

const ConvertPlusText = styled.Text`
  color: ${({theme}) => theme.colorV2.primary};

  font-weight: bold;
  text-decoration-line: underline;
`;

const TaxMessage = ({onLink}) => {
  const {_t} = useLang();
  /**
   * 需要把两个容器都关掉之后在跳转
   */
  const onPressPlusLink = () => {
    onLink && onLink();

    setTimeout(() => {
      openLink('/support/30538829815833');
    }, 200);
  };

  return (
    <RichLocale
      message={_t('mX6cUJ4EFJqAsG4XhZiCb6')}
      renderParams={{
        LINK: {
          component: ConvertPlusText,
          componentProps: {onPress: onPressPlusLink},
        },
      }}
    />
  );
};

export default ({
  properties,
  step,
  setStep,
  onSubmitClick,
  refreshPrice,
  confirmOrderLoading,
  quotePriceLoading,
  countdownCounter,
}) => {
  const {_t, numberFormat} = useLang();
  const {onClickTrack} = useTracker();
  const from = useSelector(state => state.convert.from);
  const to = useSelector(state => state.convert.to);
  const formStatus = useSelector(state => state.convert.formStatus);
  const selectAccountType = useSelector(
    state => state.convert.selectAccountType,
  );
  const orderType = useSelector(state => state.convert.orderType);
  const baseConfig = useSelector(state => state.convert.baseConfig);
  const priceInfo = useSelector(state => state.convert.priceInfo);
  const limitTaxInfo = useSelector(state => state.convert.limitTaxInfo);
  const [limitPriceloading, setLimitPriceloading] = useState(false);
  const [showLimitTip, setShowLimitTip] = useState(false);

  const isLimit = orderType === 'LIMIT';

  const TaxInfo = useMemo(() => {
    return isLimit ? limitTaxInfo : priceInfo;
  }, [isLimit, priceInfo, limitTaxInfo]);

  const handelCancel = _locationId => {
    try {
      onClickTrack({
        blockId: 'orderPreviewNew',
        locationId: _locationId,
        properties,
      });
    } catch (e) {}
    setStep(1);
  };

  const submitButtonProps = useMemo(() => {
    if (!isLimit) {
      if (['error', 'expire'].includes(formStatus)) {
        return {text: _t('5UQyhPJEGrJYMBux5dUmiB'), action: 'refresh'};
      }
      // 倒计时
      const text = `${_t('1bBVEC2NbMsa5bQNKLf59b')}${
        countdownCounter ? ` (${countdownCounter}s)` : ''
      }`;
      return {text: text, action: 'order'};
    } else {
      if (showLimitTip) {
        // 限价单重试
        return {text: _t('bdW6jeBWc5F44wK4EEkzNr'), action: 'order'};
      }
      return {text: _t('1bBVEC2NbMsa5bQNKLf59b'), action: 'order'};
    }
  }, [isLimit, formStatus, countdownCounter, showLimitTip]);

  /**
   * 限价单下单之前先去拉一次接口
   * 如果 (to.amount / from.amount) < 接口.price 就禁止用户提交
   */
  const checkPriceWhenLimitOrder = async () => {
    try {
      setLimitPriceloading(true);

      const params = {
        fromCurrency: from.coin,
        toCurrency: to.coin,
        fromSize: from.amount,
        toSize: to.amount,
        coefficientEnable: true,
      };
      const {data} = await limitQuotePrice(params);
      setLimitPriceloading(false);

      const orderPrice = divide(to.amount, from.amount);

      // 如果获得小于市价，禁止提交
      if (delt(orderPrice, data.price)) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log('限价单下单预检接口失败');
      setLimitPriceloading(false);

      return false;
    }
  };

  const handleClick = async () => {
    const {action} = submitButtonProps;
    if (action === 'refresh') {
      refreshPrice && refreshPrice();
    }

    if (action === 'order') {
      if (isLimit) {
        // setShowLimitTip(false);
        const canOrdered = await checkPriceWhenLimitOrder();
        if (canOrdered) {
          setShowLimitTip(false);

          onSubmitClick && (await onSubmitClick());
        } else {
          setShowLimitTip(true);
        }
      } else {
        onSubmitClick && (await onSubmitClick());
      }
    }
  };

  const buttonLoading =
    confirmOrderLoading || quotePriceLoading || limitPriceloading;

  return (
    <ActionSheet
      id="preview-drawer"
      show={step === 2}
      onClose={() => handelCancel(6)}
      title={_t('tXTmEKjk87GVBq8eBBnKwZ')}>
      <AccountBox>
        <CoinInfo
          withAnimation
          info={{
            from: {
              coin: from.coin,
              num: from.amount,
              direction: _t('f1fUs5np2HnVWsgQPhB9LC'),
            },
            to: {
              coin: to.coin,
              num: to.amount,
              direction: _t('1izXduRcCW4CqMQTDi3Nry'),
            },
          }}
        />

        <ConvertBox>
          {/* 限价单时展示 */}
          {isLimit && (
            <Row>
              <TipTrigger
                text={_t('nmDQYPhTvaprEUDn6eDzac')}
                message={_t('kEp69coZeZ44vPQzUrSr1P')}
              />
              <Value>
                {_t('wjtgLLXbaaoVDzC1LaF3mr', {
                  num: baseConfig?.limitOrderValidityPeriodDay || '--',
                })}
              </Value>
            </Row>
          )}

          <Row>
            <TipTrigger
              text={_t('fee')}
              message={_t('wPRQ2qp2VeKe8nqCzAs6Cr')}
            />
            <TagWrapper>
              <Tag>{_t('5UoUji8yQgm9qSDZjADU5i')}</Tag>
            </TagWrapper>
          </Row>

          {!isUndef(TaxInfo?.taxSize) && (
            <Row>
              <TipTrigger
                text={_t('a5tsFk78WLBMjP7PL518CL')}
                message={
                  <TaxMessage
                    onLink={() => {
                      setStep(1);
                    }}
                  />
                }
              />
              <Value>
                {numberFormat(TaxInfo?.taxSize)}{' '}
                <CoinCodeToName coin={TaxInfo?.taxCurrency} />
              </Value>
            </Row>
          )}
          <Row>
            <TextBox>
              <Label>{_t('9sTRXSwKpKbyvA95kD8GBz')}</Label>
            </TextBox>
            <Value>
              <AccountAndIcon type={selectAccountType} />
            </Value>
          </Row>
          <Row>
            <TextBox>
              <Label>{_t('f2DbckNFCXaWxiEwKhYqBW')}</Label>
            </TextBox>
            <Value>
              {numberFormat(to.amount)} <CoinCodeToName coin={to.coin} />
            </Value>
          </Row>
          <Row>
            <TipTrigger
              text={_t('8tXxccEW8cH4pAWm6m3iic')}
              message={_t('hJcaFw4JoE8xd4f4BzVcJ7')}
            />
            <Cont>
              <FromToPrice
                color="text"
                textStyle={{fontWeight: '500'}}
                isLimit={isLimit}
              />
            </Cont>
          </Row>
        </ConvertBox>

        {!isLimit && <ErrorTip />}

        {isLimit && <RedTip>{_t('fVeGGxXKyZKigpENkPnXWJ')}</RedTip>}

        {isLimit && showLimitTip && (
          <RedTip style={{marginTop: 6}}>{_t('uoTqfmLbhMfgM6w6dYdDfA')}</RedTip>
        )}

        <BtnBox>
          {/* 限价单如果失败需要重试 */}
          {showLimitTip && (
            <OrderButton
              size="large"
              type="secondary"
              onPress={() => handelCancel(6)}
              style={{marginRight: 16}}>
              {_t('96oo8Yq5o389Qt4hNRmqty')}
            </OrderButton>
          )}

          <OrderButton
            size="large"
            disabled={buttonLoading}
            loading={{
              spin: buttonLoading,
              color: '#fff',
              size: 'small',
            }}
            onPress={handleClick}>
            {submitButtonProps?.text}
          </OrderButton>
        </BtnBox>
      </AccountBox>
    </ActionSheet>
  );
};
