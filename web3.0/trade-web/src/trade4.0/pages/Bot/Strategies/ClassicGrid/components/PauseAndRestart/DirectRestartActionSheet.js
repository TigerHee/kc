/**
 * Owner: mike@kupotech.com
 */
import React, { useLayoutEffect, useState } from 'react';
import { Collapse, useSnackbar } from '@kux/mui';
import { getSymbolInfo } from 'Bot/hooks/useSpotSymbolInfo';
import { getRestartParams, restartBot } from 'ClassicGrid/services';
import Decimal from 'decimal.js';
import { useDispatch } from 'dva';
import { formatNumber } from 'Bot/helper';
import { _tHTML, _t } from 'Bot/utils/lang';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import styled from '@emotion/styled';
import { Text, Div, Divider } from 'Bot/components/Widgets';
import HintText from 'Bot/components/Common/HintText';

const Box = styled.div`
  font-size: 14px;
  .price-then-now {
    .ptn-price-label {
      position: relative;
      padding-left: 16px;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        left: 0;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.cover16};
      }
      &:after {
        content: '';
        position: absolute;
        left: 3px;
        width: 1px;
        background-color: ${({ theme }) => theme.colors.cover16};
      }
      &.ptn-then-price-label {
        &:after {
          top: calc(50% + 3px);
          bottom: 0;
        }
      }
      &.ptn-now-price-label {
        &:before {
          background-color: ${({ theme }) => theme.colors.primary};
        }
        &:after {
          top: 0;
          bottom: calc(50% + 3px);
        }
      }
    }
  }
`;
const langHint = {
  buytolow: '21ej618M9WWAkqEzetHdBD', // 买入低
  buytohigh: 'x5xdx7uPvS1vE1Xms1ZX5p', // 卖出高
  selltolow: '8THxt2ephQVwK9zmb8m2vX', // 卖出低
  selltohigh: 'rfcQHP6HiSTotyskqxzM7n', // 卖出高
};
// 获取是买 还是卖的文案提示
const getHint = ({ symbolInfo, item, restartParams }) => {
  let langKey = '';
  const { base, quota, pricePrecision, basePrecision } = symbolInfo;
  const { side, size } = restartParams;
  langKey = side ? 'sell' : 'buy';

  // 当前价格 暂停时的价格
  const { symbolPrice, basePrice } = item;
  // 差价
  const diffPrice = Number(
    Decimal(symbolPrice)
      .sub(basePrice || 0)
      .toFixed(10, Decimal.ROUND_UP),
  );
  langKey += diffPrice >= 0 ? 'tohigh' : 'tolow';

  return _tHTML(langHint[langKey], {
    num: formatNumber(size, basePrecision),
    base: ` ${base}`,
    num2: formatNumber(Math.abs(diffPrice), pricePrecision),
    quota: ` ${quota}`,
  });
};

const DirectRestart = ({ actionSheerRef, item, onFresh, noNeedProgressAnimation = true }) => {
  let { symbolPrice, stopLossPrice, stopProfitPrice } = item;
  const { basePrice, taskId } = item;
  symbolPrice = +symbolPrice;
  stopLossPrice = +stopLossPrice;
  stopProfitPrice = +stopProfitPrice;
  // 低于止损价格
  const isLowLossPrice = Boolean(symbolPrice && stopLossPrice && symbolPrice < stopLossPrice);
  // 高于止盈价格
  const isHighProfitPrice = Boolean(
    symbolPrice && stopProfitPrice && symbolPrice > stopProfitPrice,
  );
  // 后端字段 用于是否清楚止盈止损价格
  const clearType = isLowLossPrice ? 'LOSS' : isHighProfitPrice ? 'PROFIT' : 'NONE';

  const symbolInfo = getSymbolInfo(item.symbolCode);
  const { quota, pricePrecision } = symbolInfo;
  const [hint, setHint] = useState('');
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    getRestartParams(item.taskId).then(({ data: restartParams }) => {
      setHint(getHint({ symbolInfo, item, restartParams }));
    });
  }, []);
  const { message } = useSnackbar();
  const onRestart = () => {
    actionSheerRef.current.updateBtnProps({
      okButtonProps: {
        loading: true,
      },
    });
    try {
      restartBot({
        isChangeGridRegion: false, // 不修改区间
        taskId,
        clearType, // {"LOSS", "PROFIT","NONE"}
      })
        .then(({ data: results }) => {
          message.info(_t('runningdetail'));
          actionSheerRef.current.toggle();
          onFresh && onFresh();
          // 产生多动画, 动画完成后会自动刷新
          // !noNeedProgressAnimation &&
          //   dispatch({
          //     type: 'running/update',
          //     payload: {
          //       taskIdCreateJustNow: results.taskId,
          //       isProgressForEditRange: true,
          //       progressType: 'pausedRestart',
          //     },
          //   });
        })
        .finally(() => {
          actionSheerRef.current.updateBtnProps({
            okButtonProps: {
              loading: false,
            },
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  //   获取当前价格和止盈止损的提示
  const getLimitPriceHint = () => {
    if (!isLowLossPrice && !isHighProfitPrice) return null;
    return (
      <HintText simple mt={16}>
        {isLowLossPrice && (
          <span >
            {_tHTML('gGmwRsBSuLaV8R3V9wXXSh', {
              price: formatNumber(stopLossPrice, pricePrecision),
              quota: ` ${quota}`,
            })}
          </span>
        )}
        {isHighProfitPrice && (
          <span>
            {_tHTML('uuwm2pcAJpbMxQheiy1xpK', {
              price: formatNumber(stopProfitPrice, pricePrecision),
              quota: ` ${quota}`,
            })}
          </span>
        )}
      </HintText>
    );
  };

  useBindDialogButton(actionSheerRef, {
    onConfirm: onRestart,
  });

  return (
    <Box>
      <Collapse in={Boolean(hint)} timeout={150} unmountOnExit>
        <Text color="text60">{hint}</Text>
        <Divider />
      </Collapse>
      <Div color="text60" className="price-then-now">
        <div className="Flex sb lh-22">
          <span className="ptn-price-label ptn-then-price-label">
            {_t('pn14VnprNd6VL6g5Lz3QQk')}
          </span>
          <span>
            {formatNumber(basePrice, pricePrecision)}&nbsp;{quota}
          </span>
        </div>
        <div className="Flex sb lh-22">
          <span className="ptn-price-label ptn-now-price-label">{_t('robotparams12')}</span>
          <Text color="text">
            {formatNumber(symbolPrice, pricePrecision)}&nbsp;{quota}
          </Text>
        </div>
      </Div>

      {getLimitPriceHint()}
    </Box>
  );
};

const DirectRestartActionSheet = ({ actionSheerRef, item, onFresh, noNeedProgressAnimation }) => {
  return (
    <DialogRef
      ref={actionSheerRef}
      title={_t('19bQJbAC5T5TGHxrANwb13')}
      cancelText={_t('machinecopydialog7')}
      okText={_t('gridwidget6')}
      onCancel={() => actionSheerRef.current.toggle()}
      onOk={() => actionSheerRef.current.confirm()}
      size="medium"
      maskClosable
    >
      <DirectRestart
        onFresh={onFresh}
        item={item}
        actionSheerRef={actionSheerRef}
        noNeedProgressAnimation={noNeedProgressAnimation}
      />
    </DialogRef>
  );
};
export default DirectRestartActionSheet;
