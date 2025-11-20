/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Form, withForm } from 'Bot/components/Common/CForm';
import SymbolPrice from 'Bot/components/Common/SymbolPrice';
import _ from 'lodash';
import { getExtendAddAmount } from 'ClassicGrid/services';
import MinMaxFormItem from 'ClassicGrid/Create/MinMaxFormItem';
import { FillAIParams, ActionButton } from './RangeWidgets';
import UpdatePriceBase from './UpdateRangeBase';
import { connect } from 'dva';
import Decimal from 'decimal.js';
import { _t, _tHTML } from 'Bot/utils/lang';
import { formatNumber } from 'Bot/helper';
import { Flex, Text } from 'Bot/components/Widgets';
import { MAccountBalance, MGridNumFormItem } from './style';

@connect()
class ExtendPrice extends UpdatePriceBase {
  constructor(props) {
    super(props);
    this.type = 'extend';
    this.debounceFetch = _.debounce(
      ({ min, max, placeGrid, taskId, symbolCode, setMergeState, checkFormIsOk }) => {
        // 抖动前 抖动后都需要校验表单错误信息
        // 原因 form更新存在顺序问题
        if (!checkFormIsOk()) {
          return setMergeState({
            addAmount: 0,
            loading: false,
            fetchStatus: 'none',
          });
        }
        setMergeState({ loading: true });
        getExtendAddAmount({
          taskId,
          down: Number(min),
          up: Number(max),
          depth: +placeGrid + 1,
          symbol: symbolCode,
          TOAST_NO: true, // 不需要toast提示
        })
          .then(({ data = {} }) => {
            setMergeState({
              addAmount: Number(data.addAmount),
              loading: false,
              fetchStatus: 'done',
            });
          })
          .catch(() => {
            setMergeState({
              addAmount: 0,
              loading: false,
              fetchStatus: 'none',
            });
          });
      },
      1000,
    );
  }
  // @overide
  fillParam = () => {
    const { form } = this.props;
    const { min, max, placeGrid } = this.aiRange;
    // 处理将科学记数法转成正常小数
    form.setFieldsValue({
      min: Decimal(min).toFixed(),
      max: Decimal(max).toFixed(),
      placeGrid,
    });
  };
  onCheckConfirm() {
    super.onCheckConfirm().then(() => {
      const controllerRef = this.context.current;
      // 关闭当前
      controllerRef.extendPriceActionSheetRef.current.toggle();
      // 先传递数据
      controllerRef.options = this.createOptions('extend');
      // 打开全屏 测试用
      // this.context.current.normalFullScreenActionSheetRef.current.toggle();
      // 打开下一步确认
      controllerRef.updateRangeConfirmActionSheetRef.current.toggle();
    });
  }
  render() {
    const { balance, info, lastTradedPrice, addAmount, fetchStatus } = this.state;
    const { form } = this.props;
    const controllerRef = this.context.current;
    const { symbolInfo, oldRange } = controllerRef;
    const { quota, symbolCode, quotaPrecision } = symbolInfo;
    const { max, min } = form.getFieldsValue();

    const isNotEnough = (this.isNotEnough = addAmount > 0 && balance < addAmount);

    const { gridProfit, levelPrice } = this.calcParams();

    return (
      <div className="fs-14 bot-update-form">
        <Flex vc fs={14} lh="130%">
          <Text color="text40" pr={12}>
            {_t('tYKPxJknDhUUizzw6FEExc')}
          </Text>
          <Text color="text">
            {formatNumber(oldRange.down, quotaPrecision)} ～
            {formatNumber(oldRange.up, quotaPrecision)} {quota}
          </Text>
        </Flex>
        <Flex vc sb mt={10} mb={16} fs={14} lh="130%">
          <Flex vc color="text40">
            <Text pr={12}>{_t('robotparams12')}</Text>
            <SymbolPrice symbolCode={symbolCode} onChange={this.setTickerSymbol} />
          </Flex>
          <FillAIParams onSwitch={this.onAISwitch} defaultValue={1} />
        </Flex>
        <MinMaxFormItem
          mode="extend"
          noRangeLabel
          checkRange={oldRange} // 扩展区间上下区间校验范围
          form={form}
          min={min}
          max={max}
          showTip={this.showTip}
          symbolInfo={symbolInfo} // 交易对信息
          lastTradedPrice={lastTradedPrice} // 最新价格信息
          fee={info} // 创建的必要信息
        />

        <MGridNumFormItem
          form={form}
          min={min}
          max={max}
          gridProfit={gridProfit} //  网格利润范围
          fee={info}
          symbolInfo={symbolInfo}
          levelPrice={levelPrice} // 网格间距
          showTip={this.showTip}
          isShowLabel={false}
          isShowGridInterval={false}
        />
        {isNotEnough && (
          <p className="fs-14 color-secondary mb-4">{_t('iX9xEVFCgHF4fobac8VA7c', { quota })}</p>
        )}
        <MAccountBalance symbolCode={symbolCode} onChange={this.setBalance} />
        {Number(addAmount) > 0 && (
          <Text color="text60" fs={14} as="div">
            {_tHTML('2mii2HtfviiScrcRp5yg81', {
              appendInvert: `${formatNumber(addAmount, quotaPrecision)} ${quota}`,
            })}
          </Text>
        )}
        <ActionButton
          btnProps={{ disabled: isNotEnough || fetchStatus !== 'done' }}
          onClick={this.onCheckConfirm.bind(this)}
          controlRef={controllerRef.extendPriceActionSheetRef}
        />
      </div>
    );
  }
}

export default withForm()(ExtendPrice);
