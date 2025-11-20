/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import { useCountDown } from 'Bot/components/Common/CountDown';
import { getInverstCycle, INVERSTCYCLE } from 'AutomaticInverst/config';
import Dropdown from '@kux/mui/Dropdown';
import styled from '@emotion/styled';
import { isSelectWeek, getCurrentDayOfWeek } from 'AutomaticInverst/util';
import { _t } from 'Bot/utils/lang';

const Div = styled.div`
  box-shadow: 0 0 8px rgb(0 10 30 / 8%);
  border-radius: 6px;
  overflow-y: auto;
  height: 250px;
  background-color: #2d2d2f;
  color: #fff;
  > div {
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.3s linear;
    &:hover {
      color: ${(props) => props.theme.colors.primary};
      background-color: #2d2d2f;
    }
  }
`;
/**
 * @description: 多久投一次修改
 * @param {ReactRef} onConfirmRef 提交修改ref
 * @param {ReactRef} dataRef
 * @return {*}
 */
const InvestFrequency = ({ onConfirmRef, dataRef }) => {
  const { params, stopped, setDisableUpdateInvestEvery } = dataRef.current;
  const [visible, setVisible] = useState(false);
  const onSubmit = (item) => {
    const options = { interval: item.value };
    // 选择周, 如果之前没有定投日,则需要设置默认的定投日,默认当前周 日
    if (isSelectWeek(options.interval)) {
      options.dayOfWeek = params.dayOfWeek || getCurrentDayOfWeek();
    }
    onConfirmRef.current(options).then(() => {
      setVisible(false);
    });
  };
  // 倒计时小于2分钟不能修改金额
  const onTicker = useCallback((time) => {
    const { params: mparams, stopped: mstopped } = dataRef.current;
    if (!mstopped && !mparams.isReachMaxTotalCost && !mparams.isNextExceedMaxTotalCost) {
      const { day, hour, minite } = time;
      if (day === 0 && hour === 0 && minite <= 2) {
        setDisableUpdateInvestEvery(true);
      } else {
        setDisableUpdateInvestEvery(false);
      }
    }
  }, []);

  useCountDown({ nextTime: params.nextTimeDifference, onTicker });

  const ShowText = getInverstCycle(params.interval);

  if (stopped) {
    return ShowText;
  }

  return (
    <Dropdown
      trigger="click"
      overlay={
        <Div>
          {INVERSTCYCLE().map((item) => {
            return (
              <div key={item.value} onClick={() => onSubmit(item)}>
                {item.label}
              </div>
            );
          })}
        </Div>
      }
      visible={visible}
      onVisibleChange={setVisible}
      placement="bottom-end"
    >
      <span>{ShowText}</span>
    </Dropdown>
  );
};

export default InvestFrequency;
