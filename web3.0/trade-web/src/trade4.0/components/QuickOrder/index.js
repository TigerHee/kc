/*
 * @owner: borden@kupotech.com
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from 'dva';
import { ICCloseOutlined } from '@kux/icons';
import Form from '@mui/Form';
import SvgComponent from '@/components/SvgComponent';
import Verify from '@/pages/OrderForm/components/Verify';
import { useGetBuySell1 } from '@/pages/Orderbook/hooks/useModelData';
import useSubmitWithVerify from '@/pages/OrderForm/hooks/useSubmitWithVerify';
import { QUICK_ORDER_VISIBLE_KEY } from '@/storageKey/chart';
import { useIsRTL } from '@/hooks/common/useLang';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { getMarginOrderModeType } from '@/hooks/useMarginOrderModeType';
import { commonSensorsFunc } from '@/meta/sensors';
import QuickOrderForm from './QuickOrderForm';
import { _t } from 'src/utils/lang';
import storage from 'src/utils/storage';
import { greaterThan } from 'src/utils/operation';
import voice from '@/utils/voice';
import { formatNumber } from '@/utils/format';
import {
  BuyDiv,
  NumDiv,
  UpArea,
  MoveDiv,
  SellDiv,
  CloseDiv,
  QuickOrderWrapper,
} from './style';

const { useForm } = Form;
const { getItem, setItem } = storage;

const formatPrice = (price, precision) => {
  if (greaterThan(price)(0)) {
    return formatNumber(price, { dropZ: false, fixed: precision });
  }
  return '-';
};

const Price = ({ name }) => {
  const buySell1 = useGetBuySell1();
  const { pricePrecision } = useGetCurrentSymbolInfo();
  return (
    <span className="mt-2">{formatPrice(buySell1[name], pricePrecision)}</span>
  );
};

const QuickOrder = () => {
  const isRTL = useIsRTL();
  const [form] = useForm();
  const dispatch = useDispatch();

  const sideRef = useRef();
  const quickRef = useRef(null);
  const upAreaRef = useRef(null);
  const draggingRef = useRef(false);

  const { onSubmit, showVerify } = useSubmitWithVerify({
    orderType: 'marketPrise',
    loadingPrefix: 'loading_quick',
  });

  const [position, setPosition] = useState(
    getItem('quickOrderPosition') || { x: 0, y: -400 },
  );

  const loadingBuy = useSelector(state => state.tradeForm.loading_quick_buy);
  const loadingSell = useSelector(state => state.tradeForm.loading_quick_sell);

  const positionLTR = { x: 0, y: 0 };
  const positionRTL = { x: 0, y: 0 };
  if (isRTL) {
    positionRTL.x = -position.x;
    positionRTL.y = position.y;
  } else {
    positionLTR.x = position.x;
    positionLTR.y = position.y;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 检查元素是否完全在视口中
          if (entry?.boundingClientRect?.top < entry?.rootBounds?.top) {
            // console.log('在视口上方');
            // 调整元素的位置使其进入视口的上方
            // quickRef.current.style.position = 'fixed';

            const currentTranslate = quickRef.current?.style?.transform;

            // 使用正则表达式从transform样式中提取出x和y的值
            const match = /translate\(([^,]+),\s*([^)]+)\)/.exec(
              currentTranslate,
            );
            const x = parseFloat(match[1]);
            // const y = parseFloat(match[2]);
            const currentY = -(window.innerHeight - 160);

            quickRef.current.style.transform = `translate(${`${x}px`},${`${currentY}px`})`;
            if (isRTL) {
              setItem('quickOrderPosition', { x: -x, y: currentY });
              setPosition({ x: -x, y: currentY });
            } else {
              setItem('quickOrderPosition', { x, y: currentY });
              setPosition({ x, y: currentY });
            }
          }
          // else if (
          //   entry.boundingClientRect.bottom > entry.rootBounds.bottom
          // ) {
          //   console.log('在视口下方');
          //   // 调整元素的位置使其进入视口的下方
          // } else {
          //   console.log('在视口中');
          // }
        });
      },
      {
        root: null, // 使用视口作为根元素
        threshold: 1.0, // 当目标元素的100%在根元素中时触发回调
      },
    );

    if (quickRef.current) {
      observer.observe(quickRef.current);
    }

    // 当组件卸载时，停止观察
    return () => {
      if (quickRef.current) {
        observer.unobserve(quickRef.current);
      }
    };
  }, [isRTL]);

  // 买卖边
  const getSide = useCallback(() => {
    return sideRef.current;
  }, []);

  const onBtnClick = useCallback(async (side, e) => {
    e.persist();
    e.preventDefault();
    // 买入卖出按钮埋点
    commonSensorsFunc([
      'quickOrder',
      side === 'buy' ? 'spotFastOrderMarketBuy' : 'spotFastOrderMarketSell',
      'click',
    ]);
    sideRef.current = side;
    form
      .validateFields()
      .then(async (vals) => {
        const { currentMarginOrderMode } = getMarginOrderModeType({ side });
        const res = await onSubmit({
          side,
          byQuantity: true,
          isQuickOrder: true,
          currentMarginOrderMode,
          values: { price: 1, showAdvanced: false, ...vals },
        });
        // 成功发布委托，清空表单输入
        if (res?.success) {
          form.resetFields();
        }
      })
      .catch(() => {
        voice.notify('error_boundary');
      })
      .finally(() => {
        sideRef.current = undefined;
      });
  }, []);

  const handleStart = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    draggingRef.current = true;
    dispatch({
      type: 'setting/update',
      payload: {
        isDragging: true,
      },
    });
  }, []);

  const handleStop = useCallback(
    (e, data) => {
      e.preventDefault();
      if (isRTL) {
        setPosition({ x: -data.x, y: data.y });
        setItem('quickOrderPosition', { x: -data.x, y: data.y });
      } else {
        setPosition({ x: data.x, y: data.y });
        setItem('quickOrderPosition', { x: data.x, y: data.y });
      }

      setTimeout(() => {
        draggingRef.current = false;
      });
      dispatch({
        type: 'setting/update',
        payload: {
          isDragging: false,
        },
      });
    },
    [isRTL],
  );

  const onClose = useCallback(() => {
    setItem(QUICK_ORDER_VISIBLE_KEY, false);
    dispatch({
      type: 'setting/update',
      payload: {
        quickOrderVisible: false,
      },
    });
  }, []);

  return (
    <Draggable
      bounds="body"
      handle=".handle"
      ref={draggingRef}
      onDrag={handleDrag}
      onStop={handleStop}
      onStart={handleStart}
      position={isRTL ? positionRTL : positionLTR}
    >
      <QuickOrderWrapper ref={quickRef}>
        <UpArea showVerify={showVerify} ref={upAreaRef}>
          <MoveDiv className="handle">
            <SvgComponent type="drag-v4" width={6} height={14} />
          </MoveDiv>
          <BuyDiv loading={loadingBuy} onClick={(e) => onBtnClick('buy', e)}>
            <span>
              {_t('orders.oper.market.buy')}
              {loadingBuy ? '...' : ''}
            </span>
            <Price name="sell1" />
          </BuyDiv>
          <NumDiv>
            <QuickOrderForm form={form} getSide={getSide} />
          </NumDiv>
          <SellDiv loading={loadingSell} onClick={(e) => onBtnClick('sell', e)}>
            <span>
              {_t('orders.oper.market.sell')}
              {loadingSell ? '...' : ''}
            </span>
            <Price name="buy1" />
          </SellDiv>
          <CloseDiv onClick={onClose}>
            <ICCloseOutlined size="16" className="qo_text" />
          </CloseDiv>
        </UpArea>
        {showVerify && (
          <Verify
            isSimple
            style={{ width: '100%' }}
          />
        )}
      </QuickOrderWrapper>
    </Draggable>
  );
};

export default React.memo(QuickOrder);
