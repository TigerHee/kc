/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import CloseBotRadio, { ReturnInCoin } from './CloseBotRadio';
import { useBindDialogConfirm } from 'Bot/components/Common/DialogRef';
import _ from 'lodash';
import useStateRef from '@/hooks/common/useStateRef';
import { CloseCouponRow } from 'Bot/Strategies/components/Coupon';
import { Text, Flex } from 'Bot/components/Widgets';
import { _t, _tHTML, t } from 'Bot/utils/lang';
import { useDispatch } from 'dva';
import { FontSizeBox } from './style';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
/**
 * @description: 合约关闭
 * @param {*} item
 * @param {*} dialogRef
 * @param {*} symbolInfo
 * @param {*} coupon
 * @return {*}
 */
const CloseBot = ({ item, dialogRef }) => {
  const symbolInfo = useFutureSymbolInfo(item.symbolCode);
  const { symbolNameText, quota } = symbolInfo;
  const useDataRef = useStateRef({
    item,
  });
  const dispatch = useDispatch();
  const onConfirm = useCallback(() => {
    const {
      item: { id },
    } = useDataRef.current;
    dialogRef.current.updateOkLoading(true);
    dispatch({
      type: 'BotRunning/toStopMachine',
      payload: {
        id,
        sellAllBase: false,
        buyBase: false,
      },
    })
      .then(() => {
        dialogRef.current.toggle();
      })
      .finally(() => {
        dialogRef.current.updateOkLoading(false);
      });
  }, []);
  useBindDialogConfirm(dialogRef, onConfirm);

  return (
    <FontSizeBox>
      <Text color="text" fs={18} as="div" mb={16} className="sm-title">
        {_t('areyousure', { bot: `${symbolNameText} ${item.name}` })}
      </Text>
      <Text color="text60" mb={16} className="sm-desc" as="div">
        {_tHTML('futrgrid.closebothint', { quota })}
      </Text>
      <CloseBotRadio defaultValue={3}>
        <div value={3}>
          <ReturnInCoin coin={quota} />
        </div>
      </CloseBotRadio>
      <CloseCouponRow taskId={item.id} />
    </FontSizeBox>
  );
};

export default CloseBot;
