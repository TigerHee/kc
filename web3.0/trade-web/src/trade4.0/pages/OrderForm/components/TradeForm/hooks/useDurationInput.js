/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-16 20:33:20
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-05-14 12:39:04
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/hooks/useDurationInput.js
 * @Description:
 */
import React from 'react';
import { _t, _tHTML } from 'src/utils/lang';
import styled from '@emotion/styled';
import { isNil } from 'lodash';

const rangeValidator = ({
  value,
  timeType,
  durationHour = '0',
  durationMinute = '0',
  min_minute = 1,
  max_hour = 99,
}) => {
  const errorStr = '';
  if (isNil(value)) {
    return Promise.resolve();
  }

  if (timeType === 'durationHour') {
    return Promise.resolve();
  }

  if (durationMinute === '0' && durationHour === '0') {
    if (timeType === 'durationMinute') {
      return Promise.reject(_t("7cXGcW6utYfbJ5zvCMjt79", {
        min_minute,
        max_hour,
      }));
    }
  }
  return errorStr ? Promise.reject(errorStr) : Promise.resolve();
};

export const DropdownSpan = styled.div`
  display: flex;
  width: 100%;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  .dropdown-value {
    padding-left: 4px;
  }
`;

const UnitWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};
  > div:first-child {
    margin-right: 4px;
    overflow: visible;
  }
`;

const HourWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};
`;

// 比率范围
const useDurationInput = (conf) => {
  const {
    name,
    setFieldsValue,
    durationMinute,
    durationHour,
    totalAmount,
    singleAmount,
  } = conf;

  return {
    formItemProps: {
      name,
      rules: [
        {
          validator: (_, value) =>
            rangeValidator({
              value,
              timeType: name,
              durationHour,
              durationMinute,
              totalAmount,
              singleAmount,
            }),
        },
      ],
    },
    inputProps: {
      unit: (
        <UnitWrap>
          <HourWrap>{name === 'durationHour' ? 'h' : 'm'}</HourWrap>
        </UnitWrap>
      ),
      controls: false,
      min: 0,
      max: name === 'durationHour' ? 99 : 59,
    },
  };
};

export default useDurationInput;
