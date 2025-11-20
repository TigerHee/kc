/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect, useMemo, useCallback, useState, useRef} from 'react';
import styled from '@emotion/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeBackground,
  dropZero,
  numberFixed,
  handleInputAmountByPrecision,
  degt,
  delt,
  multiply,
  min,
  equals,
} from 'utils/helper';
import {currencyMap} from 'config';
import CoinSelector from 'components/Convert/Common/CoinSelector';
import {useNavigation} from '@react-navigation/native';
import useLang from 'hooks/useLang';
import {TouchableOpacity} from 'react-native';
import useTracker from 'hooks/useTracker';
import plus from 'assets/convert/addplus.png';
import {useTheme} from '@krn/ui';
import withAuth from 'hooks/withAuth';
const InputItem = styled.View`
  background-color: ${({theme, changeBg}) =>
    theme.colorV2[changeBg ? 'primary4' : 'cover4']};
  border-radius: 12px;
  padding: 18px 12px 16px;
`;

const TitleRow = styled.View`
  margin-bottom: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: ${({theme}) => theme.colorV2.text60};
`;

const BalanceWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Plus = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 4px;
`;

const InputView = styled.View`
  flex-direction: row;
  border-radius: 6px;
  align-items: center;
`;

const Label = styled.Text`
  font-size: 14px;
  line-height: 18px;
  color: ${({theme}) => theme.colorV2.text60};
`;

const InputBox = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const Placeholder = styled.Text`
  font-size: 20px;
  height: 33px;
  font-weight: 600;
  position: absolute;
  top: -40px;
  opacity: 0;
`;

const Input = styled.TextInput`
  font-size: 20px;
  /* height: 33px; */
  font-weight: 600;
  flex: 1;
  color: ${({theme}) => theme.colorV2.text};
  padding-top: 0;
  padding-bottom: 0;
  padding: 0;
  top: ${({isIOS}) => (isIOS ? 0 : '2px')};
  text-align: ${({theme}) => (theme.isRTL ? 'right' : 'left')};
  align-items: center;
  margin-bottom: 2px;
`;

const Footer = styled.View`
  min-height: 16px;
`;

const MaxBtn = styled.TouchableOpacity`
  flex-shrink: 0;
  top: 1px;
  padding-left: 12px;
`;

const MaxText = styled.Text`
  line-height: 22px;
  font-size: 14px;
  font-weight: bold;
  color: ${({theme}) => theme.colorV2.primary};
  margin-right: 6px;
`;

const Tips = styled.Text`
  height: 16px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: ${({theme, type}) =>
    type === 'error' ? theme.colorV2.secondary : theme.colorV2.text40};
`;

const AuthInput = withAuth(Input);
const AuthMaxBtn = withAuth(MaxBtn);
const AuthTouchableOpacity = withAuth(TouchableOpacity);

export default ({
  direction,
  onChange,
  setBalance,
  setStep,
  otherFooter,
  data = {},
  ...restProps
}) => {
  const isFrom = direction === 'from';

  const navigation = useNavigation();
  const {onClickTrack} = useTracker();
  const theme = useTheme();

  const {_t, numberFormat} = useLang();
  const [changeBg, setChangeBg] = useState(false);
  const textInputRef = useRef(null);
  const placeholderRef = useRef(null);
  const [fontSize, setFontSize] = useState(20);

  const from = useSelector(state => state.convert.from) || {};
  const to = useSelector(state => state.convert.to) || {};
  const focusType = useSelector(state => state.convert.focusType);
  const priceInfo = useSelector(state => state.convert.priceInfo);
  const orderType = useSelector(state => state.convert.orderType);
  const realInputFocus = useSelector(state => state.convert.realInputFocus);
  const triggerEmptyValidate = useSelector(
    state => state.convert.triggerEmptyValidate,
  );
  const currentEstimates = useSelector(state => state.convert.currentEstimates);

  const isLogin = useSelector(state => state.app.isLogin);
  const currency = useSelector(state => state.app.currency);
  const prices = useSelector(state => state.app.prices);

  const dispatch = useDispatch();

  const quotePriceLoading = useSelector(
    state => state.loading.effects['convert/quotePrice'],
  );

  const {
    coin,
    amount: inputAmount,
    precision,
    minNumber,
    maxNumber,
    availableBalance,
  } = data || {};

  const isLimit = orderType === 'LIMIT';

  // 经过精度处理后的余额
  const displayBalance = useMemo(() => {
    if (isLogin) {
      return dropZero(numberFixed(availableBalance, precision));
    }
    return 0;
  }, [isLogin, availableBalance, precision]);

  useEffect(() => {
    setBalance && setBalance(displayBalance);
  }, [displayBalance, setBalance]);

  const handleClickMax = useCallback(() => {
    const minV = min(displayBalance, maxNumber).toFixed();

    if (quotePriceLoading || equals(inputAmount, minV)) return;

    dispatch({
      type: 'convert/update',
      payload: {
        focusType: 'from',
        realInputFocus: 'from',
        from: {
          ...from,
          amount: minV,
        },
        to: {...to, amount: ''},
        priceInfo: {...priceInfo, tickerId: null},
        currentEstimates: 'to',
      },
    });

    onChange && onChange(direction);
  }, [
    direction,
    dispatch,
    displayBalance,
    quotePriceLoading,
    inputAmount,
    maxNumber,
    isLogin,
    onChange,
  ]);

  /**
   * 输入框提示类型及文案校验逻辑
   * 1. from 时需要验证 可用余额
   * 2. 验证输入额度是否在区间内
   * 3. 约等于多少法币
   */
  const inputTips = useMemo(() => {
    // 如果消耗大于可用
    if (isFrom && inputAmount) {
      if (degt(+inputAmount, +availableBalance)) {
        return {
          type: 'error',
          text: _t('9cPi7vcEsuQow3KNJ5fKct'),
        };
      }
    }

    // 没在区间范围内
    if (inputAmount) {
      if (inputAmount && +inputAmount === 0) {
        return {
          type: 'error',
          text: _t('kV8Afv8nCC3Jkb57hQ4VX2'),
        };
        // 市价 & 限价 预估的值不校验下限，要交验上限
      } else if (
        +inputAmount &&
        delt(+inputAmount, +minNumber) &&
        realInputFocus !== direction
      ) {
        return {
          type: '',
          text: '',
        };
      } else if (
        isNaN(+inputAmount) ||
        degt(+inputAmount, +maxNumber) ||
        delt(+inputAmount, +minNumber)
      ) {
        return {
          type: 'error',
          text: _t('edSaMSNzKwvkbK6BUXwXUv', {
            minNumber: numberFormat(minNumber),
            maxNumber: numberFormat(maxNumber),
          }),
        };
      }
    }

    /**
     * 约等于
     * 市价只显示 输入的
     * 限价是两个都要显示
     */
    if (
      (!isLimit && +inputAmount && realInputFocus === direction) ||
      (isLimit && +inputAmount)
    ) {
      const currencyPrice = prices[coin] || 0;
      const char = currencyMap[currency] || currency;
      return {
        type: realInputFocus === direction ? 'success' : '',
        text: ` ≈ ${char} ${numberFormat(
          numberFixed(multiply(+inputAmount, currencyPrice), 2),
        )}`,
      };
    }

    if (triggerEmptyValidate && !inputAmount) {
      return {
        type: 'error',
        text: _t('kV8Afv8nCC3Jkb57hQ4VX2'),
      };
    }

    return {type: realInputFocus === direction ? 'success' : ''};
  }, [
    direction,
    focusType,
    inputAmount,
    availableBalance,
    minNumber,
    maxNumber,
    prices,
    coin,
    currency,
    isFrom,
    realInputFocus,
    triggerEmptyValidate,
    isLimit,
  ]);

  useEffect(() => {
    // 验证失败 或 当取激活的输入框未输入内容
    const validateFailed = inputTips.type === 'error' || !inputAmount;
    // (realInputFocus === direction && !inputAmount);

    dispatch({
      type: 'convert/update',
      payload: isFrom
        ? {fromValidate: !validateFailed}
        : {toValidate: !validateFailed},
    });
  }, [inputTips.type, inputAmount, isFrom]);

  /**
   * 跳转到币种选择页面
   */
  const handleOpenChangeCoin = () => {
    onClickTrack({
      blockId: 'convertInputNew',
      locationId: isFrom ? 2 : 3,
    });
    setStep(1);
    navigation.navigate('ConvertCoinListPage', {
      direction: direction,
      coinSelected: coin,
      type: 'convert',
      backRoute: 'ConvertPage',
      orderType,
      step: 1,
    });
  };

  const title = isFrom
    ? _t('f1fUs5np2HnVWsgQPhB9LC')
    : _t('1izXduRcCW4CqMQTDi3Nry');

  const handleOpenDepositeSheet = () => {
    dispatch({
      type: 'convert/update',
      payload: {
        openDepositeSheet: true,
      },
    });
  };

  const handleChangeText = useCallback(
    async amount => {
      amount = handleInputAmountByPrecision(amount, precision);

      // 市价单
      if (!isLimit) {
        const payload = {
          from: {
            ...from,
            amount: isFrom ? amount : '',
          },
          to: {
            ...to,
            amount: !isFrom ? amount : '',
          },
          priceInfo: {...priceInfo, tickerId: null},
          focusType: direction,
          realInputFocus: direction,
          formStatus: 'normal',
          currentEstimates: direction === 'from' ? 'to' : 'from',
        };

        dispatch({
          type: 'convert/update',
          payload: payload,
        });
      } else {
        const payload = {
          // focusType: isFrom ? 'from' : 'to', // 限价单不能通过这里去触发 focusType
          from: {
            ...from,
            amount: isFrom ? amount : from.amount,
          },
          to: {
            ...to,
            amount: !isFrom ? amount : to.amount,
          },
          realInputFocus: direction,
        };

        dispatch({
          type: 'convert/update',
          payload: payload,
        });
      }
      onChange && onChange(direction);
    },
    [
      dispatch,
      from,
      isLogin,
      priceInfo,
      to,
      isFrom,
      precision,
      isLimit,
      direction,
    ],
  );

  // 切换另外一个输入框的背景色
  useEffect(() => {
    if (currentEstimates === direction && inputAmount) {
      changeBackground(setChangeBg);
    } else {
      setChangeBg(false);
    }
  }, [inputAmount, currentEstimates, direction]);

  const placeholder = `${numberFormat(minNumber) || 0}～${
    numberFormat(maxNumber) || 0
  }`;

  /**
   * 当 placeholder 超出 输入框长度时，需要对 placeholder 进行缩放
   */
  useEffect(() => {
    if (textInputRef.current && placeholderRef.current) {
      textInputRef.current.measure((x, y, width) => {
        placeholderRef.current?.measure((_x, _y, _width) => {
          if (width && _width > width) {
            const newFontSize = Math.floor((width / _width) * 20);

            setFontSize(newFontSize);
          } else {
            setFontSize(20);
          }
        });
      });
    }
  }, [placeholder]);

  return (
    <InputItem changeBg={changeBg} {...restProps}>
      <TitleRow dir={direction}>
        <Label>{title}</Label>

        <BalanceWrapper>
          <Label>
            {_t('oTWzAYTsVvfiq8gyrmAA9w', {
              num: numberFormat(displayBalance) || '--',
            })}
          </Label>

          {isFrom && (
            <AuthTouchableOpacity
              activeOpacity={1}
              onPress={handleOpenDepositeSheet}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Plus source={plus} />
            </AuthTouchableOpacity>
          )}
        </BalanceWrapper>
      </TitleRow>

      <InputView>
        <InputBox>
          <AuthInput
            selectionColor={theme.colorV2.primary}
            // isIOS={Platform.OS === 'ios'}
            placeholder={placeholder}
            placeholderTextColor={theme.colorV2.text20}
            onChangeText={handleChangeText}
            keyboardType="numeric"
            inputmode="numeric"
            value={inputAmount}
            multiline={false}
            ref={textInputRef}
            style={
              inputAmount
                ? {}
                : {fontSize, paddingVertical: 0, height: fontSize * 1.5}
            }
            // value={inputFormatter(inputAmount, numberFormat)}
          />
          {/* 作为量尺寸用 */}
          <Placeholder pointerEvents="none" ref={placeholderRef}>
            {placeholder}
          </Placeholder>
        </InputBox>

        {isFrom && isLogin && (
          <AuthMaxBtn activeOpacity={0.6} onPress={handleClickMax}>
            <MaxText>{_t('pvokLEEChLUXmCbBFaGJeD')}</MaxText>
          </AuthMaxBtn>
        )}

        <CoinSelector coin={coin} onPress={handleOpenChangeCoin} />
      </InputView>

      <Footer>
        {inputTips?.text ? (
          <Tips type={inputTips?.type}>{inputTips?.text}</Tips>
        ) : null}
        {otherFooter}
      </Footer>
    </InputItem>
  );
};
