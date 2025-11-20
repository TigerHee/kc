import {useDebounceFn, useToggle} from 'ahooks';
import React, {useCallback, useRef, useState} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {showToast} from '@krn/bridge';
import {Loading, useTheme} from '@krn/ui';

import convertIc from 'assets/common/ic-convert-add.png';
import tetherIc from 'assets/common/ic-tether-ic.png';
import {HistoryRecordIcon} from 'components/Common/SvgIcon';
import {RouterNameMap} from 'constants/router-name-map';
import {RowWrap, SecondaryStyleText} from 'constants/styles';
import {useGetUSDTCurrencyInfo} from 'hooks/useGetUSDTCurrencyInfo';
import useLang from 'hooks/useLang';
import {useParams} from 'hooks/useParams';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {
  countDecimalPlaces,
  isUndef,
  numberFixed,
  removeTrailingZeros,
} from 'utils/helper';
import DirectionCard from './components/DirectionCard';
import {useAmountShowAndTip} from './hooks/useAmountShowAndTip';
import {useClick} from './hooks/useClick';
import {useFitSceneToPressBack} from './hooks/useFitSceneToPressBack';
import {usePullBalance} from './hooks/usePullBalance';
import {DIRECTION_MAP} from './constant';
import {
  AccountLabel,
  AmountCard,
  BottomDesc,
  CenterErrMsg,
  CoinText,
  CoinUnitText,
  Container,
  Content,
  ConvertIcon,
  GapLine,
  InputPrefixChar,
  InputPressableArea,
  InputRowWrap,
  MaxText,
  MRowWrap,
  StyledButton,
  StyledHeader,
  StyledInputAmount,
  TetherIc,
  TradingAccountAmount,
  TransferTipText,
} from './styles';

const HistoryBtn = () => {
  const {push} = usePush();
  const {subUID} = useParams();
  const {onClickTrack} = useTracker();

  const gotoHistory = () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'history',
    });
    push(RouterNameMap.AccountTransferHistory, {subUID});
  };

  return (
    <Pressable onPress={gotoHistory}>
      <HistoryRecordIcon />
    </Pressable>
  );
};
// 划转最大可输入小数位数 2 位
const TRANSFER_INPUT_MAX_PRECISION = 2;
// 提交划转 最大支持精度 8 位
const TRANSFER_SUBMIT_MAX_LONG_PRECISION = 8;
const AccountTransfer = () => {
  const {colorV2} = useTheme();
  const textInputRef = useRef(null);
  const {currency = getBaseCurrency()} = useParams();
  const {precision} = useGetUSDTCurrencyInfo();
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const onPressBack = useFitSceneToPressBack();
  const [value, setValue] = useState();

  const [longDigitValue, setLongDigitValue] = useState(false);
  const isLongNumber = `${value}`.length > 5;
  const [isParentOutAccDirection, {toggle: toggleTransferDirection}] =
    useToggle(true);

  const {
    parentAvailableBalance,
    subAvailableBalance,
    config,
    refresh,
    isQueryLoading,
  } = usePullBalance();

  const {transferErrMsg, bottomTipText, disabledTransfer, showMaxValidBalance} =
    useAmountShowAndTip({
      isParentOutAccDirection,
      parentAvailableBalance,
      subAvailableBalance,
      config,
      value,
    });

  const {run: attendAboveLimit} = useDebounceFn(
    () => {
      showToast(_t('7f027118066d4000a529'));
    },
    {
      leading: true,
      trailing: false,
      wait: 500,
    },
  );
  const onInputValue = useCallback(
    originText => {
      try {
        // 逗号转小数点
        let text = originText?.replace?.(',', '.');

        setLongDigitValue(false);
        if (!text) {
          return setValue(text);
        }
        // 允许数字和小数点 此处产品确认 2 位小数
        const regex = new RegExp(
          `^\\d+\\.?\\d{0,${Math.floor(TRANSFER_INPUT_MAX_PRECISION)}}$`,
        );

        if (!regex.test(text)) {
          return;
        }
        const maxInput = Math.pow(10, 10);
        if (+text > maxInput) {
          attendAboveLimit();

          return;
        }
        // 限制最开头只能最多输入一个0
        if (/^0{2,}/.test(text)) {
          return;
        }
        // 不能输入099这样的数字 ==> 99
        if (/^0\d+/.test(text)) {
          text = String(Number(text));
        }
        // 上一次是0， 这次是90， 强制变成9, 也就是光标无论在0的前面还是后面， 都要清除0
        // 数字只能从左到右输入
        if (value === '0' && /^[1-9]0$/.test(text)) {
          text = text.replace(/0$/, '');
        }
        setValue(text);
      } catch (error) {
        console.log('mylog ~ AccountTransfer ~ error:', error);
      }
    },

    [value, attendAboveLimit],
  );

  const handleResetValue = () => {
    setValue(0);
  };

  const {submitTransfer, isSubmitTransferLoading, gotoNativeTransferPage} =
    useClick({refresh, handleResetValue, onPressBack});

  const handleToggleDirection = () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'switch',
    });
    toggleTransferDirection();
    handleResetValue();
    setLongDigitValue(false);
  };

  const onPressTransfer = () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'confirm',
    });

    submitTransfer({
      amount: longDigitValue || value,
      direction: isParentOutAccDirection ? DIRECTION_MAP.OUT : DIRECTION_MAP.IN,
    });
  };

  const focusInput = () => {
    textInputRef.current?.focus?.();
  };

  const handleMaxBtn = () => {
    try {
      const targetValue = isParentOutAccDirection
        ? parentAvailableBalance
        : config?.subToMainAvailableTransfer;

      const fixedValue = +numberFixed(
        targetValue,
        TRANSFER_INPUT_MAX_PRECISION,
      );

      if (isUndef(fixedValue)) {
        return;
      }

      setValue(`${fixedValue}`);
      focusInput();
      const targetOriginDigit = countDecimalPlaces(
        removeTrailingZeros(targetValue),
      );

      if (targetOriginDigit > TRANSFER_INPUT_MAX_PRECISION) {
        // 产品逻辑 如果可转出/转入 金额精度大于 2 位小数，展示约等于提交时传 8 位精度 ，此处存8 位精度金额
        setLongDigitValue(
          +numberFixed(targetValue, TRANSFER_SUBMIT_MAX_LONG_PRECISION),
        );
      }
    } catch (error) {
      console.error('mylog ~ handleMaxBtn ~ error:', error);
    }
  };

  return (
    <Container>
      <StyledHeader
        onPressBack={onPressBack}
        title={_t('3788a94ec8964000a2e8')}
        rightSlot={<HistoryBtn />}
      />

      <Content>
        <DirectionCard
          isParentOutAccDirection={isParentOutAccDirection}
          toggle={handleToggleDirection}
        />
        <AmountCard>
          <RowWrap>
            <TetherIc source={tetherIc} />
            <CoinText>{currency}</CoinText>
            <SecondaryStyleText>Tether</SecondaryStyleText>
          </RowWrap>
          <TransferTipText>{_t('42ddb01ca3ab4000a1f7')}</TransferTipText>
          <InputPressableArea onPress={focusInput}>
            <InputRowWrap>
              {/* //如果存在长精度金额 展示约等于符号 */}
              {!!longDigitValue && (
                <InputPrefixChar shrink={isLongNumber}>≈</InputPrefixChar>
              )}
              <StyledInputAmount
                ref={textInputRef}
                keyboardType="numeric" // 设置键盘类型为数字键盘
                shrink={isLongNumber}
                value={value}
                onChangeText={onInputValue}
                placeholder="0"
                placeholderTextColor={colorV2.text20}
              />
              <CoinUnitText shrink={isLongNumber}>{currency}</CoinUnitText>
            </InputRowWrap>
          </InputPressableArea>
          <View
            style={css`
              align-items: center;
            `}>
            {transferErrMsg ? (
              <CenterErrMsg>{transferErrMsg}</CenterErrMsg>
            ) : null}

            <MRowWrap>
              <AccountLabel>
                {isParentOutAccDirection
                  ? `${_t('a91a393bf7354000aadd')}: `
                  : _t('7ca2c9a108944000a695')}
              </AccountLabel>

              <RowWrap>
                {isQueryLoading ? (
                  <Loading spin size="small" showKcIcon={false} />
                ) : (
                  <>
                    <TradingAccountAmount
                      options={{maximumFractionDigits: precision}}>
                      {showMaxValidBalance}
                    </TradingAccountAmount>
                    {isParentOutAccDirection && (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={gotoNativeTransferPage}>
                        <ConvertIcon source={convertIc} />
                      </TouchableOpacity>
                    )}
                    <GapLine />
                    <Pressable onPress={handleMaxBtn}>
                      <MaxText>{_t('12316d79076d4000a9f0')}</MaxText>
                    </Pressable>
                  </>
                )}
              </RowWrap>
            </MRowWrap>
          </View>
        </AmountCard>

        <StyledButton
          disabled={disabledTransfer}
          loading={isSubmitTransferLoading}
          onPress={onPressTransfer}>
          {_t('bhfjS7Y6HXsKuQzsXGDpgQ')}
        </StyledButton>
        <BottomDesc>{bottomTipText}</BottomDesc>
      </Content>
    </Container>
  );
};

export default AccountTransfer;
