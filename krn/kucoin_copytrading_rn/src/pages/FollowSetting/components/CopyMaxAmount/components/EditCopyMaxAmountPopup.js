import {useMemoizedFn, useMount} from 'ahooks';
import {useRewriteFormDetail} from 'pages/FollowSetting/hooks/useRewriteFormDetail';
import React, {memo, useMemo, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import {ConfirmPopup} from 'components/Common/Confirm';
import Input from 'components/Common/Input';
import NumberFormat from 'components/Common/NumberFormat';
import {CopyAmountArrow} from 'components/Common/SvgIcon';
import TipTrigger from 'components/Common/TipTrigger';
import {BetweenWrap} from 'constants/styles';
import {useGetUSDTCurrencyInfo} from 'hooks/useGetUSDTCurrencyInfo';
import useLang from 'hooks/useLang';
import {isAndroid, numberFixed} from 'utils/helper';
import {greaterThan, lessThan, minus, plus} from 'utils/operation';
import {usePollingChangeInvestmentAndBalance} from '../hooks/usePollingChangeInvestmentAndBalance';
import {useQueryMaxChangeInvestment} from '../hooks/useQueryMaxChangeInvestment';
import {useSubmitEditCopyAmount} from '../hooks/useSubmitEditCopyAmount';
import AddOrReduceSwitch, {AmountDirectionType} from './AddOrReduceSwitch';
import EditCopyAmountDesc from './EditCopyAmountDesc';
import EditCopyAmountPnSlConflictPopup from './EditCopyAmountPnSlConflictPopup';
import MaxCanIncreaseBar from './MaxCanIncreaseBar';
import {
  AmountChangeItemWrap,
  AmountChangeLabel,
  AmountChangeRowWrap,
  AmountChangeValue,
  ErrMsg,
  InputAmountUnit,
  InputLabel,
  makeMaxAmountTipStyle,
  MaxCanDecreaseText,
} from './styles';

const EditCopyMaxAmountPopup = ({
  showConfirm,
  setConfirmShow,
  onFinalSubmit,
}) => {
  const {colorV2, isRTL} = useTheme();

  const {_t} = useLang();
  const [editAmountDirection, setEditAmountDirection] = useState(
    AmountDirectionType.Add,
  );
  const [adjustAmount, setAdjustAmount] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const isAddDirection = editAmountDirection === AmountDirectionType.Add;
  const {data: configInfo, refetch: refetchRewriteFormDetail} =
    useRewriteFormDetail();

  const {maxAmount: currentCopyMaxAmount, copyConfigId} = configInfo || {};
  const {precision, displayPrecision} = useGetUSDTCurrencyInfo();

  const {
    data: changeInvestmentInfo,
    isFetching: isQueryMaxChangeInvestmentLoading,
    refetch: refetchMaxChangeInvestment,
  } = useQueryMaxChangeInvestment({
    copyConfigId,
  });

  usePollingChangeInvestmentAndBalance({
    refetchMaxChangeInvestment,
  });

  const handleChangeDirection = val => {
    setAdjustAmount('');
    setEditAmountDirection(val);
  };

  const {maxIncrease, maxDecrease} = changeInvestmentInfo?.data || {};

  const finalShowAmount = useMemo(() => {
    if (isAddDirection) {
      return numberFixed(
        plus(currentCopyMaxAmount)(adjustAmount || 0).toFixed(),
        2,
      );
    }

    return numberFixed(
      minus(currentCopyMaxAmount)(adjustAmount || 0)?.toFixed(),
      2,
    );
  }, [adjustAmount, isAddDirection, currentCopyMaxAmount]);

  const diffAmountErrMsg = useMemo(() => {
    if (adjustAmount === '') return '';

    try {
      if (isAddDirection) {
        const isMoreLarge = greaterThan(adjustAmount)(maxIncrease);

        const isMoreSmall = lessThan(adjustAmount)(0);

        if (isMoreLarge) {
          return _t('945f97f5a4634000a5d7', {
            amount: numberFixed(maxIncrease, displayPrecision) || '-',
          });
        }

        if (isMoreSmall) {
          return _t('8a74156158034000aed7', {amount: 0});
        }
        return '';
      }

      const isMoreLargeLess = greaterThan(adjustAmount)(maxDecrease);

      return isMoreLargeLess ? _t('fafc91332c364000a3b8') : '';
    } catch (error) {
      console.log('mylog ~ diffAmountErrMsg ~ error:', error);
      return '';
    }
  }, [
    adjustAmount,
    isAddDirection,
    maxDecrease,
    _t,
    maxIncrease,
    displayPrecision,
  ]);

  const isDisabledSubmit = useMemo(
    () => Boolean(!adjustAmount || adjustAmount <= 0 || diffAmountErrMsg),
    [adjustAmount, diffAmountErrMsg],
  );

  const closePopup = useMemoizedFn(() => setConfirmShow(false));

  useMount(() => {
    Keyboard.addListener('keyboardDidShow', event => {
      // 键盘高度调整间距
      setKeyboardHeight(event.endCoordinates.height);
    });

    Keyboard.addListener('keyboardDidHide', () => {
      // 恢复默认间距
      setKeyboardHeight(0);
    });
  });

  const {
    submitEdit,
    isTransferCopyMaxAmountLoading,
    editCopyAmountPnSlConflictPopupRef,
  } = useSubmitEditCopyAmount({
    finalShowAmount,
    currentCopyMaxAmount,
    closePopup,
    refetchMaxChangeInvestment,
    refetchRewriteFormDetail,
    setEditAmountDirection,
    onFinalSubmit,
    setAdjustAmount,
    configInfo,
  });

  return (
    <>
      <ConfirmPopup
        styles={{
          containerStyle: css`
            margin: 16px 16px 0;
          `,
          // 安卓适配虚拟键盘高度
          rootStyle: css`
            padding-bottom: ${isAndroid && keyboardHeight
              ? `${keyboardHeight}px`
              : 0};
          `,
        }}
        loading={
          isQueryMaxChangeInvestmentLoading || isTransferCopyMaxAmountLoading
        }
        show={showConfirm}
        title={_t('89c594a803e94000a9e7')}
        cancelText={_t('67cf010eb33b4000a0d1')}
        confirmText={_t('b31be4f93a764000a765')}
        onCancel={closePopup}
        onOk={submitEdit}
        okButtonProps={{
          disabled: isDisabledSubmit,
        }}>
        <View>
          <AddOrReduceSwitch
            value={editAmountDirection}
            onChange={handleChangeDirection}
          />
          <AmountChangeRowWrap>
            <AmountChangeItemWrap>
              <AmountChangeLabel>
                {_t('3cf75d100a964000aaaa')}
              </AmountChangeLabel>
              <AmountChangeValue>
                {currentCopyMaxAmount || '-'}
              </AmountChangeValue>
            </AmountChangeItemWrap>
            <CopyAmountArrow />
            <AmountChangeItemWrap
              style={css`
                align-items: flex-end;
              `}>
              <AmountChangeLabel>
                {_t('12748b0b9a894000a6b7')}
              </AmountChangeLabel>
              <AmountChangeValue
                style={css`
                  text-align: right;
                `}>
                {finalShowAmount}
              </AmountChangeValue>
            </AmountChangeItemWrap>
          </AmountChangeRowWrap>
          <InputLabel>
            {isAddDirection
              ? _t('c5e2371cc5244000aa8d')
              : _t('ded54460ad994000abb5')}
          </InputLabel>
          <Input
            styles={{
              inputContainer: css`
                margin: 8px 0;
              `,
            }}
            originInputProps={{
              keyboardType: 'numeric', // 设置键盘类型为数字键盘
              textAlign: isRTL ? 'right' : 'left',
            }}
            maxLength={10}
            placeholder={_t('2c11d62d7fe14000ab28')}
            numberMode
            value={adjustAmount}
            onChange={setAdjustAmount}
            // 允许输入的数字小数位数 numberMode需为 true
            allowDecimalNum={2}
            suffix={<InputAmountUnit>{`${getBaseCurrency()}`}</InputAmountUnit>}
          />
          {!!diffAmountErrMsg && <ErrMsg>{diffAmountErrMsg}</ErrMsg>}
          <BetweenWrap>
            {isAddDirection && (
              <TipTrigger
                textStyle={makeMaxAmountTipStyle(colorV2)}
                showUnderLine
                showIcon={false}
                text={_t('65ec753121fe4000aed7')}
                message={_t('0ef841feddf84000ae2e')}
              />
            )}
            {!isAddDirection && (
              <TipTrigger
                textStyle={makeMaxAmountTipStyle(colorV2)}
                showUnderLine
                showIcon={false}
                text={_t('42d05b9008d74000a86e')}
                message={_t('49c83aac620a4000a4dd')}
              />
            )}
            {isAddDirection ? (
              <MaxCanIncreaseBar
                maxIncrease={maxIncrease}
                closeOuterPopup={closePopup}
              />
            ) : (
              <MaxCanDecreaseText>
                <NumberFormat
                  afterText={` ${getBaseCurrency()}`}
                  options={{maximumFractionDigits: precision}}
                  style={{fontWeight: '500'}}>
                  {maxDecrease}
                </NumberFormat>
              </MaxCanDecreaseText>
            )}
          </BetweenWrap>
          <EditCopyAmountDesc isAddDirection={isAddDirection} />
        </View>
      </ConfirmPopup>
      <EditCopyAmountPnSlConflictPopup
        ref={editCopyAmountPnSlConflictPopupRef}
        configInfo={configInfo}
      />
    </>
  );
};

export default memo(EditCopyMaxAmountPopup);
