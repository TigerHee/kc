/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Divider, useSnackbar } from '@kux/mui';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import { CoinRatio } from '../CreatePosition/CoinRatio';
import styled from '@emotion/styled';
import { useDispatch } from 'dva';
import { UpdateBotParams } from 'SmartTrade/services';
import { diffChange } from 'SmartTrade/util';
import SubmitSureActionSheet from 'SmartTrade/components/SubmitSureActionSheet';
import { div100 } from 'Bot/helper';
import { EntryPriceSheet } from '../EntryPrice';
import _ from 'lodash';
import { _t, _tHTML } from 'Bot/utils/lang';
import PickerCoin from 'SmartTrade/components/PickerCoinLayer/PickerCoin';
import { Flex } from 'Bot/components/Widgets';
import { useMediaQuery } from '@kux/mui/hooks';

const MDialogRef = styled(DialogRef)`
  .KuxDialog-body {
    max-width: 760px;
  }
`;
const Grid = styled.div`
  min-height: 460px;
  display: flex;
  div.bot-smart-search {
    padding: 0;
  }
  div.bot-smart-tabs {
    padding-left: 0;
  }
  thead tr th {
    background: transparent;
    &:first-of-type {
      padding-left: 0;
    }
    &:last-of-type,
    &:nth-of-type(3) {
      padding-right: 0;
    }
  }
  div.KuxTable-virtual-table-row-cell-first {
    padding-left: 0;
  }
  div.KuxTable-virtual-table-row-cell-last {
    padding-right: 0;
  }
  td.coin-ratio-input {
    width: 100px !important;
  }
  > div {
    flex: 1;
    height: unset;
    max-width: calc(50% - 16px);
  }
  .KuxDivider-vertical {
    max-width: 1px;
  }
`;
/**
 * @description: 检查增加了币种之后的投资额和之前的比较， 是否足够， 不够找出超过的币种，提示用户
 * @param {Number} minInvestment 最小投资额度
 * @param {Array} baseMinSizeArr 币种最小投资额度列表
 * @param {Number} totalInvestmentUsdt 之前的总投资额度
 * @param {Object} add 本次修改新增的币种
 * @return {Boolean}
 */
const checkMinInvestIsOk = ({
  minInvestment,
  baseMinSizeArr,
  totalInvestmentUsdt,
  add,
  message,
}) => {
  // 检查最小投资额度是否符合要求
  if (totalInvestmentUsdt < minInvestment) {
    const overPart = minInvestment - totalInvestmentUsdt;
    // 得到新增中最小投资额度超过
    const overCoinPartTexts = baseMinSizeArr
      .filter((el) => {
        if (add[el.currency]) {
          if (el.minInverstment > overPart) {
            return true;
          }
        }
        return false;
      })
      .map((cn) => cn.currency)
      .join(',');

    message.info(_t('smart.investtoolittle', { coin: overCoinPartTexts }));
    return false;
  }
  return true;
};
const reducerName = 'updateTargetCoins';
/**
 * @description: 修改仓位比例；用于运行中、参数设置页面修改
 * @params {Function} onFresh 修改之后刷新函数
 * @params {Number} taskId
 * @params {Array<Coin>} targets 目标仓位
 * @params {Array} snapshots 当前仓位
 * @params {Object} method 调仓方式
 * @params {Number} totalInvestmentUsdt 总投资额度
 * @params {ref} actionSheetRef
 * @return {*}
 */
const UpdatePosition = ({
  options: { taskId, snapshots, targets, method, totalInvestmentUsdt },
  actionSheetRef,
  onFresh,
}) => {
  const coinRatioRef = useRef();
  const [coins, setCoins] = useState(() => {
    return targets.map((coin) => {
      coin = { ...coin };
      // 添加一个字段，标记曾经对改币种设置过开单价
      if (coin.isTriggered === false) {
        coin.isOldSetTriggerPrice = true;
      }
      return coin;
    });
  });

  const [fillType, setFillType] = useState('-1');
  const dispatch = useDispatch();

  useEffect(() => {
    // 初始化model中的updateTargetCoins
    dispatch({
      type: 'smarttrade/initCoinPosition',
      payload: {
        coins: targets.map((coin) => coin.currency),
        reducerName,
      },
    });
    // 销毁清空
    return () => {
      dispatch({
        type: 'smarttrade/update',
        payload: {
          [reducerName]: [],
        },
      });
    };
  }, []);

  const minInvestmentRef = useRef({
    minInvestment: 0,
    baseMinSizeArr: [],
  });
  const onMinInvestment = useCallback(({ minInvestment, baseMinSizeArr }) => {
    minInvestmentRef.current = { minInvestment, baseMinSizeArr };
  }, []);
  const { message } = useSnackbar();
  const onSubmit = () => {
    // 校验币种是否100%配比,至少一个币种
    coinRatioRef.current.validate().then((effectiveCoins) => {
      const { change, add } = diffChange(snapshots, coins);
      const { minInvestment, baseMinSizeArr } = minInvestmentRef.current;
      const isOk = checkMinInvestIsOk({
        minInvestment,
        baseMinSizeArr,
        totalInvestmentUsdt,
        add,
        message,
      });
      if (isOk) {
        setOptions({
          method,
          change,
        });
        sureRef.current.show();
      }
    });
  };
  const sureRef = useRef();
  const [sureLoading, setSureLoading] = useState(false);
  const [options, setOptions] = useState({
    change: [],
    method,
  });
  const onSure = () => {
    setSureLoading(true);
    const _targets = coins.map((coin) => {
      const temp = {
        currency: coin.currency,
        percent: div100(coin.value),
      };
      if (coin.triggerPrice && coin.isTriggered !== true) {
        temp.triggerPrice = coin.triggerPrice;
      }
      return temp;
    });
    UpdateBotParams({ taskId, targets: _targets })
      .then(() => {
        onFresh && onFresh();
        sureRef.current.close();
        actionSheetRef.current.toggle();
      })
      .finally(() => {
        setSureLoading(false);
      });
  };
  const entryPriceRef = useRef();
  // 曾经设置过的币种列表, 之前设置的，没有触发的
  const oldSetTriggerPriceList = coins.filter((current) => current.isOldSetTriggerPrice) ?? [];

  // 现在设置没有触发的
  const notTriggerPriceListsNow = coins.filter((current) => current.isTriggered === false) ?? [];
  // 合并triggerPrice数据到coins
  const onEntryPriceChange = (coinWithEntryPrice) => {
    const coinWithEntryPriceMap = _.groupBy(coinWithEntryPrice, 'currency');
    const Coins = coins.map((coin) => {
      coin = { ...coin };
      if (coinWithEntryPriceMap[coin.currency]?.[0]?.triggerPrice) {
        coin.triggerPrice = coinWithEntryPriceMap[coin.currency][0].triggerPrice;
        coin.isTriggered = false;
      } else {
        delete coin.isTriggered;
        delete coin.triggerPrice;
      }
      return coin;
    });
    setCoins(Coins);
  };

  useBindDialogButton(actionSheetRef, {
    onConfirm: onSubmit,
  });
  const EditPart = (
    <>
      <CoinRatio
        coinRatioRef={coinRatioRef}
        coins={coins} // 当前币种
        onCoinsChange={setCoins} // 币种变化回调
        onMinInvestment={onMinInvestment} // 最小投资额回调
        mode="update" // 模式字段
        reducerName={reducerName} // 同步交易对区域的model Key 名字
        fillType={fillType} // 配置模式
        setFillType={setFillType} // 配置模式变化函数
      />
      <div>
        {oldSetTriggerPriceList.length > 0 && (
          <>
            <Button
              variant="contained"
              type="default"
              mt={24}
              fullWidth
              onClick={() => entryPriceRef.current.show()}
            >
              {_t('openprice')}
              {notTriggerPriceListsNow.length > 0 ? `(${notTriggerPriceListsNow.length})` : ''}
            </Button>
            <EntryPriceSheet
              actionSheetRef={entryPriceRef}
              onConfirm={onEntryPriceChange}
              coins={oldSetTriggerPriceList}
              mode="create-page"
            />
          </>
        )}
        {/* <Button fullWidth onClick={onSubmit} mt={16}>
          {_t('gridwidget6')}
        </Button> */}
      </div>
    </>
  );
  const PCPart = (
    <Grid>
      <PickerCoin mode="update" reducerName={reducerName} />
      <Divider type="vertical" ml={16} mr={16} />
      <Flex v sb>
        {EditPart}
      </Flex>
    </Grid>
  );

  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <>
      {isH5 ? EditPart : PCPart}
      <SubmitSureActionSheet
        dialogRef={sureRef}
        confirmLoading={sureLoading}
        onConfirm={onSure}
        options={options}
        desc={_t('smart.instaceajust')}
      />
    </>
  );
};
// interface Coin {
//   currency: String, // 币种code
//   value: Number, // 百分比
//   triggerPrice: String // 触发价
//   isTriggered: Boolean // 是否已经开单
// }

export default (props) => {
  const { actionSheetRef } = props;
  return (
    <MDialogRef
      onCancel={() => actionSheetRef.current.close()}
      ref={actionSheetRef}
      title={_t('smart.updatehold')}
      size="large"
      maskClosable
      okText={_t('gridwidget6')}
      cancelText={_t('machinecopydialog7')}
      onOk={() => actionSheetRef.current.confirm()}
    >
      <UpdatePosition {...props} />
    </MDialogRef>
  );
};
