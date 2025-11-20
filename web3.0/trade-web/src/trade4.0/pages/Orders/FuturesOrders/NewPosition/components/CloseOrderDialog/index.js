/**
 * Owner: clyne@kupotech.com
 */
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, isEqual } from 'lodash';
import { Form, styled } from '@kux/mui';
// import { futuresSensors } from 'src/trade4.0/meta/sensors';
import { getLastPrice } from '@/hooks/futures/useMarket';
import { toNonExponential } from '@/utils/format';
import { useI18n, AdaptiveModal, usePullBestTicker, useVerify } from '@/pages/Futures/import';
import { transformParam } from 'utils/operation';
import LiquidationForm from './LiquidationForm';
import { namespace } from '../../config';
import { BIClick, POSITIONS, getClosePosType } from 'src/trade4.0/meta/futuresSensors/list';
import { off, on } from './utils';

const FormWrapper = styled(Form)`
  .form-size {
    .KuxForm-itemHelp {
      min-height: initial;
    }
  }
`;
const { useForm } = Form;
let timer = null;
const LiquidationDialog = () => {
  const { _t } = useI18n();
  const { checkVerify } = useVerify();
  const dispatch = useDispatch();
  const [form] = useForm();
  const visible = useSelector((state) => state[namespace].liquidationVisible);
  const type = useSelector((state) => state[namespace].liquidationType);
  const positionItem = useSelector((state) => state[namespace].positionItem, isEqual);
  const ref = useRef();
  const pullBestTicker = usePullBestTicker();

  const [isError, setIsError] = useState(false);
  const sensorType = getClosePosType(positionItem, type);
  useEffect(() => {
    if (visible && sensorType) {
      BIClick([POSITIONS.BLOCK_ID, POSITIONS.CLOSE_POS_EXPOSE], { type: sensorType });
    }
  }, [visible, sensorType]);

  useEffect(() => {
    if (visible) {
      pullBestTicker(positionItem?.symbol);
    }
  }, [positionItem, pullBestTicker, visible]);

    // 初始化值
    useEffect(() => {
      if (visible) {
        // 当弹框打开时，设置一下初始值
        const lastPrice = getLastPrice(positionItem?.symbol);
        if (lastPrice) {
          // 渲染时间有差异，延迟到下一个周期设置
          timer = setTimeout(() => {
            form.setFieldsValue({ price: toNonExponential(transformParam(lastPrice)?.toString()) });
            // 默认值设置成 100%
            if (ref.current?.onRateChange) {
              ref.current.onRateChange(1);
            }
          }, 16);
        }
        return () => {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
        };
      }
      // form 不需要监听
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positionItem, visible]);

  const handleCloseDialog = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch({
      type: `${namespace}/update`,
      payload: {
        liquidationVisible: false,
      },
    });
  };

  const submit = () => {
    BIClick([POSITIONS.BLOCK_ID, POSITIONS.CLOSE_POS_SUBMIT], { type: sensorType });
    checkVerify(() => {
      if (ref && ref.current) {
        ref.current.submit();
      }
    });
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

  const onValuesChange = useCallback(
    (v) => {
      handleCheckError();
      if (v.size && ref.current && ref.current.sizeReSet) {
        ref.current.sizeReSet();
      }
    },
    [handleCheckError],
  );

  useEffect(() => {
    on(handleCheckError);
    return () => {
      off(handleCheckError);
    };
  }, [handleCheckError]);

  useEffect(() => {
    if (!visible && form) {
      form.resetFields();
    }
  }, [visible, form]);

  return (
    <AdaptiveModal
      className="close-pos"
      open={visible}
      onOk={submit}
      okText={_t('security.form.btn')}
      onClose={handleCloseDialog}
      destroyOnClose
      title={_t(type === 'limit' ? 'confirm.limit.btn' : 'confirm.market.btn')}
    >
      <FormWrapper form={form} onValuesChange={onValuesChange}>
        <LiquidationForm form={form} ref={ref} isError={isError} />
      </FormWrapper>
    </AdaptiveModal>
  );
};

export default React.memo(LiquidationDialog);
