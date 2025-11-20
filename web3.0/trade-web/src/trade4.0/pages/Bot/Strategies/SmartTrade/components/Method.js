/**
 * Owner: mike@kupotech.com
 */
import React, { useRef } from 'react';
// import BotIcon from 'components/common/BotIcon';
import CountDown from 'Bot/components/Common/CountDown';
// import { UpdateMethodWhenRun } from './AjustWay';
import { getLimitTextByMethod } from '../config';
import { times100, floatToPercent } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
// import { Text, Flex } from 'Bot/components/Widgets';

const formater = ({ day, time }) => {
  if (+day !== 0) {
    return _tHTML('smart.nexttimeDay', { day, time });
  } else {
    return _tHTML('smart.nexttime', { time });
  }
};
/**
 * @description: 调仓方式展示，修改
 * @param {Object} method 调仓方式
 * @param {String} status 当前状态
 * @param {Number} executeTimeCountdown 按时间调仓倒计时
 * @param {Number} currentThreshold 按阈值调仓时的当前阈值
 * @return {*}
 */
const Method = ({ onFresh, options }) => {
  const {
    id,
    method = {},
    status,
    executeTimeCountdown,
    currentThreshold,
  } = options;
  // 显示正在调仓，没有就显示倒计时
  let nextTimeForAdjust = getLimitTextByMethod(method);
  // 是否可以修改
  let iShowEdit = false;
  // 正在停止,已经停止 就不显示倒计时/正在调仓，就直接显示调仓方式
  if (status === 'POSITION_CHANGING') {
    nextTimeForAdjust = _t('smart.ajustongoing');
    iShowEdit = false;
  } else if (status === 'RUNNING') {
    iShowEdit = true;
    const { autoChange, threshold, interval } = method;
    // 调仓关闭
    if (autoChange === false) {
      nextTimeForAdjust = _t('autojustclose');
    } else if (threshold) {
      // 按阈值 调仓百分比 和 当前阈值 显示
      nextTimeForAdjust = (
        <div>
          <div>
            {_t('smart.showchange')} {times100(threshold)}%
          </div>
          (
          {_t('4g5CPfwVMxTLqsFmCB1VYJ', {
            currentRatio: currentThreshold
              ? floatToPercent(currentThreshold)
              : '--',
          })}
          )
        </div>
      );
    } else if (interval) {
      // 按时间调仓就显示倒计时
      nextTimeForAdjust = (
        <CountDown
          nextTime={executeTimeCountdown}
          formater={formater}
          binggoText={_t('smart.ajustongoing')}
        />
      );
    }
  }
  // const dialogRef = useRef();
  // const updateMethodHandle = () => {
  //   dialogRef.current.toggle();
  // };
  return nextTimeForAdjust;
  // return (
  //   <Text type="text60" className="inlineflex vc">
  //     {nextTimeForAdjust}
  //     {iShowEdit && (
  //       <>
  //         <BotIcon id="edit" onClick={updateMethodHandle} className="ml-6" />
  //         <UpdateMethodWhenRun
  //           updateRef={dialogRef}
  //           method={method}
  //           taskId={id}
  //           onFresh={onFresh}
  //         />
  //       </>
  //     )}
  //   </Text>
  // );
};

export default Method;
