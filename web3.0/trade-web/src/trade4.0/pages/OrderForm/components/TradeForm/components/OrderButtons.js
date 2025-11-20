/*
 * @owner: borden@kupotech.com
 */
import React, { useContext, useEffect, useCallback, Fragment } from 'react';
import styled from '@emotion/styled';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import { _t, _tHTML } from 'src/utils/lang';
import SensorApm from 'src/utils/apm/index';
import { APMCONSTANTS } from 'src/utils/apm/apmConstants';
import Button from '@mui/Button';
import useSensorFunc from '@/hooks/useSensorFunc';
import useMarginModel from '@/hooks/useMarginModel';
import useLoginAndRegister from '@/hooks/useLoginAndRegister';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import CoinCodeToName from '@/components/CoinCodeToName';
import { useYScreen } from '@/pages/OrderForm/config';
import useTradePwdStatus from '../../../hooks/useTradePwdStatus';
import useOrderState from '../../../hooks/useOrderState';
import useSide from '../../../hooks/useSide';
import { WrapperContext, TRADE_SIDE_MAP } from '../../../config';

export const ButtonCurrency = styled.span`
  margin-left: 4px;
`;

const SubmitButton = ({ side, ...restProps }) => {
  const sensorFunc = useSensorFunc();
  const currentSymbol = useGetCurrentSymbol();
  const confirmLoading = useSelector((state) => state.tradeForm[`loading_${side}`]);

  const base = currentSymbol.split('-')[0];
  const { label, buttonType } = TRADE_SIDE_MAP[side] || {};

  useEffect(() => {
    // 不通的交易类型做不通的曝光
    sensorFunc(['trading', side, 'expose'], currentSymbol);
  }, [sensorFunc, side, currentSymbol]);

  return (
    <Button type={buttonType} loading={confirmLoading} {...restProps}>
      {label()}
      <ButtonCurrency>
        <CoinCodeToName coin={base} />
      </ButtonCurrency>
    </Button>
  );
};

const OrderButtons = React.memo((props) => {
  const dispatch = useDispatch();
  const { side } = useSide();
  const yScreen = useYScreen();
  const { onClick, ...otherProps } = props;
  const { disabledOrder } = useOrderState();
  const screen = useContext(WrapperContext);
  const { hasPwd } = useTradePwdStatus();
  const { statusInfo } = useMarginModel(['statusInfo']);
  const ucenterButtonProps = useLoginAndRegister();
  const isLogin = useSelector((state) => state.user.isLogin);
  const isThirdStep = useSelector((state) => state.callAuction.isThirdStep);
  const sensorsInstance = useSelector((state) => state.collectionSensorsStore.sensorsInstance);

  const isMd = screen === 'md';
  const commonButtonProps = {
    fullWidth: true,
    size: yScreen === 'sm' ? 'small' : 'basic',
  };
  const { noAuthButtonPropsName } = TRADE_SIDE_MAP[side] || {};

  let trackSensorInstance = null;
  const collectSensor = () => {
    try {
      if (!trackSensorInstance) {
        trackSensorInstance = new SensorApm({
          eventName: APMCONSTANTS.TRADE_ORDER_ANALYSE,
        });
      }
      if (trackSensorInstance) {
        trackSensorInstance.initSensorApm({
          eventName: APMCONSTANTS.TRADE_ORDER_ANALYSE,
        });
        sensorsInstance[APMCONSTANTS.TRADE_ORDER_ANALYSE] = trackSensorInstance;
        dispatch({
          type: 'collectionSensorsStore/collectDuration',
          payload: sensorsInstance,
        });
      }
    } catch (error) {
      console.error(error, 'SensorApmCollectorError');
    }
  };

  const handleClick = useCallback(
    debounce((e) => {
      onClick(e);
      collectSensor();
    }, 200),
    [onClick],
  );

  if (isLogin) {
    // 没有设置交易密码
    if (!hasPwd) {
      return null;
    }
    // 杠杆禁止下单状态
    if (statusInfo.isFrozenTrade && typeof statusInfo.label === 'function') {
      return (
        <Button {...commonButtonProps} loading>
          {statusInfo.label()}
        </Button>
      );
    }
    return (
      <SubmitButton
        side={side}
        onClick={handleClick}
        disabled={disabledOrder || isThirdStep}
        {...commonButtonProps}
        {...otherProps}
      />
    );
  }
  if (isMd) {
    return <Button {...commonButtonProps} {...ucenterButtonProps[noAuthButtonPropsName]} />;
  }
  return (
    <Fragment>
      <Button {...commonButtonProps} {...ucenterButtonProps.loginProps} />
      <Button
        {...commonButtonProps}
        {...ucenterButtonProps.registerProps}
        style={{ marginTop: 8 }}
      />
    </Fragment>
  );
});

export default OrderButtons;
