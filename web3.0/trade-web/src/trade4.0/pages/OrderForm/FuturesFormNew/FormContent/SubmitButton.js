/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import clsx from 'clsx';

import Button from '@mui/Button';

import { _t, styled } from '../builtinCommon';

import { BUY, SELL, useFuturesForm } from '../config';
import { useGetYSmall } from '../hooks/useGetData';
import useWrapperScreen from '../hooks/useWrapperScreen';

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  > button {
    flex: 1;
    max-width: ${(props) => (props.isMd ? '100%' : '50%')};
    white-space: normal;
    word-break: break-word;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.1;
    padding: 0 8px;
    &:not(:last-of-type) {
      margin-right: 8px;
    }
  }
  .primary-btn {
    background: ${(props) => props.theme.colors.primary};
    &:hover {
      background: ${(props) => props.theme.colors.primary};
    }
    &:active {
      background: ${(props) => props.theme.colors.primary20};
    }
  }
`;

const SubmitButton = ({ onSubmit }) => {
  const { isMd } = useWrapperScreen();
  const futuresFormContext = useFuturesForm();
  const submitLoading = useSelector((state) => state.loading.effects['security/get_verify_type']);
  const [buttonType, setType] = useState();
  // const sensorFunc = useSensorFunc();

  useEffect(() => {
    // loading结束需要重制type
    if (!submitLoading) {
      setType('');
    }
  }, [submitLoading]);

  const handleSubmit = useCallback(
    (type) => {
      setType(type);
      onSubmit && onSubmit(type);
      // 埋点
      // sensorFunc(['trading', type]);
    },
    [onSubmit],
  );

  const isYScreenSM = useGetYSmall();

  if (isMd) {
    const isBuy = futuresFormContext?.side === BUY;
    const isClickSelf = futuresFormContext?.side === buttonType;
    return (
      <BtnWrapper isMd={isMd}>
        <Button
          className={clsx(isBuy ? 'primary-btn' : 'secondary-btn')}
          onClick={() => handleSubmit(isBuy ? BUY : SELL)}
          type={isBuy ? 'primary' : 'secondary'}
          variant="contained"
          loading={isClickSelf && submitLoading}
          size={isYScreenSM ? 'small' : 'basic'}
        >
          {_t(isBuy ? 'trade.order.buy' : 'trade.order.sell')}
        </Button>
      </BtnWrapper>
    );
  }
  return (
    <BtnWrapper>
      <Button
        className="primary-btn"
        loading={buttonType === BUY && submitLoading}
        onClick={() => handleSubmit(BUY)}
        type="primary"
        variant="contained"
        size={isYScreenSM ? 'small' : 'basic'}
      >
        {_t('trade.order.buy')}
      </Button>
      <Button
        loading={buttonType === SELL && submitLoading}
        onClick={() => handleSubmit(SELL)}
        type="secondary"
        variant="contained"
        size={isYScreenSM ? 'small' : 'basic'}
      >
        {_t('trade.order.sell')}
      </Button>
    </BtnWrapper>
  );
};

export default React.memo(SubmitButton);
