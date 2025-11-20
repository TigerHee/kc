/**
 * Owner: mike@kupotech.com
 */
/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import AddUSDT from './AddUSDT';
import TransfterIn from './TransfterIn';
import { useDispatch, useSelector } from 'dva';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash';
import { _t, _tHTML } from 'Bot/utils/lang';
import { MIcons } from 'Bot/components/Common/Icon';
import { useSnackbar } from '@kux/mui';
import CoinIcon from '@/components/CoinIcon';
import { Flex } from 'Bot/components/Widgets';
import CollapseTransition from '@kux/mui/Collapse';

// // 目标仓位字段
// interface Coin {
//   currency: String,
//   percent: Number,
//   triggerPrice?: Number,
//   isTriggered?: Boolean
// }
// // 当前仓位里面含有目标仓位字段
// interface SnapshotsWidthTargets {
//   currency: String,
//   percent: Number,
//   triggerPrice?: Number,
//   isTriggered?: Boolean,
//   targets: Coin
// }
// // 调用此组件需要传递的参数字段
// interface Item {
//   version?: Number, // 策略版本号
//   id: Number, // 策略taskId
//   totalCost: Number, // 总成本
//   stopLoss: Number, // 止损比例
//   isSellOnStopLoss: Boolean, // 是否止损自动卖出
//   stopProfit: Number, // 止盈比例
//   isSellOnStopProfit: Boolean, // 是否止盈自动卖出
//   currencyInfo: Array<SnapshotsWidthTargets>, // 运行中追加需要传入；过滤出目标仓位targets
//   targets: Array<Coin>, // 参数设置页面需要传入;目标仓位

//   snapshots: Array<Coin> // 转入币使用；当前仓位
// }

// 弹窗标题
AddUSDT.title = 'smart.addtab1';
TransfterIn.title = 'smart.addtab2';

// 弹窗步骤枚举
const STEPS = {
  one: {
    title: 'wgXts3MJgWV9sLxEdEdfPv',
    stepValue: 'one',
  },
  two: {
    title: AddUSDT.title,
    stepValue: 'one-1',
  },
  three: {
    title: TransfterIn.title,
    stepValue: 'one-2',
  },
};

const Box = styled.div`
  background-color: ${({ theme }) => theme.colors.cover4};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  margin-bottom: 16px;
  transition: all 0.3s linear;
  padding: 12px 12px 12px 16px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  &:hover {
    background-color: ${({ theme }) => theme.colors.cover8};
  }
`;

const Choice = ({ title, children, ...rest }) => {
  return (
    <Box {...rest}>
      <Flex vc>
        <MIcons.Add color="text" size={16}></MIcons.Add>
        <span className="ml-8">{title}</span>
      </Flex>
      <Flex vc>
        {children}
        <MIcons.ArrowRight color="text" size={16} className="ml-8"></MIcons.ArrowRight>
      </Flex>
    </Box>
  );
};
//  判断是否是老机器
const isOldBot = (item) => Number(item.version) < 0.7;
/**
 * @description: 加仓选择页面
 * @param {*} item
 * @param {*} setNext
 * @return {*}
 */
const DepositChoice = ({ item, setNext }) => {
  const assetsLists = useSelector((state) => state.smarttrade.assetsLists);
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'smarttrade/getAssetsLists',
    });
  }, []);
  // 老机器人不满足加仓功能
  const setNextJack = (e) => {
    if (isOldBot(item)) {
      return message.info(_t('notcanin'));
    }
    setNext(e);
  };
  return (
    <div className="pb-32">
      <Choice onClick={() => setNextJack(STEPS.two)} title={_t(AddUSDT.title)}>
        <CoinIcon currency="USDT" showName={false} />
      </Choice>
      <CollapseTransition in={!isEmpty(assetsLists)}>
        <Choice onClick={() => setNextJack(STEPS.three)} title={_t(TransfterIn.title)}>
          {assetsLists.map((row) => (
            <CoinIcon
              showName={false}
              currency={row.currency}
              className="mr-4"
              key={row.currency}
            />
          ))}
        </Choice>
      </CollapseTransition>
    </div>
  );
};
/**
 * @description: 加仓步骤组件
 * @param {*} props
 * @return {*}
 */
const DepositPositionSwitch = (props) => {
  const { item, currentStep, setNext } = props;
  switch (currentStep) {
    case STEPS.one:
      return <DepositChoice item={item} setNext={setNext} />;
    case STEPS.two:
      setNext(STEPS.two);
      return <AddUSDT {...props} />;
    case STEPS.three:
      setNext(STEPS.three);
      return <TransfterIn {...props} />;
  }
  return null;
};
/**
 * @description: 加仓，集合：USDT加仓、币币加仓
 * @return {*}
 */
export default (props) => {
  const { actionSheetRef } = props;
  const [currentStep, setNext] = useState(STEPS.one);
  const onFinalClose = useCallback(() => {
    setNext(STEPS.one);
  }, []);
  return (
    <DialogRef
      title={_t(currentStep.title)}
      ref={actionSheetRef}
      footer={currentStep.stepValue === STEPS.one.stepValue ? null : undefined}
      okText={_t('gridwidget6')}
      cancelText={null}
      size="medium"
      onCancel={() => actionSheetRef.current.close()}
      onOk={() => actionSheetRef.current.confirm()}
      onClose={onFinalClose}
      maskClosable
      centeredFooterButton
    >
      <DepositPositionSwitch {...props} currentStep={currentStep} setNext={setNext} />
    </DialogRef>
  );
};
