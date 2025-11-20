/**
 * Owner: june.lee@kupotech.com
 */

import { useCallback, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { add } from 'src/helper';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import { Modal } from '../../components';
import { useResponsiveSize } from '../../hooks';
import { multiply } from '../../util';
import { ReviewTypeMap } from './config';
import { CurrencyWithUnit, InfoCard } from './shared';
import {
  StyledAlert,
  StyledDialogBodyWrapper,
  StyleReviewConfirmDialogText,
} from './styledComponents';

/**
 * 审批(拒绝/同意)主动申请撤单弹窗
 */
function ReviewCancelStartModal({ visible, setStep, setReviewType }) {
  const { record, actionRecord } = useSelector(
    (state) => state.aptp.reviewCancelModalInfo,
    shallowEqual,
  );
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
    fee,
  } = record || {};
  const { requestId, compensationRate } = actionRecord || {};
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    dispatch({
      type: 'aptp/closeReviewCancelModal',
    });
  }, [dispatch]);
  const handleCancel = useCallback(() => {
    setStep(1);
    setReviewType(ReviewTypeMap.REJECT);
  }, [setReviewType, setStep]);
  const handleConfirm = useCallback(() => {
    setStep(1);
    setReviewType(ReviewTypeMap.AGREE);
  }, [setReviewType, setStep]);

  const compensation = useMemo(() => {
    if (!visible) {
      return 0;
    }
    return multiply(funds, compensationRate, 0.01);
  }, [funds, compensationRate, visible]);

  const returnAmount = useMemo(() => {
    if (!visible) {
      return 0;
    }
    return add(pledgeAmount, compensation);
  }, [visible, pledgeAmount, compensation]);

  const infoList = useMemo(() => {
    const _list = [
      {
        key: 'funds',
        type: 'item',
        title: _t('5d822c2bbdab4000afe2'),
        renderValue: () => <CurrencyWithUnit value={funds} unit={offerCurrency} />,
      },
      {
        key: 'fee',
        type: 'item',
        title: _t('48e87ae63e7b4000ae6a'),
        renderValue: () => <CurrencyWithUnit value={fee} unit={offerCurrency} />,
        disabled: side === 'SELL',
      },
      {
        key: 'tax',
        type: 'item',
        title: _t('384d52ec27514000a5ad'),
        renderValue: () => <CurrencyWithUnit value={tax} unit={offerCurrency} />,
        disabled: !(+tax > 0) || !(side === 'BUY'),
      },
      {
        key: 'compensation',
        type: 'item',
        title: _t('91fb507642114000aa79'),
        // todo 确认是否有
        // explainText: _t('91fb507642114000aa79'),
        renderValue: () => <CurrencyWithUnit value={compensation} unit={offerCurrency} positive />,
      },
      {
        key: 'Divider1',
        type: 'divider',
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
  }, [fee, funds, compensation, offerCurrency, returnAmount, side, tax]);

  const renderModalBody = useCallback(() => {
    if (!visible) {
      return false;
    }
    return (
      <StyledDialogBodyWrapper>
        <StyledAlert
          showIcon
          type="warning"
          title={_t('7966c23d20544000a826', { num: compensation, currency: offerCurrency })}
        />
        <InfoCard infoList={infoList} />
      </StyledDialogBodyWrapper>
    );
  }, [compensation, infoList, offerCurrency, visible]);

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      onCancel={handleCancel}
      title={_t('806a0f3e7ce44000a0dc')}
      onConfirm={handleConfirm}
      disabledConfirm={false}
      drawerHeightSize="auto"
      cancelText={_t('7097832d79384000ac61')}
      okText={_t('952452d47c2e4000a4c9')}
    >
      {renderModalBody()}
    </Modal>
  );
}

/**
 * 审批(拒绝/同意)主动申请撤单二次确认弹窗
 */
function ReviewCancelConfirmModal({ visible, setStep, reviewType }) {
  const { record, actionRecord } = useSelector(
    (state) => state.aptp.reviewCancelModalInfo,
    shallowEqual,
  );
  const {
    deliveryCurrency,
    offerCurrency,
    createdAt,
    side,
    price,
    pledgeAmount,
    funds,
    liquidity,
    displayStatus,
    id,
    tax,
    fee,
  } = record || {};
  const { requestId, compensationRate } = actionRecord || {};
  const dispatch = useDispatch();
  const size = useResponsiveSize();
  const isH5 = size === 'sm';
  const ReviewConfirmTitleMap = useMemo(() => {
    return {
      [ReviewTypeMap.AGREE]: _t('8d407d5f13984000af15'),
      [ReviewTypeMap.REJECT]: _t('a8f274306de14000a8cc'),
    };
  }, []);
  const ReviewConfirmTextMap = useMemo(() => {
    return {
      [ReviewTypeMap.AGREE]: _t('811f8827fdc64000a9c8'),
      [ReviewTypeMap.REJECT]: _t('33f567dc01194000a735'),
    };
  }, []);
  const handleClose = useCallback(() => {
    setStep(0);
    dispatch({
      type: 'aptp/closeReviewCancelModal',
    });
  }, [dispatch, setStep]);
  const handleCancel = useCallback(() => {
    setStep(0);
  }, [setStep]);
  const handleConfirm = useCallback(() => {
    dispatch({
      type: 'aptp/reviewBreakOrder',
      payload: {
        requestId,
        currency: deliveryCurrency,
        reviewType,
      },
    }).finally(() => {
      setStep(0);
      dispatch({
        type: 'aptp/closeReviewCancelModal',
      });
    });
  }, [deliveryCurrency, dispatch, requestId, reviewType, setStep]);

  const compensation = useMemo(() => {
    if (!visible) {
      return 0;
    }
    return multiply(funds, compensationRate, 0.01);
  }, [funds, compensationRate, visible]);

  const infoList = useMemo(() => {
    const _list = [
      {
        key: 'compensationRate',
        type: 'item',
        title: _t('eba6a6759f7e4000abef'),
        renderValue: () => <CurrencyWithUnit value={compensationRate} unit={'%'} />,
      },
      {
        key: 'compensation',
        type: 'item',
        title: _t('91fb507642114000aa79'),
        renderValue: () => <CurrencyWithUnit value={compensation} unit={offerCurrency} />,
      },
    ];
    return _list.filter((one) => !one.disabled);
  }, [compensation, compensationRate, offerCurrency]);

  const renderModalBody = useCallback(() => {
    if (!visible) {
      return false;
    }
    return (
      <StyledDialogBodyWrapper>
        <StyleReviewConfirmDialogText>
          {ReviewConfirmTextMap[reviewType]}
        </StyleReviewConfirmDialogText>
        {reviewType === ReviewTypeMap.AGREE && <InfoCard infoList={infoList} />}
        {reviewType === ReviewTypeMap.REJECT && (
          <StyledAlert showIcon type="warning" title={_t('ea32139a428e4000a0f6')} />
        )}
      </StyledDialogBodyWrapper>
    );
  }, [ReviewConfirmTextMap, infoList, reviewType, visible]);

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      hideCancelBtn={isH5}
      title={ReviewConfirmTitleMap[reviewType]}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      drawerHeightSize="auto"
      okText={_t('b157ecde8abe4000a4b2')}
    >
      {renderModalBody()}
    </Modal>
  );
}

export default function ReviewCancelModal() {
  const { visible } = useSelector((state) => state.aptp.reviewCancelModalInfo, shallowEqual);
  const [step, setStep] = useState(0);
  const [reviewType, setReviewType] = useState(ReviewTypeMap.REJECT);
  return (
    <>
      <ReviewCancelStartModal
        visible={visible && step === 0}
        setReviewType={setReviewType}
        setStep={setStep}
      />
      <ReviewCancelConfirmModal
        visible={visible && step === 1}
        reviewType={reviewType}
        setStep={setStep}
      />
    </>
  );
}
