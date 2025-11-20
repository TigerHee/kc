/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { orderTime } from '../config';
import { Dropdown, Button } from '@kux/mui';
import clsx from 'clsx';
import { formatFirstTimeInvest, getCurrentDayOfWeek, isSelectWeek } from '../util';
import { _t } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';
import { EditRow } from 'Bot/components/Common/Row';
import SvgComponent from '@/components/SvgComponent';

const { filterEffetTime } = orderTime;

export const Div = styled.div`
  overflow: hidden;
  position: relative;
  color: ${(props) => props.theme.colors.text60};
  background: ${(props) => props.theme.colors.layer};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.04);
  padding: 20px 16px;
`;
const ColumnTitle = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  padding-bottom: 12px;
  margin-bottom: 12px;
  font-weight: 500;
`;
export const ColumnBox = styled.div`
  height: 250px;
  display: flex;
  text-transform: lowercase;
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  cursor: pointer;
  .select-item {
    padding: 10px;
    height: 40px;
    line-height: 20px;
    transition: all 0.3s linear;
    margin-bottom: 8px;
    border-radius: 20px;
    &.active,
    &:hover {
      color: ${(props) => props.theme.colors.textEmphasis};
      background-color: ${(props) => props.theme.colors.primary};
    }
  }
  > div {
    flex: 1;
    min-width: 80px;
    height: 100%;
    overflow-y: auto;
    text-align: center;
    &:first-of-type {
      margin-right: 16px;
    }
    &:last-of-type {
      margin-left: 16px;
    }
  }
`;

export const ButtonRap = styled.div`
  text-align: right;
`;
/**
 * @description: 根据第一例和当前选择的 生成第二列
 * @param {Array} when
 * @param {Number} value 当前选择的第一列
 * @return {Array}
 */
function setSecondValue(when, value) {
  const target = when.find((el) => el.value === value);
  let second = [];
  if (target?.children) {
    second = target.children;
  }
  return [when, second];
}
/**
 * @description: 选择了周, 定投日选择不是今天, 就不能选择立刻下单
 * @param {array} dayOfWeek
 * @param {array} interval
 * @return {array}
 */
const initWhen = ({ dayOfWeek, interval }) => {
  if (isSelectWeek(interval)) {
    if (getCurrentDayOfWeek() !== dayOfWeek?.[0]) {
      return filterEffetTime(false);
    }
  }
  return filterEffetTime(true);
};
/**
 * @description: 第一次下单的时间选择器
 * @param {Array} value [Hour, Minites]
 * @param {*} onChange
 * @param {Function} setVisible 关闭overLay
 * @return {*}
 */
const Overlay = React.memo(({ value: allFormData, onChange, setVisible }) => {
  const executeTime = allFormData.executeTime ?? [];
  // 每次打开都重新计算时间
  const whenRef = useRef(
    initWhen({
      dayOfWeek: allFormData.dayOfWeek,
      interval: allFormData.interval,
    }),
  );
  const [columns, setColumns] = useState(() => {
    return setSecondValue(whenRef.current, executeTime ? executeTime[0] : '');
  });
  const [select, setSelect] = useState(executeTime);

  const orderTimeSelectList = useRef();

  // 处理打开滚动到指定的位置
  useEffect(() => {
    setTimeout(() => {
      const activeItems = orderTimeSelectList.current?.querySelectorAll('.active');
      for (let i = 0; i < activeItems?.length; ++i) {
        activeItems[i] && activeItems[i].scrollIntoView({ block: 'center' });
      }
    }, 100);
  }, []);

  const onFirstColumnClicked = useCallback((value) => {
    setSelect([value, 0]);
    setColumns(setSecondValue(whenRef.current, value));
  }, []);

  const onSelected = useCallback((secondValue) => {
    setSelect((e) => {
      return [e[0], secondValue];
    });
  }, []);
  const onCancel = () => {
    setVisible(false);
  };
  const onConfirm = () => {
    onChange({ executeTime: select });
    setVisible(false);
  };
  return (
    <Div>
      <ColumnTitle>
        {formatFirstTimeInvest({
          executeTime: select,
          interval: allFormData.interval,
          dayOfWeek: allFormData.dayOfWeek,
        })}
      </ColumnTitle>
      <ColumnBox ref={orderTimeSelectList}>
        <div className="column-left">
          {columns[0].map((item, index) => {
            return (
              <div
                className={clsx('select-item', {
                  active: select[0] === item.value,
                })}
                key={item.value}
                onClick={() => onFirstColumnClicked(item.value)}
              >
                {item.label}
              </div>
            );
          })}
        </div>
        <div className="column-right">
          {columns[1].map((item, index) => {
            return (
              <div
                className={clsx('select-item', {
                  active: select[1] === item.value,
                })}
                key={item.label}
                onClick={() => onSelected(item.value)}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </ColumnBox>
      <ButtonRap>
        <Button onClick={onConfirm} variant="text" type="brandGreen">
          {_t('gridwidget6')}
        </Button>
      </ButtonRap>
    </Div>
  );
});

const MDropdown = styled(Dropdown)`
  width: 100%;
  .KuxDropDown-trigger {
    width: 100%;
    > div {
      width: 100%;
    }
  }
`;
const FakePicker = styled.div`
  height: 40px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.cover4};
  padding: 0 12px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    background: ${({ theme }) => theme.colors.cover8};
  }
`;
/**
 * @description: 第一次下单
 * @param {object} value
 * @return {*}
 */
export default ({ value, onChange, type }) => {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(100);
  const pref = useRef();
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        if (pref.current) {
          setWidth(Math.min(pref.current.clientWidth, 400));
        }
      });
    }
  }, [visible]);
  if (type === 'create') {
    return (
      <MDropdown
        trigger="click"
        popperOptions={{ strategy: 'fixed' }}
        disablePortal={false}
        overlay={<Overlay onChange={onChange} value={value} setVisible={setVisible} />}
        placement="bottom-end"
        visible={visible}
        onVisibleChange={setVisible}
        popperStyle={{ width, zIndex: 3000 }}
      >
        <FakePicker ref={pref}>
          <Text>{formatFirstTimeInvest(value)}</Text>
          <SvgComponent
            fileName="botsvg"
            type="clock"
            width="16"
            height="16"
            keepOrigin
            color="none"
          />
        </FakePicker>
      </MDropdown>
    );
  }
  return (
    <EditRow
      label={_t('auto.firstordertime')}
      valueSlot={
        <Dropdown
          trigger="click"
          popperOptions={{ strategy: 'fixed' }}
          disablePortal={false}
          overlay={<Overlay onChange={onChange} value={value} setVisible={setVisible} />}
          placement="bottom-end"
          visible={visible}
          onVisibleChange={setVisible}
        >
          <Text cursor color="text">
            {formatFirstTimeInvest(value)}
          </Text>
        </Dropdown>
      }
    />
  );
};
