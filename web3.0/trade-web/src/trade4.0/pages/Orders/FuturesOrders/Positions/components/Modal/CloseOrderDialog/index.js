/**
 * Owner: clyne@kupotech.com
 */
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, isEqual } from 'lodash';

import { _t } from 'utils/lang';
import AdaptiveModal from '@/components/AdaptiveModal';
import { Form } from '@kux/mui';
import { usePullBestTicker } from '@/hooks/futures/useMarket';
import useInitTradePassword from '@/pages/Orders/FuturesOrders/hooks/common/useInitTradePassword';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

import LiquidationForm from './LiquidationForm';

const { useForm } = Form;

const LiquidationDialog = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const visible = useSelector((state) => state.futures_orders.liquidationVisible);
  const type = useSelector((state) => state.futures_orders.liquidationType);
  const positionItem = useSelector((state) => state.futures_orders.positionItem, isEqual);
  const ref = useRef();
  const { getPasswordStatus } = useInitTradePassword();
  const pullBestTicker = usePullBestTicker();

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    futuresSensors.position.closeOrderExpose.click(type);
  }, [type]);

  useEffect(() => {
    if (visible) {
      pullBestTicker(positionItem?.symbol);
    }
  }, [positionItem, pullBestTicker, visible]);

  const handleCloseDialog = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch({
      type: 'futures_orders/update',
      payload: {
        liquidationVisible: false,
      },
    });
  };

  const submit = async () => {
    if (ref && ref.current) {
      const hasCheckPassword = await getPasswordStatus();
      if (!hasCheckPassword) {
        dispatch({
          type: 'futures_orders/update',
          payload: {
            checkPasswordVisible: true,
            checkPasswordFinishCallback: () => {
              if (ref.current?.submit) {
                ref.current.submit();
              }
            },
          },
        });
        return;
      }
      if (ref.current?.submit) {
        ref.current.submit();
      }
    }
  };

  // 监听 size error 消息
  const handleCheckError = useCallback(
    debounce(() => {
      const inputError = form.getFieldError('size');
      if (inputError && inputError.length) {
        setIsError(true);
      } else {
        setIsError(false);
      }
      // 不需要监听 form
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 16),
    [],
  );

  const onValuesChange = useCallback(() => {
    handleCheckError();
  }, [handleCheckError]);

  useEffect(() => {
    if (!visible && form) {
      form.resetFields();
    }
  }, [visible, form]);

  return (
    <AdaptiveModal
      open={visible}
      onOk={submit}
      okText={_t('security.form.btn')}
      onClose={handleCloseDialog}
      destroyOnClose
      title={_t(type === 'limit' ? 'confirm.limit.btn' : 'confirm.market.btn')}
    >
      <Form form={form} onValuesChange={onValuesChange}>
        <LiquidationForm form={form} ref={ref} isError={isError} />
      </Form>
    </AdaptiveModal>
  );
};

export default React.memo(LiquidationDialog);
