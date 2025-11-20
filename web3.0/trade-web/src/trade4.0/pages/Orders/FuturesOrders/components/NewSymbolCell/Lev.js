/*
 * @Owner: Clyne@kupotech.com
 */
import React, { memo, useCallback } from 'react';
import { ICEdit2Outlined } from '@kux/icons';
import { useLeverageDialog } from '@/hooks/futures/useLeverage';
import { useDispatch } from 'dva';
import { useChangeRealLeverageVisible } from '@/hooks/futures/useOperatorMargin';
import { styled, fx } from '@/style/emotion';
import { CROSS, namespace } from '../../NewPosition/config';
import { isFuturesCrossNew } from 'src/trade4.0/meta/const';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import { makeNumber } from 'src/trade4.0/utils/futures/makeNumber';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  ${(props) => (props.levIsEdit ? 'cursor: pointer;' : '')}
  svg {
    display: block;
    padding-left: 4px;
    ${(props) => fx.color(props, 'icon60')}
    font-size: 16px;
  }
`;
const Lev = ({ row, className }) => {
  const {
    symbol,
    leverage,
    levIsEdit,
    marginMode,
    isTrialFunds,
    maintMargin,
    currentQty,
    onLevEdit = () => {},
  } = row;
  const isCross = marginMode === CROSS;
  const dispatch = useDispatch();
  const { openLeverageDialog } = useLeverageDialog();
  const { onChangeVisible } = useChangeRealLeverageVisible();
  const { totalMargin, crossPosMargin } = useGetPositionCalcData(symbol);
  const isolateMargin = isTrialFunds ? maintMargin : totalMargin || maintMargin;
  // 体验金的仓位不需要计算，有推送
  const value = isCross ? crossPosMargin : isolateMargin;
  const onClick = useCallback(() => {
    onLevEdit();
    if (!levIsEdit) {
      return;
    }
    if (isCross) {
      // 修改杠杆dialog参数
      openLeverageDialog({ symbol, marginMode });
    } else {
      dispatch({
        type: `${namespace}/update`,
        payload: {
          appendMarginDetail: {
            ...row,
            size: currentQty,
            margin: value,
          },
        },
      });
      onChangeVisible(true);
    }
  }, [
    currentQty,
    dispatch,
    isCross,
    levIsEdit,
    marginMode,
    onChangeVisible,
    onLevEdit,
    openLeverageDialog,
    row,
    symbol,
    value,
  ]);
  if (!leverage) {
    return null;
  }
  const levText = makeNumber({
    value: leverage === 0 ? 0.01 : leverage,
    pointed: false,
    showSmall: true,
  });
  return (
    <Wrapper levIsEdit className={`symbol-lev ${className}`} onClick={onClick}>
      <div>{leverage === '--' ? leverage : `${levText}x`}</div>
      {levIsEdit ? <ICEdit2Outlined className="iconRtl" /> : <></>}
    </Wrapper>
  );
};

export default memo(Lev);
