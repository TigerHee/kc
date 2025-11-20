/**
 * Owner: borden@kupotech.com
 */
import {
  evtEmitter, numberFixed,
} from 'helper';


const strNumToPrecision = (num, precision) => {
  if (!Number.isInteger(+precision)) {
    throw new Error('precision must be Integer');
  }
  if (precision < 0) {
    throw new Error('precision must be large than zero');
  }
  // const _num = num.toString();
  const _num = numberFixed(num, precision);
  if (precision === 0) {
    return _num.match(new RegExp('^[0-9]+'))[0];
  }
  const regexp = new RegExp(`^[0-9]+(\\.?[0-9]{0,${precision}})?`);
  const result = _num.match(regexp);
  return result ? result[0] : _num;
};


const TradeEvent = evtEmitter.getEvt('trade');

const TradeForm = {
  // 表单快速设置
  setForm(args = {
    price: undefined, // 价格
    amount: undefined, // 数量
    triggerPrice: undefined, // 触发价
  }) {
    const params = { ...args };

    TradeEvent.emit('trade.form.fast', params);
  },
};

export const getEvt = () => {
  return TradeEvent;
};

export const setTradeForm = (fields) => {
  const nextTradeForm = fields.reduce((pre, cur) => {
    pre[cur.fieldName] = strNumToPrecision(cur.fieldValue, cur.decimal);
    return pre;
  }, {});
  TradeForm.setForm(nextTradeForm);
};

export default {
  getEvt,
  setTradeForm,
};
