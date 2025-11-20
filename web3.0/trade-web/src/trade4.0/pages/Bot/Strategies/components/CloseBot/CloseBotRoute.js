/**
 * Owner: mikeu@kupotech.com
 */
import React from 'react';
import { _t } from 'Bot/utils/lang';
import { isFutureSymbol } from 'Bot/helper';
import DialogRef from 'Bot/components/Common/DialogRef';
import SpotCloseBot from './SpotCloseBot';
import FutureCloseBot from './FutureCloseBot';
import SmartTradeClose from './SmartTradeCloseBot';

const CloseRoute = React.memo((props) => {
  const item = props.item;
  // 合约交易对在symbolCode, 现货在symbol
  const symbolCode = item.symbolCode || item.symbol;
  let CloseBotAction = SpotCloseBot;
  //  智能持仓
  if (+item.type === 4) {
    CloseBotAction = SmartTradeClose;
  } else if (isFutureSymbol(symbolCode)) {
    //  合约类型策略
    CloseBotAction = FutureCloseBot;
  }

  return <CloseBotAction {...props} />;
});

export default ({ dialogRef }) => {
  return (
    <DialogRef
      cancelText={_t('cancel')}
      okText={_t('confirm')}
      onOk={() => dialogRef.current.confirm()}
      onCancel={() => dialogRef.current.toggle()}
      ref={dialogRef}
      title={_t('card23')}
      size="medium"
      style={{ minHeight: 200 }}
      maskClosable
    >
      <CloseRoute dialogRef={dialogRef} />
    </DialogRef>
  );
};
