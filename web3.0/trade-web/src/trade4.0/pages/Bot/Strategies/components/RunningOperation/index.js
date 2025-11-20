/**
 * Owner: mike@kupotech.com
 */
import React, { useMemo } from 'react';
import { styled } from '@kux/mui/emotion';
import { Text, Flex } from 'Bot/components/Widgets';
import SvgComponent from '@/components/SvgComponent';
import { ICMoreOutlined, ICCloseOutlined, ICInfoFilled } from '@kux/icons';
import Popover from 'Bot/components/Common/Popover';
import DropdownSelect from '@/components/DropdownSelect';
import { showNotice } from 'Bot/utils/util';
import { _t, _tHTML } from 'Bot/utils/lang';
import { trackClick } from 'utils/ga';
import {
  useRunContext,
  useHistoryContext,
} from 'Bot/Module/BotOrderAndProfit/Running/runContext.js';
import { getStopInfo } from './RunningStatus';
import Starting, { CSpin } from './Starting';
import getMenus from './dropdownConfig';
import { isEmpty } from 'lodash';
import { WrapperContext } from 'Bot/Module/BotOrderAndProfit/config';

const Box = styled.div`
  display: flex;
  line-height: 16px;
  align-items: center;
  span.icon-stop-info {
    text-align: left;
    display: flex;
    align-items: flex-start;
    max-width: 350px;
  }
  .running-lists-md & {
    width: 100%;
    ${({ hasRealStopInfo }) => {
      if (hasRealStopInfo) {
        return `
          .close-more-box {
            width: 100%;
            justify-content: space-between;
          }
        `;
      } else {
        return `justify-content: space-between;`;
      }
    }}
  }
  .dropdown-value {
    padding: 0;
  }
  .dropdown-item {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.text};
    &:last-of-type {
      border-top: 1px solid ${(props) => props.theme.colors.divider8};
    }
  }
  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: ${(props) => props.theme.colors.icon};
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.colors.text};
    }
  }
`;
const More = styled(ICMoreOutlined)`
  width: 16px;
  height: 16px;
  margin-left: 16px;
  color: ${(props) => props.theme.colors.icon};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;
const Right = styled.span`
  text-align: right;
  padding-right: 16px;
  ${({ cursor }) => {
    if (cursor) {
      return {
        cursor: 'pointer',
      };
    }
  }}
  > svg,
  span {
    vertical-align: middle;
  }
`;
const InfoIcon = styled(ICInfoFilled)`
  width: 16px;
  height: 16px;
  fill: ${({ theme, color }) => theme.colors[color]};
`;

export { getStopInfo };
/**
 * @description: 判断当前价格是否超出区间
 * @return {*}
 */
const isOutOfPriceRange = ({ status, price, down, up }) => {
  return status === 'RUNNING' && (+price < +down || +price > +up);
};

const ShowCloseIconAndPopover = ({
  stopInfo,
  handleAutoStop,
  handleUserStop,
  color,
  isRunningMode,
}) => {
  return (
    <React.Fragment>
      {stopInfo.content ? (
        <Popover placement="top" content={stopInfo.content} className="notDir">
          <Right cursor className="icon-stop-info">
            <InfoIcon color={color} />
            <Text color="text60" ml={4}>
              {stopInfo.text}
            </Text>
          </Right>
        </Popover>
      ) : (
        <Right className="icon-stop-info">
          <InfoIcon color={color} />
          <Text color="text60" ml={4}>
            {stopInfo.text}
          </Text>
        </Right>
      )}
      {isRunningMode ? (
        <SvgComponent type="shutdown" fileName="botsvg" onClick={handleUserStop} />
      ) : (
        <ICCloseOutlined onClick={handleAutoStop} />
      )}
    </React.Fragment>
  );
};
function OperationSwitch(props) {
  const { isJustCreated, status, stopInfo, onFresh, item } = props;
  const { onAutoStop, onTriggerStop } = useRunContext();
  const handleUserStopJack = () => {
    trackClick(['botClose', '1']);
    onTriggerStop({ item });
  };
  const handleAutoStopJack = () => {
    trackClick(['botAutoClose', '1']);
    onAutoStop({ item });
  };
  // 刚创建显示loading
  if (isJustCreated) {
    return <Starting onFresh={onFresh} />;
  }
  // 运行中
  if (status === 'RUNNING') {
    const StopInfo = getStopInfoByItem(item);
    if (StopInfo) {
      return (
        <ShowCloseIconAndPopover
          isRunningMode
          color="complementary"
          stopInfo={StopInfo}
          handleAutoStop={handleAutoStopJack}
          handleUserStop={handleUserStopJack}
        />
      );
    }
    return <SvgComponent type="shutdown" fileName="botsvg" onClick={handleUserStopJack} />;
  }
  // 现货网格暂停中/超出价格区间 当运行处理
  if (+item.type === 1 && status === 'PAUSED') {
    return (
      <ShowCloseIconAndPopover
        isRunningMode
        color="complementary"
        stopInfo={stopInfo}
        handleAutoStop={handleAutoStopJack}
        handleUserStop={handleUserStopJack}
      />
    );
  }

  // 正在停止
  if (status === 'STOPPING') {
    return (
      <Flex vc className="bot-stopping">
        <CSpin type="normal" size="xsmall" />
        <Text color="text60" pl={4}>
          {_t('card2')}
        </Text>
      </Flex>
    );
  }
  /* 异常情况下 显示 */
  if (stopInfo) {
    return (
      <ShowCloseIconAndPopover
        isRunningMode={stopInfo.isRunningMode}
        color="secondary"
        stopInfo={stopInfo}
        handleAutoStop={handleAutoStopJack}
        handleUserStop={handleUserStopJack}
      />
    );
  }
  return null;
}

const getStopInfoByItem = (item) => {
  let hereStatus = item.status;
  if (item.status === 'RUNNING') {
    // 现货网格暂停中/合约网格超出价格区间 当运行处理
    if (+item.type === 1 || +item.type === 3) {
      // 合约部分平仓 优先级高
      if (item.liquidFokTime) {
        hereStatus = 'PART_LIQUIDATED';
      } else if (isOutOfPriceRange(item)) {
        // 价格超出区间
        hereStatus = 'OUT_OF_PRICE_RANGE';
      }
    }
  }

  return getStopInfo({
    status: hereStatus,
  });
};

const smScreen = ['sm', 'md'];
/**
 * @description: 运行中 错误信息 那块
 * @return {*}
 */
export default React.memo((props) => {
  const screen = React.useContext(WrapperContext);
  const { onDetail } = useRunContext();
  const { status, item, stopInfo } = props;
  const onHandleDetail = () => {
    trackClick(['botDetailClick', 'detail']);
    if (window.IS_NEW_TRADE_BOT) {
      onDetail(item);
    } else {
      showNotice(props.item.type);
    }
  };
  const onSelect = (whichSelect) => {
    if (window.IS_NEW_TRADE_BOT) {
      if (whichSelect === 'onDetail') {
        onHandleDetail();
      } else {
        const handleFuncName = whichSelect;
        if (typeof props[handleFuncName] === 'function') {
          props[handleFuncName]();
          trackClick(['botDetailClick', handleFuncName]);
        }
      }
    } else {
      showNotice(props.item.type);
    }
  };

  const straType = item.type;
  const menus = useMemo(() => {
    return getMenus(straType, status);
  }, [straType, status]);

  const isShowMore = window.bot_source_is_from_order_center
    ? false
    : menus.length > 0 && (isEmpty(stopInfo) || stopInfo?.isRunningMode);
  const hasRealStopInfo = !isEmpty(getStopInfoByItem(item));
  // 最小屏幕下， 需要给最后一个td 添加 一个label： 操作
  return (
    <Box hasRealStopInfo={hasRealStopInfo}>
      {smScreen.includes(screen) && !hasRealStopInfo && (
        <Text color="text40" fs={12} className="operation-text">
          {_t('operation')}
        </Text>
      )}
      <Flex vc className="close-more-box">
        {/* 关闭按钮图标 */}
        <OperationSwitch {...props} />
        {/* 更多按钮 */}
        {isShowMore &&
          (menus.length <= 1 ? (
            <More onClick={onHandleDetail} />
          ) : (
            <DropdownSelect
              placement="bottom-end"
              configs={menus}
              isShowArrow={false}
              renderLabel={() => <More />}
              overlayProps={{ onSelect }}
              disablePortal={false}
            />
          ))}
      </Flex>
    </Box>
  );
});
/**
 * @description: 历史记录更多按钮
 * @param {*} item
 * @return {*}
 */
export const HistoryMore = ({ item, className }) => {
  const { onDetail } = useHistoryContext();
  const onHandleDetail = () => {
    trackClick(['botHistoryDetailClick', '1']);
    if (window.IS_NEW_TRADE_BOT) {
      onDetail(item);
    } else {
      showNotice(item.type);
    }
  };
  if (window.bot_source_is_from_order_center) {
    return null;
  }
  return <More className={className} onClick={onHandleDetail} />;
};
