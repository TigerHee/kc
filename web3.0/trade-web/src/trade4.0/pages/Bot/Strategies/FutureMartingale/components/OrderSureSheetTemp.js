/*
 * @Owner: mike@kupotech.com
 */
import React from 'react';
import { Text } from 'Bot/components/Widgets';
import * as S from '../Create/style.js';
import SideTextByDirection from './SideTextByDirection';
import Row from 'Bot/components/Common/Row';
import FutureTag from 'Bot/components/Common/FutureTag';
import { useDispatch } from 'dva';
// import { CouponRow as GoldCouponRow } from 'GoldCoupon/ExperienceGoldCoupon';
import { isNull, floatText, formatNumber, isFutureSymbol } from 'Bot/helper';
// import { CouponRow } from 'src/strategies/components/Coupon';
import { trackClick } from 'utils/ga';
import { _t, _tHTML } from 'Bot/utils/lang';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import { getBuyAfterFallLabel } from 'FutureMartingale/util';

const OrderSure = React.memo(
  ({ sheetRef, formData, symbolInfo, clear, formatSubmitData, getLabelShow, resultType }) => {
    const { quota, symbolNameText, symbolCode } = symbolInfo;
    const dispatch = useDispatch();

    const onConfirm = () => {
      trackClick(['confirmCreate', '1'], {
        clickPosition: 'confirm',
        resultType,
      });
      sheetRef.current.updateBtnProps({
        okButtonProps: { loading: true },
      });
      dispatch({
        type: 'BotRunning/runMachine',
        payload: formatSubmitData(formData),
      })
        .then(() => {
          sheetRef.current.toggle();
          clear();
        })
        .finally((_) => {
          sheetRef.current.updateBtnProps({
            okButtonProps: { loading: false },
          });
        });
    };
    useBindDialogButton(sheetRef, onConfirm);
    return (
      <div>
        <Text as="div" mb={24} color="text" fs={16}>
          {_tHTML('clsgrid.ordersecondsure', {
            amount: formatNumber(formData.limitAsset),
            quota,
          })}
        </Text>

        <Row
          label={_t('share5')}
          value={
            isFutureSymbol(symbolCode) ? (
              <Text color="text">
                <Text pr={4}>{symbolNameText}</Text>
                <FutureTag direction={formData.direction} leverage={formData.leverage} />
              </Text>
            ) : (
              symbolNameText
            )
          }
        />

        <S.Container>
          <SideTextByDirection direction={formData.direction} isBuy simple as="div" />
          <Row
            label={_t(getBuyAfterFallLabel(formData.direction))}
            value={floatText(formData.buyAfterFall)}
          />
          <Row label={_t('aJ1yfUGXxw4C81FDYBW8Mm')} value={formData.buyTimes} />
          <Row label={_t('9Soj8pxepbL1a8gov36Ykk')} value={`${formData.buyMultiple}x`} />
        </S.Container>

        <S.Container className="mt-8 mb-12">
          <SideTextByDirection direction={formData.direction} isSell simple as="div" />
          <Row label={_t('c2mby2vVJSB48j4k73saca')} value={floatText(formData.stopProfitPercent)} />
        </S.Container>

        <Row
          label={_t('p36PVMDHJnGYexgBmLgrvN')}
          value={getLabelShow('openUnitPrice')({ formData, symbolInfo })}
        />
        <Row
          label={_t('rTsH2BV1bbEsPXqZxwNscA')}
          value={getLabelShow('circularOpeningCondition')({ formData, symbolInfo })}
        />

        {isNull(formData.minPrice) && isNull(formData.maxPrice) ? null : (
          <Row
            label={_t('g7VQsQSvnwTQ19cKnCM1ip')}
            value={getLabelShow('openPriceRange')({ formData, symbolInfo })}
          />
        )}
        {isNull(formData.stopLossPercent) && isNull(formData.stopLossPrice) ? null : (
          <Row label={_t('lossstop')} value={getLabelShow('stoploss')({ formData, symbolInfo })} />
        )}

        {/* 卡券 */}
        {/* <CouponRow coupon={formData.coupon} />
      <GoldCouponRow coupon={formData.goldCoupon} /> */}
      </div>
    );
  },
);

export default ({ sheetRef, resultType, ...rest }) => {
  const onCancel = () => {
    sheetRef.current.toggle();
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'close',
      resultType,
    });
  };
  return (
    <DialogRef
      title={_t('gridwidget5')}
      ref={sheetRef}
      okText={_t('gridwidget6')}
      cancelText={null}
      onOk={() => sheetRef.current.confirm()}
      onCancel={onCancel}
      size="medium"
    >
      <OrderSure sheetRef={sheetRef} resultType={resultType} {...rest} />
    </DialogRef>
  );
};
