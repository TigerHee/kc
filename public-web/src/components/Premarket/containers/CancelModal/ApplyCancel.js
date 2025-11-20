/**
 * Owner: june.lee@kupotech.com
 */

import { useLocale } from '@kucoin-base/i18n';
import { InputNumber, Slider, Status } from '@kux/mui';
import { useCallback, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { sub } from 'src/helper';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import { Modal, Tooltip } from '../../components';
import { multiply } from '../../util';
import { CurrencyWithUnit, InfoCard } from './shared';
import {
  PledgeCompensateRatioSliderInputRoot,
  StyledAlert,
  StyledApplyCancelSucDialog,
  StyledDialogBodyWrapper,
} from './styledComponents';

function PledgeCompensateRatioSliderInput({ initValue, min = 0, max = 100, onChange }) {
  const { isRTL } = useLocale();
  const [innerValue, setInnerValue] = useState(initValue);
  const genMarkLabel = (number) => `${number}%`;
  const validateValue = (val) => {
    if (!val || !Number.isInteger(+val)) {
      return false;
    }
    return min <= +val && max >= +val;
  };
  const marks = useMemo(() => {
    const diff = max - min;
    const markStep = diff / 4;
    const marks = [
      min,
      Math.round(min + markStep),
      Math.round(min + markStep * 2),
      Math.round(min + markStep * 3),
      max,
    ];
    return marks.reduce((acc, cur) => {
      acc[cur] = genMarkLabel(cur);
      return acc;
    }, {});
  }, [max, min]);
  // const max = 100 - Number(initValue ?? 0);
  return (
    <PledgeCompensateRatioSliderInputRoot>
      <Tooltip title={_t('7c25899d84eb4000a2a6')}>
        <div className="label">{_t('5a714c3dc8ec4000ab05')}</div>
      </Tooltip>
      <div className="input-number-wrapper">
        <InputNumber
          className="input-number"
          min={min}
          max={max}
          value={innerValue}
          onChange={(val) => {
            console.log('input change: ', val);
            if (validateValue(val)) {
              setInnerValue(val);
              onChange(val);
            }
          }}
          unit={'%'}
          controlExpand={true}
          size="large"
        />
      </div>
      <div className="slider-wrapper">
        <Slider
          reverse={isRTL}
          onChange={(val) => {
            console.log('slider change: ', val);
            if (validateValue(val)) {
              setInnerValue(val);
              onChange(val);
            }
          }}
          // onChangeComplete={(v) => {
          //   console.log('AfterChange:', v);
          // }}
          min={min}
          max={max}
          value={innerValue}
          step={1}
          marks={marks}
        />
      </div>
    </PledgeCompensateRatioSliderInputRoot>
  );
}

// 主动申请撤单弹窗
function ApplyCanceStartModal({ setStep }) {
  const { visible, record } = useSelector((state) => state.aptp.applyCancelModalInfo, shallowEqual);
  const {
    deliveryCurrency,
    offerCurrency,
    createdAt,
    side,
    price,
    pledgeAmount,
    size,
    funds,
    liquidity,
    displayStatus,
    id,
    tax,
    platformLiquidatedRate = '5',
    fee,
  } = record || {};
  const [inputCompensationRate, setInputCompensationRate] = useState(0);
  const dispatch = useDispatch();
  const handleCancel = useCallback(() => {
    setInputCompensationRate(0);
    dispatch({
      type: 'aptp/closeApplyCancelModal',
    });
  }, [dispatch]);
  const handleConfirm = useCallback(() => {
    // setInputCompensationRate(0);
    dispatch({
      type: 'aptp/applyBreakOrder',
      payload: {
        orderId: id,
        currency: deliveryCurrency,
        compensationRate: inputCompensationRate,
      },
    }).then(() => {
      setInputCompensationRate(0);
      setStep(1);
    });
  }, [deliveryCurrency, dispatch, id, inputCompensationRate, setStep]);

  const platformLiquidated = useMemo(() => {
    if (!visible) {
      return 0;
    }
    return multiply(funds, platformLiquidatedRate, 0.01);
  }, [funds, platformLiquidatedRate, visible]);

  const inputCompensation = useMemo(() => {
    if (!visible) {
      return 0;
    }
    return multiply(funds, inputCompensationRate, 0.01);
  }, [funds, inputCompensationRate, visible]);

  const returnAmount = useMemo(() => {
    if (!visible) {
      return 0;
    }
    return sub(pledgeAmount, platformLiquidated).sub(inputCompensation);
  }, [inputCompensation, platformLiquidated, pledgeAmount, visible]);

  const infoList = useMemo(() => {
    const _list = [
      {
        key: 'pledgeAmount',
        type: 'item',
        title: _t('66b4fa004f984000ac52'),
        renderValue: () => <CurrencyWithUnit value={pledgeAmount} unit={offerCurrency} />,
        disabled: side === 'SELL',
      },
      {
        key: 'funds',
        type: 'item',
        title: _t('5d822c2bbdab4000afe2'),
        renderValue: () => <CurrencyWithUnit value={funds} unit={offerCurrency} />,
        indented: side === 'BUY',
      },
      {
        key: 'fee',
        type: 'item',
        title: _t('48e87ae63e7b4000ae6a'),
        renderValue: () => <CurrencyWithUnit value={fee} unit={offerCurrency} />,
        disabled: side === 'SELL',
        indented: true,
      },
      {
        key: 'tax',
        type: 'item',
        title: _t('384d52ec27514000a5ad'),
        renderValue: () => <CurrencyWithUnit value={tax} unit={offerCurrency} />,
        disabled: !(+tax > 0) || !(side === 'BUY'),
        indented: true,
      },
      {
        key: 'Divider1',
        type: 'divider',
      },
      {
        key: 'platformLiquidated',
        type: 'item',
        title: `${_t('4a3e8c59bcd74000a053', {
          Platform_liquidated_damages: platformLiquidatedRate,
        })}%`,
        // todo 待确认
        // explainText: `平台违约金(${platformLiquidatedRate}%)`,
        renderValue: () => (
          <CurrencyWithUnit value={platformLiquidated} unit={offerCurrency} negative />
        ),
      },
      {
        key: 'inputCompensation',
        type: 'item',
        title: `${_t('50ea9313f7ba4000a0dc', { liquidated_damagesrate: inputCompensationRate })}%`,
        explainText: _t('c7e6ca6e82a14000aa43'),
        renderValue: () => (
          <CurrencyWithUnit value={inputCompensation} unit={offerCurrency} negative />
        ),
      },
      {
        key: 'returnAmount',
        type: 'item',
        title: _t('a8a95c4621bc4000ac4d'),
        renderValue: () => (
          <CurrencyWithUnit
            classNames={{ value: 'return-value' }}
            value={returnAmount}
            unit={offerCurrency}
          />
        ),
      },
    ];
    return _list.filter((one) => !one.disabled);
  }, [
    fee,
    funds,
    inputCompensation,
    inputCompensationRate,
    offerCurrency,
    platformLiquidated,
    platformLiquidatedRate,
    pledgeAmount,
    returnAmount,
    side,
    tax,
  ]);

  const renderModalBody = useCallback(() => {
    if (!visible) {
      return false;
    }
    return (
      <StyledDialogBodyWrapper>
        <StyledAlert showIcon type="warning" title={_t('129c58daacf94000af63')} />
        <PledgeCompensateRatioSliderInput
          initValue={0}
          min={0}
          max={100 - Number(platformLiquidatedRate ?? 0)}
          onChange={setInputCompensationRate}
        />
        <InfoCard infoList={infoList} />
      </StyledDialogBodyWrapper>
    );
  }, [infoList, platformLiquidatedRate, visible]);

  return (
    <Modal
      open={visible}
      onClose={handleCancel}
      title={_t('806a0f3e7ce44000a0dc')}
      onConfirm={handleConfirm}
      disabledConfirm={false}
      drawerHeightSize="auto"
    >
      {renderModalBody()}
    </Modal>
  );
}

function ApplyCanceSucModal({ setStep }) {
  const dispatch = useDispatch();
  const closeModal = useCallback(() => {
    setStep(0);
    dispatch({
      type: 'aptp/closeApplyCancelModal',
    });
  }, [dispatch, setStep]);
  return (
    <StyledApplyCancelSucDialog
      open={true}
      header={null}
      showCloseX={false}
      cancelText={null}
      onOk={closeModal}
      centeredFooterButton={true}
      okText={_t('6d0dbad46c024000a3c9')}
    >
      <div className="suc-img">
        <Status name="success" />
      </div>
      <div className="title">{_t('7b51bda36f6a4000a6d3')}</div>
      <div className="message">{_t('aa37e9d19d614000a088')}</div>
    </StyledApplyCancelSucDialog>
  );
}

export default function ApplyCancelModal() {
  const [step, setStep] = useState(0);
  return (
    <>
      {step === 0 && <ApplyCanceStartModal setStep={setStep} />}
      {step === 1 && <ApplyCanceSucModal setStep={setStep} />}
    </>
  );
}
