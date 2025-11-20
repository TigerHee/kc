/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef, useCallback, useLayoutEffect, useImperativeHandle } from 'react';
import ToggleAuto from 'InfinityGrid/Create/ToggleAuto';
import MinPrice from 'InfinityGrid/Create/MinPrice';
import PerGridPR from 'InfinityGrid/Create/PerGridPR';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import HintText from 'Bot/components/Common/HintText';
import SymbolPrice from 'Bot/components/Common/SymbolPrice';
import { jump, floatToPercent, numberFixed, formatNumber, getAvailLang } from 'Bot/helper';
import { calcMinPR } from 'InfinityGrid/util';
import { updateRange, getAIParams } from 'InfinityGrid/services';
import clsx from 'clsx';
import Row from 'Bot/components/Common/Row';
import useMergeState from 'Bot/hooks/useMergeState.js';
import useStateRef from '@/hooks/common/useStateRef';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { tipConfig } from 'InfinityGrid/config';
import Decimal from 'decimal.js';
import CloseDataRef from 'Bot/components/Common/CloseDataRef';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import { useSnackbar } from '@kux/mui';
import { withForm } from 'Bot/components/Common/CForm';

const TipForInPriceRange = React.forwardRef((props, ref) => {
  const [{ status, addAmount }, setStatus] = useState({
    status: null,
    addAmount: 0,
  });
  useImperativeHandle(
    ref,
    () => {
      return {
        setStatus,
      };
    },
    [],
  );
  if (!status) return null;
  return (
    <Text
      as="div"
      fs={12}
      color={clsx({
        complementary: status === 'makeupagree',
        secondary: status === 'makeupprice',
      })}
    >
      {/* 钱不够 */}
      {status === 'makeupprice' && _tHTML('priceneedmore', { num: addAmount })}
      {/* 钱够 补投 */}
      {status === 'makeupagree' && _tHTML('priceneedagree', { num: addAmount })}
    </Text>
  );
});

const validate = ({ form, taskId, isOnlyCheck, tipPriceRef }) => {
  return new Promise((r, j) => {
    form
      .validateFields()
      .then((values) => {
        const { down, gridProfitRatio } = values;
        const submitData = {
          gridProfitRatio: Decimal(gridProfitRatio).div(100).valueOf(),
          down,
          taskId,
          isOnlyCheck,
        };

        updateRange(submitData)
          .then(({ data }) => {
            if (!data) {
              // 成功
              r({ isOnlyCheck, status: 'success', options: submitData });
            } else {
              let { addAmount } = data;
              const { isExtraMoney, isNeedAddMoney } = data;
              addAmount = formatNumber(Math.abs(addAmount));

              // 需要补钱
              if (isNeedAddMoney) {
                if (!isExtraMoney) {
                  // 钱不够
                  // 显示钱不够 不能不投
                  tipPriceRef.current.setStatus({
                    status: 'makeupprice',
                    addAmount,
                  });
                  r({
                    isOnlyCheck,
                    status: 'cannotmakeup',
                    options: submitData,
                  });
                } else {
                  submitData.addAmount = addAmount;
                  // 钱够 并且显示立即补投
                  tipPriceRef.current.setStatus({
                    status: 'makeupagree',
                    addAmount,
                  });
                  r({
                    isOnlyCheck,
                    status: 'makeupagree',
                    options: submitData,
                  });
                }
              } else {
                // 成功
                r({ isOnlyCheck, status: 'success', options: submitData });
              }
            }
          })
          .catch(j);
      })
      .catch(j);
  });
};

const templateType = 5;
const UpdatePriceRange = withForm()(
  ({ optionsRef, actionSheetRef, sureActionSheetRef, taskId, down: oldDown, form, symbolInfo }) => {
    const setConfirmBtnText = useCallback((okText) => {
      actionSheetRef.current.updateBtnProps({
        okText,
      });
    }, []);
    // ai参数
    const [aiInfo, setMergeState] = useMergeState({
      down: 0,
      gridProfitRatio: 0,
      fillAIParamsBtnActive: false,
    });
    // 直接先获取ai参数
    useLayoutEffect(() => {
      getAIParams(symbolCode, templateType).then(({ data }) => {
        if (data) {
          setMergeState({
            down: Number(numberFixed(data.down, pricePrecision)),
            gridProfitRatio: Number(data.gridProfitRatio),
          });
        }
      });
    }, [symbolCode]);

    const isNeedMakeUpFlag = useRef(false);
    const { symbolCode, pricePrecision } = symbolInfo;
    // 提示
    const tipPriceRef = useRef();
    // 交易对时时信息字段
    const [lastTradedPrice, setTickerSymbol] = useState(0);
    const { down } = form.getFieldsValue(['down']);
    // 计算 PR 范围
    const PRRange = calcMinPR({
      down,
      priceIncrement: symbolInfo.priceIncrement,
    });

    const useDataRef = useStateRef({
      form,
      taskId,
    });

    // 第一次检查提交
    const onConfirm = useCallback(() => {
      // 点击立即补投
      if (isNeedMakeUpFlag.current) {
        actionSheetRef.current.toggle();
        sureActionSheetRef.current.toggle();
        return;
      }
      actionSheetRef.current.updateBtnProps({
        okButtonProps: { loading: true },
      });
      const submitData = {
        form: useDataRef.current.form,
        taskId: useDataRef.current.taskId,
        isOnlyCheck: true,
        tipPriceRef,
      };
      validate(submitData)
        .then(({ isOnlyCheck, status, options }) => {
          if (!isOnlyCheck) return;
          if (status === 'success') {
            optionsRef.current = options;
            actionSheetRef.current.toggle();
            sureActionSheetRef.current.toggle();
          } else if (status === 'cannotmakeup') {
            // 不做任何操作
          } else if (status === 'makeupagree') {
            // 显示立即补投
            optionsRef.current = options;
            isNeedMakeUpFlag.current = true;
            setConfirmBtnText(_t('instancemakeup'));
          }
        })
        .finally(() => {
          actionSheetRef.current.updateBtnProps({
            okButtonProps: { loading: false },
          });
        });
    }, []);

    useBindDialogButton(actionSheetRef, {
      onConfirm,
    });
    return (
      <div className="bot-update-form">
        <Flex vc sb color="text60" mb={4} fs={14}>
          <span>
            {_t('robotparams12')}
            &nbsp;&nbsp;
            <SymbolPrice symbolCode={symbolCode} onChange={setTickerSymbol} />
          </span>
          <ToggleAuto
            aiInfo={aiInfo}
            form={form}
            setToggle={setMergeState}
            active={aiInfo.fillAIParamsBtnActive}
          />
        </Flex>

        <MinPrice symbolInfo={symbolInfo} lastTradedPrice={lastTradedPrice} />

        <PerGridPR PRRange={PRRange} />

        <TipForInPriceRange ref={tipPriceRef} />
      </div>
    );
  },
);

const OrderSure = ({
  optionsRef,
  sureActionSheetRef,
  symbolInfo,
  onFresh,
  noNeedProgressAnimation,
}) => {
  const options = optionsRef.current;
  const { base, quota, symbolNameText, pricePrecision } = symbolInfo;
  const { message } = useSnackbar();
  const useDataRef = useStateRef({
    options,
    onFresh,
    noNeedProgressAnimation,
  });
  // 二次确定终极提交
  const onConfirm = useCallback(() => {
    const { options: moptions, onFresh: monFresh } = useDataRef.current;
    sureActionSheetRef.current.updateBtnProps({
      okButtonProps: { loading: true },
    });
    try {
      updateRange({ ...moptions, isOnlyCheck: false, isAddMoney: true })
        .then(({ data }) => {
          if (!data) {
            sureActionSheetRef.current.toggle();
            message.success(_t('runningdetail'));
            monFresh && monFresh();
          }
        })
        .finally(() => {
          sureActionSheetRef.current.updateBtnProps({
            okButtonProps: { loading: false },
          });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const jumpHandler = (e) => {
    if (e.target.classList.contains('learnmore')) {
      jump(tipConfig().entryPrice.moreLinks[getAvailLang()]);
    }
  };
  useBindDialogButton(sureActionSheetRef, {
    onConfirm,
  });
  return (
    <>
      {!!options.addAmount && (
        <Text color="text" fs={14} mb={16}>
          {_t('instancemakemoney', { num: options.addAmount + quota })}
        </Text>
      )}
      <Row label={_t('share5')} value={symbolNameText} />
      <Row label={_t('minprice')} unit={quota} value={formatNumber(options.down, pricePrecision)} />
      <Row label={_t('pergridpr')} value={floatToPercent(options.gridProfitRatio)} />

      <HintText onClick={jumpHandler}>{_tHTML(`updatepricerangehint`, { base, quota })}</HintText>
    </>
  );
};

const UpdatePriceRangeWrap = ({
  actionSheetRef,
  symbolCode,
  taskId,
  down,
  onFresh,
  noNeedProgressAnimation,
}) => {
  const sureActionSheetRef = useRef();
  const optionsRef = useRef();
  const symbolInfo = useSpotSymbolInfo(symbolCode);
  return (
    <>
      <DialogRef
        ref={actionSheetRef}
        title={_t('updatepricerange')}
        cancelText={null}
        okText={_t('gridwidget6')}
        onCancel={() => actionSheetRef.current.toggle()}
        onOk={() => actionSheetRef.current.confirm()}
        size="medium"
        maskClosable
        centeredFooterButton
        tt
      >
        <UpdatePriceRange
          optionsRef={optionsRef}
          actionSheetRef={actionSheetRef}
          sureActionSheetRef={sureActionSheetRef}
          taskId={taskId}
          down={down}
          symbolInfo={symbolInfo}
        />
      </DialogRef>

      <DialogRef
        ref={sureActionSheetRef}
        title={_t('gridwidget5')}
        cancelText={null}
        okText={_t('gridwidget6')}
        onCancel={() => sureActionSheetRef.current.toggle()}
        onOk={() => sureActionSheetRef.current.confirm()}
        size="medium"
        maskClosable
        centeredFooterButton
      >
        <OrderSure
          optionsRef={optionsRef}
          sureActionSheetRef={sureActionSheetRef}
          noNeedProgressAnimation={noNeedProgressAnimation}
          symbolInfo={symbolInfo}
          onFresh={onFresh}
        />
      </DialogRef>
    </>
  );
};

const defaultProps = { taskId: '', down: '', symbolCode: '' };

export default CloseDataRef(UpdatePriceRangeWrap, defaultProps);
