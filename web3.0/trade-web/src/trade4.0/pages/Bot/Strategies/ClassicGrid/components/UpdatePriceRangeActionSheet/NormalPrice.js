/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import _ from 'lodash';
import SymbolPrice from 'Bot/components/Common/SymbolPrice';
import MinMaxFormItem from 'ClassicGrid/Create/MinMaxFormItem';
import { updateRange } from 'ClassicGrid/services';
import UpdatePriceBase from './UpdateRangeBase';
import { connect } from 'dva';
import Decimal from 'decimal.js';
import { _t, _tHTML } from 'Bot/utils/lang';
import { formatNumber } from 'Bot/helper';
import { Flex, Text } from 'Bot/components/Widgets';
import { withForm } from 'Bot/components/Common/CForm';
import { MAccountBalance, MGridNumFormItem } from './style';
import {
  FillAIParams,
  getTipForInPriceRange,
  getMakeUpStatus,
  defaultNormalData,
  ActionButton,
} from './RangeWidgets';

@connect((state) => state.classicgrid.createInfo)
class NormalPrice extends UpdatePriceBase {
  constructor(props) {
    super(props);
    this.type = 'normal';
    this.debounceFetch = _.debounce(
      ({ min, max, placeGrid, taskId, setMergeState, checkFormIsOk }) => {
        if (!checkFormIsOk()) {
          return setMergeState(defaultNormalData);
        }
        setMergeState({ loading: true });
        updateRange({
          isOnlyCheck: true,
          taskId,
          down: Number(min),
          up: Number(max),
          depth: +placeGrid + 1,
          TOAST_NO: true, // 不需要toast提示
        })
          .then(({ data }) => {
            const makeUpStatus = getMakeUpStatus(data);
            setMergeState(makeUpStatus);
          })
          .catch(() => {
            setMergeState(defaultNormalData);
          })
          .finally(() => {
            setMergeState({ loading: false, fetchStatus: 'done' });
          });
      },
      1000,
    );
  }
  // @overide
  fillParam = () => {
    const { form } = this.props;
    const info = this.state.info;
    // 处理将科学记数法转成正常小数
    form.setFieldsValue({
      min: Decimal(info.lowerLimit).toFixed(),
      max: Decimal(info.upperLimit).toFixed(),
      placeGrid: info.gridNum,
    });
  };
  onCheckConfirm() {
    super.onCheckConfirm().then(() => {
      const controllerRef = this.context.current;
      // 关闭当前
      controllerRef.normalPriceActionSheetRef.current.toggle();
      const { max, min } = this.props.form.getFieldsValue();
      const {
        symbolInfo: { quota },
      } = controllerRef;
      const isShowNormalFullScreen =
        quota === 'USDT' && this.state.sellBaseSize > 0 && !this.aiRange.isSameBefore(min, max);
      // 先传递数据
      controllerRef.options = {
        ...this.createOptions('normal'),
        sellBaseSize: this.state.sellBaseSize,
        isShowNormalFullScreen, // 是否显示正常修改全屏推荐页面
      };
      if (isShowNormalFullScreen) {
        // 打开正常修改全屏推荐页面
        controllerRef.normalFullScreenActionSheetRef.current.toggle();
      } else {
        // 打开下一步确认
        controllerRef.updateRangeConfirmActionSheetRef.current.toggle();
      }
    });
  }
  render() {
    let makeupStatus = this.state.makeupStatus;
    const { balance, info, addAmount, fetchStatus, lastTradedPrice } = this.state;
    const { form, values } = this.props;
    const controllerRef = this.context.current;
    const { symbolInfo, oldRange } = controllerRef;
    const { symbolCode, quotaPrecision, quota } = symbolInfo;
    const { max, min } = form.getFieldsValue();
    const hasErrors = form.getFieldsError().some((el) => el.errors?.length);

    let isNotEnough = makeupStatus === 'makeupnotok';
    // 如果之前钱不够 等充值成功后， 接口刷新
    if (isNotEnough) {
      if (balance > addAmount && addAmount > 0) {
        isNotEnough = false;
        makeupStatus = 'makeupok';
      }
    }
    this.isNotEnough = isNotEnough;

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
          noRangeLabel
          form={form}
          min={min}
          max={max}
          showTip={this.showTip}
          symbolInfo={symbolInfo}
          lastTradedPrice={lastTradedPrice}
          fee={info}
        />

        <MGridNumFormItem
          form={form}
          min={min}
          max={max}
          gridProfit={gridProfit}
          fee={info}
          symbolInfo={symbolInfo}
          levelPrice={levelPrice}
          showTip={this.showTip}
          isShowLabel={false}
          isShowGridInterval={false}
        />
        <MAccountBalance symbolCode={symbolCode} onChange={this.setBalance} />
        {!hasErrors &&
          getTipForInPriceRange({
            addAmount: `${addAmount} ${quota}`,
            makeupStatus,
            min,
            max,
            lastTradedPrice,
          })}
        <ActionButton
          btnProps={{ disabled: isNotEnough || fetchStatus !== 'done' }}
          onClick={this.onCheckConfirm.bind(this)}
          controlRef={controllerRef.normalPriceActionSheetRef}
        />
      </div>
    );
  }
}

export default withForm()(NormalPrice);
