/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dropdown, Button } from '@kux/mui';
import clsx from 'clsx';
import { WEEKS } from '../config';
import { isSelectWeek, formatDayOfWeek, checkExecuteTime } from '../util';
import { Div, ColumnBox, ButtonRap } from './FirstOrderDate';
import { _t } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';
import { ParamRow } from 'Bot/components/Common/Row';
import Select from '@mui/Select';
import { Form, FormItem } from 'Bot/components/Common/CForm';

const { useForm } = Form;
/**
 * @description: 定投日选择星期
 * @param {array} value
 * @param {*} onChange
 * @param {Function} setVisible 关闭overLay
 * @return {*}
 */
const Overlay = React.memo(({ value, onChange, setVisible, executeTime }) => {
  const orderTimeSelectList = useRef();
  const [select, setSelect] = useState(value);
  // 处理打开滚动到指定的位置
  useEffect(() => {
    setTimeout(() => {
      const activeItems = orderTimeSelectList.current?.querySelectorAll('.active');
      for (let i = 0; i < activeItems?.length; ++i) {
        activeItems[i] && activeItems[i].scrollIntoView({ block: 'center' });
      }
    }, 100);
  }, []);

  const onFirstColumnClicked = useCallback((_value) => {
    setSelect([_value]);
  }, []);
  const onCancel = () => {
    setVisible(false);
  };
  const onConfirm = () => {
    onChange(checkExecuteTime({ dayOfWeek: select, executeTime }));
    setVisible(false);
  };
  return (
    <Div>
      <Text color="text60" lh="130%" fs="14">
        {_t('dayofweektoinvest')}
      </Text>
      <ColumnBox ref={orderTimeSelectList}>
        <div className="column-one">
          {WEEKS().map((item) => {
            return (
              <div
                className={clsx('select-item', {
                  active: select?.[0] === item.value,
                })}
                key={item.value}
                onClick={() => onFirstColumnClicked(item.value)}
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

const popperStyle = { zIndex: 3000 };
/**
 * @description: 定投日选择器
 * @param {object} value
 * @param {enum} type (create, params)
 * @return {*}
 */
export default ({ value, onChange, type, ...rest }) => {
  const [visible, setVisible] = useState(false);

  if (!isSelectWeek(value.interval)) {
    return null;
  }
  if (type === 'create') {
    return (
      <FormItem noStyle name="dayOfWeek">
        <Select allowSearch searchIcon={false} emptyContent options={WEEKS()} />
      </FormItem>
    );
  }

  return (
    <ParamRow
      {...rest}
      label={_t('dayofweektoinvest')}
      value={
        <Dropdown
          trigger="click"
          popperOptions={{ strategy: 'fixed' }}
          popperStyle={popperStyle}
          disablePortal={false}
          overlay={
            <Overlay
              onChange={onChange}
              value={value.dayOfWeek}
              executeTime={value.executeTime}
              setVisible={setVisible}
            />
          }
          placement="bottom-end"
          visible={visible}
          onVisibleChange={setVisible}
        >
          <span>
            {formatDayOfWeek(value.dayOfWeek)}
          </span>
        </Dropdown>
      }
    />
  );
};
