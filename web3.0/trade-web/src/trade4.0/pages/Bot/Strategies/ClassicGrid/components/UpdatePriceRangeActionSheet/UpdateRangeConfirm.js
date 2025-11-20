/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useCallback, useContext } from 'react';
import { _t, _tHTML } from 'Bot/utils/lang';
import { formatNumber, toSplitCase, jump, getAvailLang } from 'Bot/helper';
import Row from 'Bot/components/Common/Row';
import HintText from 'Bot/components/Common/HintText';
import { useSnackbar } from '@kux/mui';
import { useDispatch } from 'dva';
import { tipConfig } from 'ClassicGrid/config';
import ActionSheetController from './ActionSheetController';
import { Text } from 'Bot/components/Widgets';
import { useBindDialogButton } from 'Bot/components/Common/DialogRef.js';

const UpdateRangeConfirm = () => {
  const controllerRef = useContext(ActionSheetController);
  const { options, symbolInfo, updateRangeConfirmActionSheetRef, noNeedProgressAnimation } =
    controllerRef.current;
  const { pricePrecision, base, quota, basePrecision, quotaPrecision, symbolName } = symbolInfo;
  const { type } = options;
  const [loading, setLoading] = useState(false);

  const range = `${formatNumber(options.min, pricePrecision)}～
    ${formatNumber(options.max, pricePrecision)}`;
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const onFinalConfirm = useCallback(() => {
    const {
      options: { doPostAPI },
      onFresh,
    } = controllerRef.current;
    updateRangeConfirmActionSheetRef.current.updateBtnProps({
      okButtonProps: { loading: true },
    });
    doPostAPI()
      .then(() => {
        message.success(_t('runningdetail'));
        updateRangeConfirmActionSheetRef.current.toggle();
        onFresh && onFresh();
        // 产生多动画, 动画完成后会自动刷新
        !noNeedProgressAnimation &&
          dispatch({
            type: 'running/update',
            payload: {
              taskIdCreateJustNow: options.taskId,
              isProgressForEditRange: true,
              progressType: type,
            },
          });
      })
      .finally(() => {
        updateRangeConfirmActionSheetRef.current.updateBtnProps({
          okButtonProps: { loading: false },
        });
      });
  }, [loading]);
  const jumpHandler = (e) => {
    if (e.target.classList.contains('learnmore')) {
      jump(tipConfig().entryPrice.moreLinks[getAvailLang()]);
    }
  };

  useBindDialogButton(updateRangeConfirmActionSheetRef, onFinalConfirm);

  return (
    <>
      {!!options.addAmount && (
        <Row
          classValueName="color-primary"
          label={_t('hLtxXSxhoBH7tkCiKy2pG9')}
          unit={quota}
          value={formatNumber(options.addAmount, quotaPrecision)}
        />
      )}
      <Row label={_t('share5')} value={toSplitCase(symbolName)} />
      <Row label={_t('card13')} unit={quota} value={range} />
      <Row label={_t('robotparams10')} value={options.placeGrid} />

      {!!options.addAmount && (
        <Text color="text60" lh="130%" as="div" fs={14}>
          {_t('gWjJLrExpxf3ZB1mSaJcwC')}
        </Text>
      )}

      {type === 'normal' && options.sellBaseSize !== undefined && (
        <HintText className="mt-24">
          {options.sellBaseSize > 0 && (
            <span>
              {_t('3eSMT69uKhsiDgq53Mmaqp', {
                num: formatNumber(options.sellBaseSize, basePrecision),
                base,
              })}
            </span>
          )}
          {options.sellBaseSize === 0 && (
            <span onClick={jumpHandler}>{_tHTML(`updatepricerangehint`, { base, quota })}</span>
          )}
        </HintText>
      )}
    </>
  );
};

export default UpdateRangeConfirm;
