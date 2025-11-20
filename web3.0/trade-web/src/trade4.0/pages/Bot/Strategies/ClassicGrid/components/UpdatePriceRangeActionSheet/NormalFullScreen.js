/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useCallback, useContext, useLayoutEffect } from 'react';
import { formatNumber } from 'Bot/helper';
import { getExtendAddAmount } from 'ClassicGrid/services';
import HintText from 'Bot/components/Common/HintText';
import Popover from 'Bot/components/Common/Popover';
import useStateRef from '@/hooks/common/useStateRef';
import useMergeState from 'Bot/hooks/useMergeState';
import useBalance from 'Bot/hooks/useBalance';
import { doPostAPI, fullScreenLangTextConfig } from './RangeWidgets';
import ActionSheetController from './ActionSheetController';
import SectionRadio from 'Bot/components/Common/SectionRadio';
import AccountBalance from 'Bot/components/Common/Investment/AccountBalance';
import { _t, _tHTML } from 'Bot/utils/lang';
import { css } from '@emotion/css';
import { useBindDialogButton } from 'Bot/components/Common/DialogRef.js';
import { Text, Flex } from 'Bot/components/Widgets';
import styled from '@emotion/styled';

const radioIconClass = css`
  svg {
    top: 32px;
    margin: unset;
  }
`;
const MAccountBalance = styled(AccountBalance)`
  margin-top: 6px;
  margin-bottom: 6px;
  display: inline-flex;
  .balance-name {
    margin-right: 12px;
  }
  .balance-name,
  .balance-value {
    font-size: 14px;
  }
`;
// 获取扩展区间追加 并校验账户余额
const useFetchExtendAddAmount = ({ taskId, aiRange, symbolCode, activeType, quoteAmount }) => {
  const [mergeState, setMergeState] = useMergeState({
    extendAddAmount: 0,
    isInit: false,
    isNotEnough: false,
    isTransfterAccuntFetch: false,
  });

  useLayoutEffect(() => {
    getExtendAddAmount({
      taskId,
      down: aiRange.min,
      up: aiRange.max,
      depth: Number(aiRange.placeGrid) + 1,
      symbol: symbolCode,
    })
      .then(({ data: extendData }) => {
        const extendAddAmount = Number(extendData.addAmount);
        setMergeState({
          extendAddAmount,
          isNotEnough: extendAddAmount > quoteAmount,
        });
      })
      .finally(() => {
        setMergeState({
          isInit: true,
        });
      });
  }, []);

  const { isInit, extendAddAmount, isNotEnough } = mergeState;
  let isShowTransfer = false;
  let isDisabled = false;
  if (!isInit) {
    isShowTransfer = false;
    isDisabled = true;
  } else if (isNotEnough) {
    isShowTransfer = extendAddAmount > quoteAmount;
  } else {
    isShowTransfer = false;
  }

  isDisabled = activeType === 'extend' ? isShowTransfer : false;
  return {
    extendAddAmount,
    isShowTransfer,
    isDisabled,
  };
};

const NormalFullScreen = () => {
  const controllerRef = useContext(ActionSheetController);
  const {
    options,
    symbolInfo,
    normalFullScreenActionSheetRef,
    updateRangeConfirmActionSheetRef,
    taskId,
  } = controllerRef.current;
  const { basePrecision, quotaPrecision, pricePrecision, base, quota, symbolCode } = symbolInfo;
  const { quoteAmount } = useBalance(symbolInfo, 0, false);
  const rangeNormal = `${formatNumber(options.min, pricePrecision)}～
    ${formatNumber(options.max, pricePrecision)}`;

  // 计算出ai参数
  const aiRange = options.aiRange || { min: 0, max: 0 };
  const rangeExtend = `${formatNumber(aiRange.min, pricePrecision)}～
    ${formatNumber(aiRange.max, pricePrecision)}`;

  const [activeType, setActiveType] = useState('normal');

  // 获取扩展区间追加
  const { extendAddAmount, isShowTransfer, isDisabled } = useFetchExtendAddAmount({
    taskId,
    aiRange,
    symbolCode,
    activeType,
    quoteAmount,
  });


  //   构造确认页面 提交的数据
  const normalSubmitData = {
    type: activeType,
    taskId,
    min: options.min,
    max: options.max,
    placeGrid: options.placeGrid,
    addAmount: options.addAmount,
    sellBaseSize: options.sellBaseSize,
  };
  const extendSubmitData = {
    type: activeType,
    taskId,
    min: aiRange.min,
    max: aiRange.max,
    placeGrid: aiRange.placeGrid,
    addAmount: extendAddAmount,
    sellBaseSize: 0,
  };
  const useSubmitDataRef = useStateRef(
    activeType === 'normal'
      ? {
          ...normalSubmitData,
          doPostAPI: () => doPostAPI(normalSubmitData),
        }
      : {
          ...extendSubmitData,
          doPostAPI: () => doPostAPI(extendSubmitData),
        },
  );
  const onConfirm = useCallback(() => {
    if (isDisabled) return;
    controllerRef.current.options = useSubmitDataRef.current;
    normalFullScreenActionSheetRef.current.toggle();
    updateRangeConfirmActionSheetRef.current.toggle();
  }, [isDisabled]);

  useLayoutEffect(() => {
    normalFullScreenActionSheetRef.current.updateBtnProps({
      okButtonProps: { disabled: isDisabled },
    });
  }, [isDisabled]);

  useBindDialogButton(normalFullScreenActionSheetRef, {
    onConfirm,
  });

  if (!aiRange.min || !aiRange.max) return null;

  return (
    <SectionRadio onChange={setActiveType} defaultValue="normal" className={radioIconClass}>
      <div value="normal">
        <Flex vc fs={16} lh="130%" mb={10}>
          <Text color="text60" mr={12}>
            {_t('card13')}
          </Text>
          <Text color="text" fw={500}>
            {rangeNormal} {quota}
          </Text>
        </Flex>
        <Flex vc fs={16} lh="130%">
          <Text color="text60" mr={12}>
            {_t('robotparams10')}
          </Text>
          <Text color="text" fw={500}>
            {options.placeGrid}
          </Text>
        </Flex>

        {Number(options.addAmount) > 0 && (
          <Flex vc fs={16} lh="130%" mt={10}>
            <Text color="text60" mr={12}>
              {_t('hLtxXSxhoBH7tkCiKy2pG9')}
            </Text>
            <Text color="primary" fw={500}>
              {formatNumber(options.addAmount, quotaPrecision)} {quota}
            </Text>
          </Flex>
        )}

        <Text color="complementary" fs={14} mt={6} as="div">
          {_t('3eSMT69uKhsiDgq53Mmaqp', {
            num: formatNumber(options.sellBaseSize, basePrecision),
            base,
          })}
        </Text>
      </div>

      <div value="extend">
        <Flex vc fs={16} lh="130%" mb={10}>
          <Text color="text60" mr={12}>
            {_t('card13')}
          </Text>
          <Text color="text" fw={500}>
            {rangeExtend} {quota}
          </Text>
        </Flex>
        <Flex vc fs={16} lh="130%">
          <Text color="text60" mr={12}>
            {_t('robotparams10')}
          </Text>
          <Text color="text" fw={500}>
            {aiRange.placeGrid}
          </Text>
        </Flex>
        {extendAddAmount > 0 && (
          <Flex vc fs={16} lh="130%" mt={10}>
            <Text color="text60" mr={12}>
              {_t('hLtxXSxhoBH7tkCiKy2pG9')}
            </Text>
            <Text color="primary" fw={500}>
              {formatNumber(extendAddAmount, quotaPrecision)} {quota}
            </Text>
          </Flex>
        )}
        <Popover
          placement="top-start"
          title={_t('1xRZQ7G13kZRcxiqjLD3Mh')}
          content={_t(fullScreenLangTextConfig[aiRange.extendDirection], {
            base,
          })}
        >
          <div className="just-placeholder mt-10">
            <HintText as="span" type="primary" className="underline fs-14" simple>
              {_t('uJNGJzVmibUT6xnCkd9Zt3', { base })}
            </HintText>
          </div>
        </Popover>

        {isShowTransfer && (
          <>
            <MAccountBalance symbolCode={symbolCode} />
            <div className="fs-14 color-secondary">{_t('iX9xEVFCgHF4fobac8VA7c', { quota })}</div>
          </>
        )}
      </div>
    </SectionRadio>
  );
};

export default NormalFullScreen;
